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
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateDoctorDto } from 'src/doctors/dto/create-doctor.dto';
import { UpdateDoctorDto } from 'src/doctors/dto/update-doctor.dto';
import { UpdatePatientDto } from 'src/patients/dto/update-patient.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  // @Post('doctors')
  // createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
  //   return this.adminService.createDoctor(createDoctorDto);
  // }
  // @Post('doctors/:doctor_id/appointment/:appointment_id')
  // addAppointmenttoDoctor(
  //   @Param('doctor_id', ParseIntPipe) doctor_id: number,
  //   @Param('appointment_id', ParseIntPipe) appointment_id: number,
  // ) {
  //   return this.adminService.addAppointmentToDoctor(doctor_id, appointment_id);
  // }
  // @Get()
  // findAll() {
  //   return this.adminService.findAll();
  // }

  // @Get('users')
  // getAllUsers() {
  //   return this.adminService.getAllUsers();
  // }

  // @Get('doctors')
  // getAllDoctors() {
  //   return this.adminService.getAllDoctors();
  // }

  // @Get('patients')
  // async getAllPatients() {
  //   try {
  //     return await this.adminService.getAllPatients();
  //   } catch (error) {
  //     console.error('Admin patient fetch error:', error);
  //     throw error;
  //   }
  // }

  // @Get('appointments')
  // getAllAppointments() {
  //   return this.adminService.getAllAppointments();
  // }
  // @Get('patients/search')
  // findPatients(@Query('search') search?: string) {
  //   return this.adminService.findPatients(search);
  // }
  @Roles(Role.ADMIN)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, updateAdminDto);
  }
  // @Patch('doctors/:id')
  // updateDoctor(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateDoctorDto: UpdateDoctorDto,
  // ) {
  //   return this.adminService.updateDoctor(id, updateDoctorDto);
  // }
  // @Patch('patients/:id')
  // updatePatient(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updatePatientDto: UpdatePatientDto,
  // ) {
  //   return this.adminService.updatePatient(id, updatePatientDto);
  // }
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
