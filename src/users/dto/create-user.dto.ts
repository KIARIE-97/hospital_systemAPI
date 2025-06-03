import { IsEmail, IsEnum, IsNumber, IsString } from "class-validator";
import { Role, UStatus } from "../entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  first_name: string;

  @ApiProperty()
  @IsString()
  last_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
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