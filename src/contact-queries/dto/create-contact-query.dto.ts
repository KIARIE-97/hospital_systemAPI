import { IsString, IsNotEmpty, IsDate, IsOptional, IsNumber } from 'class-validator';
export class CreateContactQueryDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  user_name: string;

 
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  query_message: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsOptional()
  @IsDate()
  submitted_date: Date;
}
