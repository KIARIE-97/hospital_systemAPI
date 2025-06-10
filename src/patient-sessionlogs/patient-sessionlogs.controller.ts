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
import { PatientSessionlogsService } from './patient-sessionlogs.service';
import { CreatePatientSessionlogDto } from './dto/create-patient-sessionlog.dto';
import { UpdatePatientSessionlogDto } from './dto/update-patient-sessionlog.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('patient-sessionlogs')
export class PatientSessionlogsController {
  constructor(
    private readonly patientSessionlogsService: PatientSessionlogsService,
  ) {}

  @Public()
  @Post()
  create(@Body() createPatientSessionlogDto: CreatePatientSessionlogDto) {
    return this.patientSessionlogsService.create(createPatientSessionlogDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.patientSessionlogsService.findAll();
  }

  @Get('search')
  search(@Query('query') query: string) {
    return this.patientSessionlogsService.search(query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.patientSessionlogsService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() updatePatientSessionlogDto: UpdatePatientSessionlogDto,
  // ) {
  //   return this.patientSessionlogsService.update(
  //     id,
  //     updatePatientSessionlogDto,
  //   );
  // }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.patientSessionlogsService.remove(id);
  }
}
