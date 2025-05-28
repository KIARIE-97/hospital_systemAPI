import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';
export class CreateAppointmentDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsString()
  patient_id: string;

  @IsNotEmpty()
  @IsString()
  doctor_id: string;

  @IsNotEmpty()
  @IsDate()
  appointment_date: Date;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsString()
  reason?: string; // Optional field for the reason of the appointment

  @IsOptional()
  @IsDate()
  created_at?: Date;

  @IsOptional()
  @IsDate()
  updated_at?: Date;
}
