import { IsString, IsNotEmpty, IsEmail, IsNumber, IsDate } from 'class-validator';
export class CreateDoctorSessionlogDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  doctor_id: number;

  @IsNotEmpty()
  @IsDate()
  login_time: Date;

  @IsNotEmpty()
  @IsDate()
  logout_time: Date;
}
