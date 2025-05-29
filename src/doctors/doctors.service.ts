import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async getDoctorAppointments(name?: string): Promise<Doctor[]> {
    if (name) {
      return await this.doctorRepository.find({
        where: {
          user: {
            first_name: name,
          },
        },
        relations: { user: true },
      });
    }
    return await this.doctorRepository.find({
      relations: { user: true },
    });
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    const existingUser = await this.userRepository.findOneBy({
      id: createDoctorDto.user_id,
    });

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
    // Find the student with appointments relation
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

    if (!isAlreadyAppointed) {
      doctor.appointment.push(appointment);
      await this.doctorRepository.save(doctor);
    }

    return doctor;
  }
}
