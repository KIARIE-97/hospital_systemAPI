import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsNumber,
  IsOptional,
} from 'class-validator';
export class CreateDoctorDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  specialty: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNumber()
  user_id: number;
}
