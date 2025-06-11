import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CheckPolicies } from 'src/casl/decorators/check-policies.decorator';
import { Action } from 'src/casl/action.enum';
import { PoliciesGuard } from 'src/casl/guards/policies.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('doctors')
@ApiBearerAuth('access-token')
@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, 'Doctor'))
  @Post()
  create(@Body() createDoctorDto: CreateDoctorDto) {
    return this.doctorsService.create(createDoctorDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Create, 'Doctor'))
  @Post(':doctor_id/appointments/:appointment_id')
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
  @CheckPolicies((ability) => ability.can(Action.Update, 'Doctor'))
  @Post(':doctor_id/appointment/:appointment_id')
  reassignAppointmentsToDoctor(
    @Param('doctor_id', ParseIntPipe) doctor_id: number,
    @Param('appointment_id', ParseIntPipe) appointment_id: number,
  ) {
    return this.doctorsService.reassignAppointmentsToDoctor(
      doctor_id,
      appointment_id,
    );
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Doctor'))
  @Get()
  findAll() {
    return this.doctorsService.getDoctorAppointments();
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Read, 'Doctor'))
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.findOne(id);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Update, 'Doctor'))
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ) {
    return this.doctorsService.update(id, updateDoctorDto);
  }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability) => ability.can(Action.Delete, 'Doctor'))
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorsService.remove(id);
  }
}
