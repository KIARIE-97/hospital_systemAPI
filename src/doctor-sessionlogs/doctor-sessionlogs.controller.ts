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
import { DoctorSessionlogsService } from './doctor-sessionlogs.service';
import { CreateDoctorSessionlogDto } from './dto/create-doctor-sessionlog.dto';
import { UpdateDoctorSessionlogDto } from './dto/update-doctor-sessionlog.dto';

@Controller('doctor-sessionlogs')
export class DoctorSessionlogsController {
  constructor(
    private readonly doctorSessionlogsService: DoctorSessionlogsService,
  ) {}

  @Post()
  create(@Body() createDoctorSessionlogDto: CreateDoctorSessionlogDto) {
    return this.doctorSessionlogsService.create(createDoctorSessionlogDto);
  }

  @Get()
  findAll() {
    return this.doctorSessionlogsService.findAll();
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.doctorSessionlogsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorSessionlogsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorSessionlogDto: UpdateDoctorSessionlogDto,
  ) {
    return this.doctorSessionlogsService.update(id, updateDoctorSessionlogDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorSessionlogsService.remove(id);
  }
}
