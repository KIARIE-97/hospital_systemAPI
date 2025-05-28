import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsDate,
  IsOptional,
} from 'class-validator';

export class CreateMedicalHistoryDto {
  @IsOptional()
  @IsNumber()
  id?: number;

  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @IsNotEmpty()
  @IsString()
  diagnosis: string;

  @IsString()
  treatment?: string;

  @IsOptional()
  @IsDate()
  date_recorded?: Date;
}
