import { PartialType } from '@nestjs/mapped-types';
import { CreateDoctorSessionlogDto } from './create-doctor-sessionlog.dto';

export class UpdateDoctorSessionlogDto extends PartialType(
  CreateDoctorSessionlogDto,
) {}
