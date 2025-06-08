import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateDoctorDto } from 'src/doctors/dto/create-doctor.dto';
import { UpdateDoctorDto } from 'src/doctors/dto/update-doctor.dto';
import { UpdatePatientDto } from 'src/patients/dto/update-patient.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Public()
@ApiBearerAuth('access-token')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Post('doctors')
  createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.adminService.createDoctor(createDoctorDto);
  }
  @Post('doctors/:doctor_id/appointment/:appointment_id')
  addAppointmenttoDoctor(
    @Param('doctor_id', ParseIntPipe) doctor_id: number,
    @Param('appointment_id', ParseIntPipe) appointment_id: number,
  ) {
    return this.adminService.addAppointmentToDoctor(doctor_id, appointment_id);
  }
  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Get('doctors')
  getAllDoctors() {
    return this.adminService.getAllDoctors();
  }

  @Get('patients')
  async getAllPatients() {
    try {
      return await this.adminService.getAllPatients();
    } catch (error) {
      console.error('Admin patient fetch error:', error);
      throw error;
    }
  }

  @Get('appointments')
  getAllAppointments() {
    return this.adminService.getAllAppointments();
  }
  @Get('patients/search')
  findPatients(@Query('search') search?: string) {
    return this.adminService.findPatients(search);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(id, updateAdminDto);
  }
  @Patch('doctors/:id')
  updateDoctor(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.adminService.updateDoctor(id, updateDoctorDto);
  }
  @Patch('patients/:id')
  updatePatient(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.adminService.updatePatient(id, updatePatientDto);
  }
  @Patch('users/:id/reset-password')
  resetUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.adminService.resetUserPassword(id, dto.newPassword);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
