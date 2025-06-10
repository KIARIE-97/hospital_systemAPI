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
} from '@nestjs/common';
import { MedicalHistoriesService } from './medical-histories.service';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';

@Controller('medical-histories')
export class MedicalHistoriesController {
  // constructor(
  //   private readonly medicalHistoriesService: MedicalHistoriesService,
  // ) {}

  // @Post()
  // create(@Body() createMedicalHistoryDto: CreateMedicalHistoryDto) {
  //   return this.medicalHistoriesService.create(createMedicalHistoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.medicalHistoriesService.findAll();
  // }

  // @Get('search')
  // search(@Query('query') query: string) {
  //   return this.medicalHistoriesService.search(query);
  // }

  // @Get(':id')
  // findOne(@Param('id', ParseIntPipe) id: number) {
  //   return this.medicalHistoriesService.findOne(id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  // ) {
  //   return this.medicalHistoriesService.update(id, updateMedicalHistoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id', ParseIntPipe) id: number) {
  //   return this.medicalHistoriesService.remove(id);
  // }
}
