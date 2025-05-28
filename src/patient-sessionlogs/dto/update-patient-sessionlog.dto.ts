import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientSessionlogDto } from './create-patient-sessionlog.dto';

export class UpdatePatientSessionlogDto extends PartialType(
  CreatePatientSessionlogDto,
) {}
