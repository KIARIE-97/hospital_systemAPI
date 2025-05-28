import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreatePatientSessionlogDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @IsNotEmpty()
  @IsDate()
  login_time: Date;

  @IsNotEmpty()
  @IsDate()
  logout_time: Date;
}
