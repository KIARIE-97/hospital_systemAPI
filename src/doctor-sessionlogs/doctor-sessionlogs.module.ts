import { Module } from '@nestjs/common';
import { DoctorSessionlogsService } from './doctor-sessionlogs.service';
import { DoctorSessionlogsController } from './doctor-sessionlogs.controller';

@Module({
  controllers: [DoctorSessionlogsController],
  providers: [DoctorSessionlogsService],
})
export class DoctorSessionlogsModule {}
