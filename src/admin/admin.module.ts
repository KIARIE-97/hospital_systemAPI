import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { DatabaseModule } from 'src/database/database.module';
import { Admin } from './entities/admin.entity';
import { UsersService } from 'src/users/users.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { PatientsService } from 'src/patients/patients.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { MailerModule } from 'src/mailer/mailer.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([User, Admin, Appointment, Doctor, Patient]),
    MailerModule,
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    UsersService,
    DoctorsService,
    PatientsService,
    AppointmentsService,
  ],
})
export class AdminModule {}
