import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AStatus } from './entities/appointment.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Repository } from 'typeorm';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Role, User } from 'src/users/entities/user.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    //find the patient
    const patient = await this.patientRepository.findOne({
      where: { id: createAppointmentDto.patient_id },
    });
    const doctor = await this.doctorRepository.findOne({
      where: { id: createAppointmentDto.doctor_id },
    });

    if (!patient) {
      throw new NotFoundException(
        `patient with id ${createAppointmentDto.patient_id} not found`,
      );
    }
    if (!doctor) {
      throw new NotFoundException(
        `patient with id ${createAppointmentDto.doctor_id} not found`,
      );
    }
    const newAppointment = this.appointmentRepository.create({
      appointment_date: createAppointmentDto.appointment_date,
      status: createAppointmentDto.status,
      reason: createAppointmentDto.reason,
      patient: createAppointmentDto.patient_id,
      // doctor: createAppointmentDto.doctor_id,
    });

    return this.appointmentRepository.save(newAppointment);
  }

  async addAppointmentToDoctor(
    appointment_id: number,
    doctor_id: number,
  ): Promise<Appointment> {
    // Find the course with doctor relation
    const appointment = await this.appointmentRepository.findOne({
      where: { id: appointment_id },
      relations: ['doctor'],
    });

    if (!appointment) {
      throw new NotFoundException(
        `appointment with ID ${appointment_id} not found`,
      );
    }

    // Find the doctor
    const doctor = await this.doctorRepository.findOneBy({ id: doctor_id });
    if (!doctor) {
      throw new NotFoundException(`doctor with ID ${doctor_id} not found`);
    }

    // Initialize appointment array if it doesn't exist
    if (!appointment.doctor) {
      appointment.doctor = [];
    }

    // Check if doctor is already enrolled
    const isAlreadyAppointed = appointment.doctor.some(
      (appointedDoctor) => appointedDoctor.id === doctor_id,
    );

    if (!isAlreadyAppointed) {
      appointment.doctor.push(doctor);
      await this.appointmentRepository.save(appointment);
    }

    return appointment;
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['patient', 'doctor'],
    });
  }
  async findOne(id: number): Promise<Appointment | string> {
    return await this.appointmentRepository
      .findOne({
        where: { id },
        relations: ['patient', 'doctor'],
      })
      .then((appointment) => {
        if (!appointment) {
          return `No appointment found with id ${id}`;
        }
        return appointment;
      })
      .catch((error) => {
        console.error('Error finding appointment:', error);
        throw new Error(`Failed to find appointment with id ${id}`);
      });
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment | string> {
    await this.appointmentRepository.update(id, updateAppointmentDto);
    return await this.findOne(id);
  }

  async remove(id: number, currentUser: User): Promise<any> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['patient', 'doctor'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    // const isAdmin = currentUser.role === Role.ADMIN;
    const isPatient = currentUser.role === Role.PATIENT;
    const isDoctor = currentUser.role === Role.DOCTOR;

    // ✅ Patient can cancel own appointment only (before 24 hrs)
    if (isPatient) {
      const isOwner = appointment.patient === currentUser.id;
      const cancelDeadline = new Date(appointment.appointment_date);
      cancelDeadline.setHours(cancelDeadline.getHours() - 24);
      const now = new Date();

      if (!isOwner) {
        throw new ForbiddenException(
          'You can only cancel your own appointments',
        );
      }

      if (now > cancelDeadline) {
        throw new BadRequestException(
          'Cannot cancel within 24 hours of the appointment',
        );
      }
    }

    // ✅ Doctor can cancel own appointment
    if (
      isDoctor &&
      (!Array.isArray(appointment.doctor) ||
        !appointment.doctor.some((doc) => doc.id === currentUser.id))
    ) {
      throw new ForbiddenException(
        'You can only cancel appointments assigned to you',
      );
    }

    // Instead of deleting, mark it cancelled
    appointment.status = AStatus.CANCELLED;
    await this.appointmentRepository.save(appointment);

    return { message: 'Appointment cancelled successfully' };
  }
}
