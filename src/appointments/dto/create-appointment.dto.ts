import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsInt,
} from 'class-validator';
import { AStatus } from '../entities/appointment.entity';
import { ApiProperty } from '@nestjs/swagger';
export class CreateAppointmentDto {
  @ApiProperty()
  @IsInt()
  patient_id: number;

  @ApiProperty()
  @IsOptional()
  @IsInt()
  doctor_id: number;

  @ApiProperty()
  @IsDateString()
  appointment_date: string;

  @ApiProperty()
  @IsEnum(AStatus, {
    message:
      'status must be one of the following: pending, confirmed or cancelled',
  })
  status: AStatus = AStatus.PENDING;

  @ApiProperty({ required: false })
  @IsString()
  reason?: string; // Optional field for the reason of the appointment
}
