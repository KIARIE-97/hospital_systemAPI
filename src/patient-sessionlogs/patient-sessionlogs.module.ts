import { Module } from '@nestjs/common';
import { PatientSessionlogsService } from './patient-sessionlogs.service';
import { PatientSessionlogsController } from './patient-sessionlogs.controller';

@Module({
  controllers: [PatientSessionlogsController],
  providers: [PatientSessionlogsService],
})
export class PatientSessionlogsModule {}
