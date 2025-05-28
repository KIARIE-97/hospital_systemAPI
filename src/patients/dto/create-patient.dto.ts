import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsDate,
  IsNumber,
  IsBoolean,
} from 'class-validator';
export class CreatePatientDto {
  @IsNotEmpty()
  @IsNumber()
  @IsOptional()
  id: number;
  @IsString()
  first_name: string;
  @IsString()
  last_name: string;
  //   @IsDate()
  //   dob: Date;
  //   @IsEmail()
  //   email: string;
  //   @IsNumber()
  //   phone_number: number;
  //   @IsString()
  //   gender: string;
  //   @IsString()
  //   address: string;
  //   @IsBoolean()
  //   status: string;
  //   @IsDate()
  //   registration_date: Date;
}
