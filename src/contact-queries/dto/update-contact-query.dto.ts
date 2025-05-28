import { PartialType } from '@nestjs/mapped-types';
import { CreateContactQueryDto } from './create-contact-query.dto';

export class UpdateContactQueryDto extends PartialType(CreateContactQueryDto) {}
