import { IsNumber, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  username: string;

  @IsNumber()
  user_id: number;
}
