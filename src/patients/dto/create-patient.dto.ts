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
  @ApiProperty({
    description: 'The enrollment date of the student',
    example: '2023-09-01T00:00:00.000Z',
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  dob: string;

  @ApiProperty(
    {description: 'the gender of patient',
      example: 'male, female, other',
    }
  )
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
