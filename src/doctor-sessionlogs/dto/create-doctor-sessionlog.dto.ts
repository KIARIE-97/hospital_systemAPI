import { ApiProperty } from '@nestjs/swagger';
import {

  IsDate,
  IsNotEmpty,
 
  IsNumber,
  IsOptional,
 
} from 'class-validator';
export class CreateDoctorSessionlogDto {
  

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

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
    @IsOptional()
    @IsDate()
    logout_time: Date;

}
