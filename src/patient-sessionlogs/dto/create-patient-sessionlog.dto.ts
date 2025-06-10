import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreatePatientSessionlogDto {

@ApiProperty({
  description: 'The date and time of the session log',
  type: Date,
})
  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

}
