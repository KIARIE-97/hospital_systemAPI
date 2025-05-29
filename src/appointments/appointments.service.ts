import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AStatus } from './entities/appointment.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Repository } from 'typeorm';
import { throwError } from 'rxjs';
import { Doctor } from 'src/doctors/entities/doctor.entity';

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
      status: createAppointmentDto.status as AStatus,
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

  async findAll(search?: string): Promise<Appointment[]> {
    if (search) {
      return this.appointmentRepository.find({
        relations: ['patient', 'doctor'],
      });
    }
    return this.appointmentRepository.find({
      relations: ['patient', 'doctor'],
    });
  }
}
