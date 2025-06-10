import { IsEmail, IsEnum, IsNumber, IsString } from 'class-validator';
import { Role, UStatus } from '../entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty( {description: 'The email of the user', 
    example: 'example@mail.com', 
    required: true 
  })
  @IsEmail()
  email: string;

  @ApiProperty(
    {description: 'The unique identifier for the user', 
    example: 123, 
    required: true 
  })
  @IsString()
  password: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: true,
  })
  @IsString()
  phone_number: string;

  @ApiProperty()
  @IsEnum(Role, {
    message: 'Role must be one of the following: patient, admin or doctor',
  })
  role: Role = Role.PATIENT;

  @ApiProperty()
  @IsEnum(UStatus, {
    message: 'Status must be one of the following: active, inactive or pending',
  })
  status: UStatus = UStatus.ACTIVE;
}
