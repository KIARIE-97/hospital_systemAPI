import {
  IsString,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
  IsInt,
} from 'class-validator';
import { AStatus } from '../entities/appointment.entity';
export class CreateAppointmentDto {
  @IsInt()
  patient_id: number;

  @IsOptional()
  @IsInt()
  doctor_id: number;

  @IsDateString()
  appointment_date: string;

  @IsEnum(AStatus, {
    message:
      'status must be one of the following: pending, confirmed or cancelled',
  })
  status: AStatus = AStatus.PENDING;

  @IsString()
  reason?: string; // Optional field for the reason of the appointment
}
