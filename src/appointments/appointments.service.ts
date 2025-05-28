import { Injectable } from '@nestjs/common';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentsService {
  private appointments: CreateAppointmentDto[] = [];

  create(createAppointmentDto: CreateAppointmentDto): CreateAppointmentDto {
    const newAppointment = {
      id: this.appointments.length + 1,
      created_at: new Date(),
      updated_at: new Date(),
      ...createAppointmentDto,
    };
    this.appointments.push(newAppointment);
    return newAppointment;
  }

  findAll(): CreateAppointmentDto[] {
    return this.appointments;
  }

  findOne(id: number): CreateAppointmentDto | undefined {
    return this.appointments.find((appt) => appt.id === id);
  }
  update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): CreateAppointmentDto | string {
    const index = this.appointments.findIndex((appt) => appt.id === id);
    if (index === -1) {
      return 'Appointment not found';
    }
    const updatedAppointment = {
      ...this.appointments[index],
      ...updateAppointmentDto,
      updated_at: new Date(),
    };
    this.appointments[index] = updatedAppointment;
    return updatedAppointment;
  }

  search(query: string): CreateAppointmentDto[] {
    return this.appointments.filter(
      (appt) =>
        appt.status?.toLowerCase().includes(query.toLowerCase()) ||
        appt.reason?.toLowerCase().includes(query.toLowerCase()),
    );
  }
  remove(id: number): string {
    const index = this.appointments.findIndex((appt) => appt.id === id);
    if (index === -1) return 'Appointment not found';
    this.appointments.splice(index, 1);
    return 'Appointment removed successfully';
  }
}
