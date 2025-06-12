import { Module } from '@nestjs/common';
import { PatientSessionlogsService } from './patient-sessionlogs.service';
import { PatientSessionlogsController } from './patient-sessionlogs.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientSessionlog } from './entities/patient-sessionlog.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([PatientSessionlog, Patient]),
  ],
  controllers: [PatientSessionlogsController],
  providers: [PatientSessionlogsService, RolesGuard],
})
export class PatientSessionlogsModule {}
