import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { CreateDoctorDto } from 'src/doctors/dto/create-doctor.dto';
import { UpdateDoctorDto } from 'src/doctors/dto/update-doctor.dto';
import { UpdatePatientDto } from 'src/patients/dto/update-patient.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Role } from 'src/users/entities/user.entity';
import { Roles } from 'src/auth/decorators/role.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@UseGuards(RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new admin',
    description: 'Creates a new admin with the provided details.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
    @ApiUnauthorizedResponse({ description: 'Authentication required' })
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }
  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get admin by ID',
    description: 'Retrieves an admin by their unique ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update admin details',
    description: 'Updates the details of an existing admin.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdminDto: UpdateAdminDto,
  ) {
    return this.adminService.update(id, updateAdminDto);
  }
  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete an admin',
    description: 'Deletes an admin by their unique ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
