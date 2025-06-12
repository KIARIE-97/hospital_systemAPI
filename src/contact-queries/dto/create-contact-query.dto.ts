import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEnum, IsEmail, IsInt } from 'class-validator';
import { ContactStatus } from '../entities/contact-query.entity';
export class CreateContactQueryDto {
  @ApiProperty()
  @IsInt()
  patient_id: number;

  @ApiProperty()
  @IsString()
  user_name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'example@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'any message that the user wants to send',
    example: 'I have a question about my appointment.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  query_message: string;

  @ApiProperty({
    description: 'The status of your enquiry',
    enum: ContactStatus,
    default: ContactStatus.PENDING,
    required: false,
    example: ' pending, confirmed, cancelled',
  })
  @IsEnum(ContactStatus, {
    message:
      'status must be one of the following: pending, confirmed or cancelled',
  })
  status: ContactStatus = ContactStatus.PENDING;
}
