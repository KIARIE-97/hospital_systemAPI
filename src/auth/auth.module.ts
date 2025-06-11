import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { PassportModule } from '@nestjs/passport';
import { PatientSessionlog } from 'src/patient-sessionlogs/entities/patient-sessionlog.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { PatientSessionlogsService } from 'src/patient-sessionlogs/patient-sessionlogs.service';
import { DoctorSessionlog } from 'src/doctor-sessionlogs/entities/doctor-sessionlog.entity';
import { DoctorSessionlogsService } from 'src/doctor-sessionlogs/doctor-sessionlogs.service';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, PatientSessionlog, Patient, DoctorSessionlog, Doctor]),
    JwtModule.register({
      global: true,
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, AtStrategy, RtStrategy, PatientSessionlogsService, DoctorSessionlogsService],
})
export class AuthModule {}
