import { Injectable } from '@nestjs/common';
import { CreatePatientSessionlogDto } from './dto/create-patient-sessionlog.dto';
import { UpdatePatientSessionlogDto } from './dto/update-patient-sessionlog.dto';

@Injectable()
export class PatientSessionlogsService {
  private sessionlogs: CreatePatientSessionlogDto[] = [];

  create(
    createPatientSessionlogDto: CreatePatientSessionlogDto,
  ): CreatePatientSessionlogDto {
    const newLog = {
      ...createPatientSessionlogDto,
      id: this.sessionlogs.length + 1,
    };
    this.sessionlogs.push(newLog);
    return newLog;
  }

  findAll(): CreatePatientSessionlogDto[] {
    return this.sessionlogs;
  }

  findOne(id: number): CreatePatientSessionlogDto | undefined {
    return this.sessionlogs.find((log) => log.id === id);
  }

  update(
    id: number,
    updatePatientSessionlogDto: UpdatePatientSessionlogDto,
  ): CreatePatientSessionlogDto | string {
    const index = this.sessionlogs.findIndex((log) => log.id === id);
    if (index === -1) return 'Session log not found';
    const updatedLog = {
      ...this.sessionlogs[index],
      ...updatePatientSessionlogDto,
    };
    this.sessionlogs[index] = updatedLog;
    return updatedLog;
  }

  search(query: string): CreatePatientSessionlogDto[] {
    return this.sessionlogs.filter(
      (log) =>
        log.patient_id?.toString().includes(query) ||
        log.login_time?.toString().includes(query) ||
        log.logout_time?.toString().includes(query),
    );
  }

  remove(id: number): string {
    const index = this.sessionlogs.findIndex((log) => log.id === id);
    if (index === -1) return 'Session log not found';
    this.sessionlogs.splice(index, 1);
    return 'Session log removed successfully';
  }
}
