import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Gender, Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const existingUser = await this.userRepository.findOneBy({
      id: createPatientDto.user_id,
    });

    if (!existingUser) {
      throw new NotFoundException(
        `Profile with id ${createPatientDto.user_id} not found`,
      );
    }
    const newPatient = this.patientRepository.create({
      dob: createPatientDto.dob,
      gender: createPatientDto.gender as Gender,
      address: createPatientDto.address,
      status: createPatientDto.status,
      user: existingUser,
    });

    return this.patientRepository.save(newPatient);
  }
  async findAll(name?: string): Promise<Patient[]> {
    if (name) {
      return await this.patientRepository.find({
        where: {
          user: {
            first_name: name,
          },
        },
        relations: { user: true },
      });
    }
    return await this.patientRepository.find({
      relations: { user: true },
    });
  }

  async findWithAppointment(search?: string) {
    if (search) {
      return this.patientRepository.find({
        where: [{ address: `%${search}%` }],
        relations: ['appointment'],
      });
    }
    return this.patientRepository.find({
      relations: ['appointment'],
    });
  }
}
