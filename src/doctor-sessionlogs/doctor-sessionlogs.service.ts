import { Injectable } from '@nestjs/common';
import { CreateDoctorSessionlogDto } from './dto/create-doctor-sessionlog.dto';
import { UpdateDoctorSessionlogDto } from './dto/update-doctor-sessionlog.dto';

@Injectable()
export class DoctorSessionlogsService {
  private sessionlogs: CreateDoctorSessionlogDto[] = [];

  create(
    createDoctorSessionlogDto: CreateDoctorSessionlogDto,
  ): CreateDoctorSessionlogDto {
    const newLog = {
      ...createDoctorSessionlogDto,
      id: this.sessionlogs.length + 1,
    };
    this.sessionlogs.push(newLog);
    return newLog;
  }

  findAll(): CreateDoctorSessionlogDto[] {
    return this.sessionlogs;
  }

  findOne(id: number): CreateDoctorSessionlogDto | undefined {
    return this.sessionlogs.find((log) => log.id === id);
  }

  update(
    id: number,
    updateDoctorSessionlogDto: UpdateDoctorSessionlogDto,
  ): CreateDoctorSessionlogDto | string {
    const index = this.sessionlogs.findIndex((log) => log.id === id);
    if (index === -1) {
      return 'Session log not found';
    }
    const updatedLog = {
      ...this.sessionlogs[index],
      ...updateDoctorSessionlogDto,
    };
    this.sessionlogs[index] = updatedLog;
    return updatedLog;
  }

  search(query: string): CreateDoctorSessionlogDto[] {
    return this.sessionlogs.filter(
      (log) =>
        log.doctor_id?.toString().includes(query) ||
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
