import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Role } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

// @Public()
@UseGuards(RolesGuard)
@ApiTags('patients')
@ApiBearerAuth('access-token')
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new patient',
    description: 'Creates a new patient record with the provided details.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all patients',
    description: 'Retrieves a list of all patients.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  findWithAppointment() {
    return this.patientsService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get('search')
  @ApiOperation({
    summary: 'Search for patients',
    description: 'Searches for patients by name.',
  })
  searchPatient(@Query('search') search?: string) {
    if (search) {
      return this.patientsService.searchPatient(search);
    } else {
      return this.patientsService.findAll();
    }
  }

  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @Get(':id')
  @ApiOperation({
    summary: 'Get patient by ID',
    description: 'Retrieves a patient by their unique ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid patient ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.findOne(id);
  }

  @Roles(Role.ADMIN, Role.PATIENT)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a patient',
    description: 'Updates the details of an existing patient.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.update(id, updatePatientDto);
  }

  @Roles(Role.ADMIN, Role.PATIENT)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a patient',
    description: 'Deletes a patient by their unique ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid patient ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientsService.remove(id);
  }
}
