import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientRepository: Repository<Patient>,
    @InjectRepository(User) private userRepository: Repository<User>,
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
      gender: createPatientDto.gender,
      address: createPatientDto.address,
      user: existingUser,
    });

    return this.patientRepository.save(newPatient);
  }
  async findAll(): Promise<Patient[]> {
    console.log('Fetching all patients from patient service');
    return await this.patientRepository
      .createQueryBuilder('patient')
      .leftJoinAndSelect('patient.user', 'user')
      .leftJoinAndSelect('patient.appointment', 'appointment')
      .getMany();
  }

  async searchPatient(search?: string) {
    if (search) {
      return this.patientRepository
        .createQueryBuilder('patient')
        .leftJoinAndSelect('patient.user', 'user')
        .where('LOWER(user.first_name) LIKE :search', {
          search: `%${search.toLowerCase()}%`,
        })
        .getMany();
    }
    return this.patientRepository.find({
      relations: ['user'],
    });
  }
  async remove(id: number): Promise<string> {
    return await this.patientRepository
      .delete(id)
      .then((result) => {
        if (result.affected === 0) {
          return `No patient found with id ${id}`;
        }
        return `Patient with id ${id} has been removed`;
      })
      .catch((error) => {
        console.error('Error removing patient:', error);
        throw new Error(`Failed to remove patient with id ${id}`);
      });
  }

  async findOne(id: number): Promise<Patient | string> {
    return await this.patientRepository
      .findOne({
        where: { id },
        relations: { user: true },
      })
      .then((patient) => {
        if (!patient) {
          return `No patient found with id ${id}`;
        }
        return patient;
      })
      .catch((error) => {
        console.error('Error finding patient:', error);
        throw new Error(`Failed to find patient with id ${id}`);
      });
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient | string> {
    await this.patientRepository.update(id, updatePatientDto);
    return await this.findOne(id);
  }
}
