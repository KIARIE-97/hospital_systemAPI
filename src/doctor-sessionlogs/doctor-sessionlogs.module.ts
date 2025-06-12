import { Module } from '@nestjs/common';
import { DoctorSessionlogsService } from './doctor-sessionlogs.service';
import { DoctorSessionlogsController } from './doctor-sessionlogs.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorSessionlog } from './entities/doctor-sessionlog.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([DoctorSessionlog, Doctor]),
  ],
  controllers: [DoctorSessionlogsController],
  providers: [DoctorSessionlogsService],
})
export class DoctorSessionlogsModule {}
