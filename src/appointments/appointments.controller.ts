import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  ParseIntPipe,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(RolesGuard)
@ApiTags('appointments')
@ApiBearerAuth('access-token')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @Post()
  @ApiOperation({
    summary: 'Create a new appointment',
    description: 'Creates a new appointment with the provided details.',
  })
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @Post(':appointment_id/doctor/:doctor_id')
  @ApiOperation({
    summary: 'Add an appointment to a doctor',
    description: 'Associates an appointment with a specific doctor.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  addAppointmentTodoctor(
    @Param('appointment_id', ParseIntPipe) appointment_id: number,
    @Param('doctor_id', ParseIntPipe) doctor_id: number,
  ) {
    return this.appointmentsService.addAppointmentToDoctor(
      appointment_id,
      doctor_id,
    );
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all appointments',
    description: 'Retrieves a list of all appointments.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @Get(':id')
  @ApiOperation({
    summary: 'Get appointment by ID',
    description: 'Retrieves an appointment by its unique ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid appointment ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.appointmentsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update an appointment',
    description: 'Updates the details of an existing appointment.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAppointmentDto: UpdateAppointmentDto,
  ) {
    return this.appointmentsService.update(id, updateAppointmentDto);
  }

  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an appointment',
    description: 'Deletes an appointment by its unique ID.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.appointmentsService.remove(id, req.user);
  }
}
