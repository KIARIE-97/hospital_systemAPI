import { IsString, IsNotEmpty, IsEmail, IsNumber, IsOptional } from 'class-validator';
export class CreateDoctorDto {
  @IsNumber()
  @IsOptional()
  id: number;
  
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  specialty: string;

  @IsNotEmpty()
  @IsNumber()
  phone_number: number;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  status: string;
}
