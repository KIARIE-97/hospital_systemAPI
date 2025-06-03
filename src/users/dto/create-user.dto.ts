import { IsEmail, IsEnum, IsNumber, IsString } from "class-validator";
import { Role, UStatus } from "../entities/user.entity";

export class CreateUserDto {
  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  phone_number: string;

  @IsEnum(Role, {
    message: 'Role must be one of the following: patient, admin or doctor',
  })
  role: Role = Role.PATIENT;

  @IsEnum(UStatus, {
    message: 'Status must be one of the following: active, inactive or pending',
  })
  status: UStatus = UStatus.ACTIVE;
}