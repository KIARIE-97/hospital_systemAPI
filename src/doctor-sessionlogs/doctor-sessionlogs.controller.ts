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
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('doctor-sessionlogs')
export class DoctorSessionlogsController {
  constructor(
    private readonly doctorSessionlogsService: DoctorSessionlogsService,
  ) {}

  @Public()
  @Post()
  create(@Body() createDoctorSessionlogDto: CreateDoctorSessionlogDto) {
    return this.doctorSessionlogsService.create(createDoctorSessionlogDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.doctorSessionlogsService.findAll();
  }

  @Public()
  @Get('search/:id')
  search(@Query('id', ParseIntPipe) id: number) {
    return this.doctorSessionlogsService.search(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.doctorSessionlogsService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updateDoctorSessionlogDto: UpdateDoctorSessionlogDto,
  // ) {
  //   return this.doctorSessionlogsService.update(id, updateDoctorSessionlogDto);
  // }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorSessionlogsService.remove(id);
  }
}
