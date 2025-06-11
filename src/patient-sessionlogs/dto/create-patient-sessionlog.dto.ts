import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CreatePatientSessionlogDto {
  @IsNotEmpty()
  @IsNumber()
  patient_id: number;

  @ApiProperty({
    description: 'The login time of the session',
    type: Date,
  })
  @IsNotEmpty()
  @IsDate()
  login_time: Date;

  @ApiProperty({
    description: 'The logout time of the session',
    type: Date,
  })
  @IsNotEmpty()
  @IsDate()
  logout_time: Date;


}
