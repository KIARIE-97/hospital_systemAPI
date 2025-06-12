import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Action } from 'src/casl/action.enum';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('doctors')
@ApiBearerAuth('access-token')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, 'Doctor'))
  @Post()
  @ApiOperation({
    summary: 'Create a new doctor',
    description: 'Creates a new doctor with the provided details.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, 'Doctor'))
  @Post(':doctor_id/appointments/:appointment_id')
  @ApiOperation({
    summary: 'Add an appointment to a doctor',
    description: 'Associates an appointment with a specific doctor.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  addAppointmenttoDoctor(
    @Param('doctor_id', ParseIntPipe) doctor_id: number,
    @Param('appointment_id', ParseIntPipe) appointment_id: number,
  ) {
    return this.doctorsService.addAppointmenttoDoctor(
      doctor_id,
      appointment_id,
    );
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Doctor'))
  @Get()
  @ApiOperation({
    summary: 'Get all doctors with appointments',
    description:
      'Retrieves a list of all doctors along with their appointments.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  findAll() {
    return this.doctorsService.getDoctorAppointments();
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Doctor'))
  @Get(':id')
  @ApiOperation({
    summary: 'Get doctor by ID',
    description: 'Retrieves a doctor by their unique ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid doctor ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.findOne(id);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, 'Doctor'))
  @Patch(':id')
  @ApiOperation({
    summary: 'Update a doctor',
    description: 'Updates the details of an existing doctor.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, 'Doctor'))
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a doctor by ID',
    description: 'Deletes a doctor by their unique ID.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.remove(id);
  }
}
