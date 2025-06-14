import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AStatus } from 'src/appointments/entities/appointment.entity';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { Role, User } from 'src/users/entities/user.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async getDoctorAppointments(): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      relations: { user: true, appointment: true },
    });
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const existingUser = await this.userRepository.findOneBy({
      id: createDoctorDto.user_id,
      // status: Status., // Ensure the user is active
      role: Role.DOCTOR, // Ensure the user is active and has doctor role
    })
    if (!existingUser) {
      throw new NotFoundException(
        `doctor with ID ${createDoctorDto.user_id} not found`,
      );
    }
    // Create a new Student entity with the profile relation
    const newDoctor = this.doctorRepository.create({
      specialty: createDoctorDto.specialty,
      password: createDoctorDto.password,
      user: existingUser,
    });

    return this.doctorRepository.save(newDoctor);
  }

  async addAppointmenttoDoctor(
    doctor_id: number,
    appointment_id: number,
  ): Promise<Doctor> {
    // Find the doctor with appointments relation
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctor_id },
      relations: ['appointment'],
    });

    if (!doctor) {
      throw new NotFoundException(`doctor with ID ${doctor_id} not found`);
    }

    // Find the appointment
    const appointment = await this.appointmentRepository.findOneBy({
      id: appointment_id,
    });
    if (!appointment) {
      throw new NotFoundException(
        `appointment with ID ${appointment_id} not found`,
      );
    }

    // Initialize appointments array if it doesn't exist
    if (!doctor.appointment) {
      doctor.appointment = [];
    }

    // Check if already appointed
    const isAlreadyAppointed = doctor.appointment.some(
      (enrolledappointment) => enrolledappointment.id === appointment_id,
    );
    const isAvailable = await this.doctorRepository
      .createQueryBuilder('doctor')
      .leftJoinAndSelect('doctor.user', 'user')
      .where('user.status = :status', { status: 'active' })
      .getMany();

    if (!isAlreadyAppointed && isAvailable) {
      doctor.appointment.push(appointment);
      await this.doctorRepository.save(doctor);
    }

    return doctor;
  }
  //reassign appointments to a doctor
  async reassignAppointmentsToDoctor(
    doctor_id: number,
    appointment_id: number,
  ): Promise<Doctor> {
    // Find the doctor with appointments relation
    const doctor = await this.doctorRepository.findOne({
      where: { id: doctor_id },
      relations: ['appointment'],
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID ${doctor_id} not found`);
    }

    // Find the appointment
    const appointment = await this.appointmentRepository.findOneBy({
      id: appointment_id,
    });
    if (!appointment) {
      throw new NotFoundException(
        `Appointment with ID ${appointment_id} not found`,
      );
    }

    //remove the appointment from the current doctor
    doctor.appointment = doctor.appointment.filter(currentAppointment => currentAppointment.id !== appointment_id);
 await this.doctorRepository.save(doctor);
    return doctor;
  }


  // async findAll(): Promise<Doctor[]> {
  //   return this.doctorRepository.find();
  // }

  async findOne(id: number): Promise<Doctor | string> {
    return await this.doctorRepository
      .findOneBy({ id })
      .then((doctor) => {
        if (!doctor) {
          return `No doctor found with id ${id}`;
        }
        return doctor;
      })
      .catch((error) => {
        console.error('Error finding doctor:', error);
        throw new Error(`Failed to find doctor with id ${id}`);
      });
  }

  async update(
    id: number,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor | string> {
    await this.doctorRepository.update(id, updateDoctorDto);
    return await this.findOne(id);
  }
//activate/deactivate a doctor
  // async updateStatus(id: number, updateDoctorDto: UpdateDoctorDto) {
  //   const doctor = await this.doctorRepository.findOneBy({ id });
  //   if (!doctor) {
  //     throw new NotFoundException(`Doctor with ID ${id} not found`);
  //   }

  //   // Update the doctor's status
  //   doctor.user.status = updateDoctorDto.user_id;

  //   // Save the updated doctor
  //   return await this.doctorRepository.save(doctor);
  // }
  
  async remove(id: number): Promise<string> {
    return await this.doctorRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `No doctor found with id ${id}`;
        }
        return `Doctor with id ${id} has been removed`;
      })
      .catch((error) => {
        console.error('Error removing doctor:', error);
        throw new Error(`Failed to remove doctor with id ${id}`);
      });
  }
}
