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
import { DoctorSessionlogsService } from './doctor-sessionlogs.service';
import { CreateDoctorSessionlogDto } from './dto/create-doctor-sessionlog.dto';
import { UpdateDoctorSessionlogDto } from './dto/update-doctor-sessionlog.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from 'src/users/entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(RolesGuard)
@ApiTags('session-logs')
@ApiBearerAuth('access-token')
@Controller('doctor-sessionlogs')
export class DoctorSessionlogsController {
  constructor(
    private readonly doctorSessionlogsService: DoctorSessionlogsService,
  ) {}

  @Roles(Role.ADMIN)
  @Get()
   @ApiOperation({
    summary: 'Get all doctor session logs',
    description: 'Retrieves a list of all doctor session logs.',
   })
   @ApiBadRequestResponse({ description: 'Invalid input data' })
     @ApiUnauthorizedResponse({ description: 'Authentication required' })
  findAll() {
    return this.doctorSessionlogsService.findAll();
  }

  @Roles(Role.ADMIN, Role.DOCTOR)
  @Get('search/:id')
  @ApiOperation({
    summary: 'Search doctor session logs by doctor ID',
    description: 'Searches for doctor session logs by the doctor ID.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  search(@Query('id', ParseIntPipe) id: number) {
    return this.doctorSessionlogsService.search(id);
  }

  @Roles(Role.ADMIN, Role.DOCTOR)
  @Get(':id')
  @ApiOperation({
    summary: 'Get doctor session log by ID',
    description: 'Retrieves a doctor session log by its unique ID.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
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

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete doctor session log by ID',
    description: 'Deletes a doctor session log by its unique ID.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.doctorSessionlogsService.remove(id);
  }
}
