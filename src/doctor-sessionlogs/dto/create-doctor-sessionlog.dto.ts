import { ApiProperty } from '@nestjs/swagger';
import {

  IsNotEmpty,
 
  IsNumber,
 
} from 'class-validator';
export class CreateDoctorSessionlogDto {
  

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

}
