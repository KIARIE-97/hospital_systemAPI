import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientSessionlog } from './entities/patient-sessionlog.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { CreatePatientSessionlogDto } from './dto/create-patient-sessionlog.dto';

@Injectable()
export class PatientSessionlogsService {
  constructor(
    @InjectRepository(PatientSessionlog)
    private patientSessionlogRepository: Repository<PatientSessionlog>,
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
  ) {}

  async logPatientSession(
    createPatientSessionlogDto: CreatePatientSessionlogDto,
  ) {
    const existingpatient = await this.patientRepository.findOne({
      where: { id: createPatientSessionlogDto.patient_id },
    });

    if (!existingpatient) {
      throw new NotFoundException(
        `Patient with id ${createPatientSessionlogDto.patient_id} not found`,
      );
    }

    const sessionLog = this.patientSessionlogRepository.create({
      login_time: new Date(createPatientSessionlogDto.login_time),
      logout_time: new Date(createPatientSessionlogDto.logout_time),
      patient: existingpatient.id,
    });

    const saved = await this.patientSessionlogRepository.save(sessionLog);
    return saved.id;
  }
  async updateLogoutTime(sessionId: number) {
    const session = await this.patientSessionlogRepository.findOne({
      where: { id: sessionId },
    });

    if (!session) {
      throw new NotFoundException(`Session with id ${sessionId} not found`);
    }

    session.logout_time = new Date(); // set logout to now
    return this.patientSessionlogRepository.save(session);
  }

  async findAll(): Promise<PatientSessionlog[]> {
    return this.patientSessionlogRepository.find({
      relations: ['patient'],
    });
  }

  async findOne(id: number): Promise<PatientSessionlog | string> {
    const log = await this.patientSessionlogRepository.findOne({
      where: { id },
      relations: ['patient'],
    });
    if (!log) {
      return `No session log found with id ${id}`;
    }
    return log;
  }

  // async update(
  //   id: number,
  //   updatePatientSessionlogDto: UpdatePatientSessionlogDto,
  // ): Promise<PatientSessionlog | string> {
  //   await this.patientSessionlogRepository.update(
  //     id,
  //     updatePatientSessionlogDto,
  //   );
  //   return this.findOne(id);
  // }

  async search(query: string): Promise<PatientSessionlog[]> {
    return this.patientSessionlogRepository
      .createQueryBuilder('sessionlog')
      .leftJoinAndSelect('sessionlog.patient', 'patient')
      .where('CAST(sessionlog.patient_id AS TEXT) LIKE :query', {
        query: `%${query}%`,
      })
      .getMany();
  }

  async remove(id: number): Promise<string> {
    const log = await this.patientSessionlogRepository.findOne({
      where: { id },
    });
    if (!log) {
      return `No session log found with id ${id}`;
    }
    await this.patientSessionlogRepository.remove(log);
    return `Session log with id ${id} has been removed`;
  }
}
