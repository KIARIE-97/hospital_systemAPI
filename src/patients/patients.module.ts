import { Module } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { PatientsController } from './patients.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { User } from 'src/users/entities/user.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { ContactQuery } from 'src/contact-queries/entities/contact-query.entity';
import { PatientSessionlog } from 'src/patient-sessionlogs/entities/patient-sessionlog.entity';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Patient, User, Appointment, ContactQuery, PatientSessionlog]),
  ],
  controllers: [PatientsController],
  providers: [PatientsService],
})
export class PatientsModule {}
