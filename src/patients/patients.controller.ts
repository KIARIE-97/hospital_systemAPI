import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Search,
  ParseIntPipe,
} from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  findWithAppointment(@Query('address') address?: string) {
    return this.patientsService.findAll(address);
  }
  @Get('search')
  search() {
    return;
  }
  @Get(':id')
  findOne() {
    return;
  }

  @Patch(':id')
  update() {
    return;
  }

  @Delete(':id')
  remove() {
    return;
  }
}
