import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Query } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @Post(':doctor_id/appointment/:appointment_id')
  enrollStudentInCourse(
    @Param('doctor_id', ParseIntPipe) doctor_id: number,
    @Param('appointment_id', ParseIntPipe) appointment_id: number,
  ) {
    return this.doctorsService.addAppointmenttoDoctor(
      doctor_id,
      appointment_id,
    );
  }

  @Get()
  findAll(@Query('name') name?: string) {
    return this.doctorsService.getDoctorAppointments(name);
  }
}
