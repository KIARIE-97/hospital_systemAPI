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
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { PatientSessionlogsService } from './patient-sessionlogs.service';
import { CreatePatientSessionlogDto } from './dto/create-patient-sessionlog.dto';
import { UpdatePatientSessionlogDto } from './dto/update-patient-sessionlog.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorator';

@UseGuards(RolesGuard)
@ApiTags('session-logs')
@ApiBearerAuth('access-token')
@Controller('patient-sessionlogs')
export class PatientSessionlogsController {
  constructor(
    private readonly patientSessionlogsService: PatientSessionlogsService,
  ) {}

  // @Roles(Role.ADMIN)
  @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all patient session logs',
    description: 'Retrieves a list of all patient session logs.',
  })
  findAll() {
    console.log('patient session logs');
    return this.patientSessionlogsService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get('search')
  @ApiOperation({
    summary: 'Search patient session logs',
    description: 'Searches for patient session logs by id.',
  })
  search(@Query('query') query: string) {
    return this.patientSessionlogsService.search(query);
  }

  @Roles(Role.ADMIN, Role.PATIENT)
  @Get(':id')
  @ApiOperation({
    summary: 'Get patient session log by ID',
    description: 'Retrieves a patient session log by its unique ID.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientSessionlogsService.findOne(id);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete patient session log by ID',
    description: 'Deletes a patient session log by its unique ID.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientSessionlogsService.remove(id);
  }
}
