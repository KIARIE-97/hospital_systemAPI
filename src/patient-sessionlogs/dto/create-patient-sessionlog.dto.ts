import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreatePatientSessionlogDto {


  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

}
