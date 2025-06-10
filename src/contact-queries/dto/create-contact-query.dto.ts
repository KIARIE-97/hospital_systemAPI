import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsEmail,
  IsInt,
} from 'class-validator';
import { ContactStatus } from '../entities/contact-query.entity';
export class CreateContactQueryDto {
 @ApiProperty()
  @IsInt()
  patient_id: number;

  @ApiProperty()
  @IsString()
  user_name: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  query_message: string;

  @ApiProperty()
  @IsEnum(ContactStatus, {
    message:
      'status must be one of the following: pending, confirmed or cancelled',
  })
  status: ContactStatus = ContactStatus.PENDING;
}
