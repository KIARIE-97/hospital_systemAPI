import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Appointment } from './entities/appointment.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([Patient, Doctor, Appointment])],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
