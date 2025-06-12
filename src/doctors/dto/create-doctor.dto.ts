import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
export class CreateDoctorDto {
  @ApiProperty({
    description: 'The specialization of the doctor',
    example: 'surgeon',
  })
  @IsNotEmpty()
  @IsString()
  specialty: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNumber()
  user_id: number;
}
