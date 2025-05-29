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
export class CreatePatientDto {
  @IsDateString()
  dob: string;

  @IsString()
  @IsEnum(Gender, {
    message: 'gender must be one of the following: male, female or other',
  })
  gender: Gender = Gender.UNDEFINED;

  @IsString()
  address: string;

  @IsNumber()
  user_id: number;
}
