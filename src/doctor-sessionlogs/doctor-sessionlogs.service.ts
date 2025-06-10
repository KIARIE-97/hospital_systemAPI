import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorSessionlog } from './entities/doctor-sessionlog.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { CreateDoctorSessionlogDto } from './dto/create-doctor-sessionlog.dto';
import { UpdateDoctorSessionlogDto } from './dto/update-doctor-sessionlog.dto';

@Injectable()
export class DoctorSessionlogsService {
  constructor(
    @InjectRepository(DoctorSessionlog)
    private doctorSessionlogRepository: Repository<DoctorSessionlog>,
    @InjectRepository(Doctor)
    private doctorRepository: Repository<Doctor>,
  ) {}

  async create(
    createDoctorSessionlogDto: CreateDoctorSessionlogDto,
  ): Promise<DoctorSessionlog> {
    // Find the doctor
    const doctor = await this.doctorRepository.findOne({
      where: { id: createDoctorSessionlogDto.doctor_id },
    });
    if (!doctor) {
      throw new NotFoundException(
        `Doctor with id ${createDoctorSessionlogDto.doctor_id} not found`,
      );
    }

    // Create and save the session log
    const newLog = this.doctorSessionlogRepository.create({
      doctor: createDoctorSessionlogDto.doctor_id,
    });
    return this.doctorSessionlogRepository.save(newLog);
  }

  async findAll(): Promise<DoctorSessionlog[]> {
    return this.doctorSessionlogRepository.find({
      relations: ['doctor'],
    });
  }

  async findOne(id: number): Promise<DoctorSessionlog | string> {
    const log = await this.doctorSessionlogRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });
    if (!log) {
      return `No session log found with id ${id}`;
    }
    return log;
  }

  // async update(
  //   id: number,
  //   updateDoctorSessionlogDto: CreateDoctorSessionlogDto,
  // ): Promise<DoctorSessionlog | string> {
  //   await this.doctorSessionlogRepository.update(id, updateDoctorSessionlogDto);
  //   return this.findOne(id);
  // }

  async remove(id: number): Promise<string> {
    const log = await this.doctorSessionlogRepository.findOne({
      where: { id },
      relations: ['doctor'],
    });
    if (!log) {
      return `No session log found with id ${id}`;
    }
    // Clear the doctor reference before removing the session log
    (log as any).doctor = null;
    await this.doctorSessionlogRepository.save(log);
    // Remove the session log
    await this.doctorSessionlogRepository.remove(log);
    return `Session log with id ${id} has been removed`;
  }

  async search(id: number): Promise<DoctorSessionlog[]> {
    return this.doctorSessionlogRepository
      .createQueryBuilder('sessionlog')
      .leftJoinAndSelect('sessionlog.doctor', 'doctor')
      .where('(sessionlog.doctor_id) LIKE :id', {
 id: `%${id}%`,
      })
      .getMany();
  }
}
