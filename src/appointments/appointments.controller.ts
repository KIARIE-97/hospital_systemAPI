import { Controller, Get, Post, Body, Param, Delete, Patch, Query, ParseIntPipe } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Post(':appointment_id/doctor/:doctor_id')
  addStudentToCourse(
    @Param('appointment_id', ParseIntPipe) appointment_id: number,
    @Param('doctor_id', ParseIntPipe) doctor_id: number,
  ) {
    return this.appointmentsService.addAppointmentToDoctor(appointment_id, doctor_id);
  }
  // @Get()
  // findAll() {
  //   return this.appointmentsService.findAll();
  // }addAppointmentToDoctor

  @Get()
  findAll(@Query('search') search?: string) {
    return this.appointmentsService.findAll(search);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.appointmentsService.findOne(Number(id));
  // }
  // @Get('search/:query')
  // search(@Param('query') query: string) {
  //   return this.appointmentsService.search(query);
  // }
}
