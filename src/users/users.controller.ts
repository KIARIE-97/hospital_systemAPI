import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/role.decorator';
import { Role } from './entities/user.entity';
import { ResetPasswordDto } from 'src/admin/dto/reset-password.dto';

@UseGuards(RolesGuard)
@ApiBearerAuth('access-token')
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Public()
  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Creates a new user with the provided details.',
  })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Roles(Role.ADMIN)
  // @Public()
  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all users.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieves a user by their unique ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid user ID' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update user details',
    description: 'Updates the details of an existing user.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid input data' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN, Role.DOCTOR, Role.PATIENT)
  @Patch(':id/reset-password')
  @ApiOperation({
    summary: 'Reset user password',
    description: 'Resets the password for a user by their ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  resetUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResetPasswordDto,
  ) {
    return this.usersService.resetPassword(id, dto.newPassword);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a user',
    description: 'Deletes a user by their unique ID.',
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiBadRequestResponse({ description: 'Invalid user ID' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
