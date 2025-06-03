import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDate,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Gender } from '../entities/patient.entity';
import { ApiProperty } from '@nestjs/swagger';
export class CreatePatientDto {
  @ApiProperty()
  @IsDateString()
  dob: string;

  @ApiProperty()
  @IsString()
  @IsEnum(Gender, {
    message: 'gender must be one of the following: male, female or other',
  })
  gender: Gender = Gender.UNDEFINED;

  @ApiProperty()
  @IsString()
  address: string;
 
  @ApiProperty()
  @IsNumber()
  user_id: number;
}
