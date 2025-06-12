import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';
import { DatabaseModule } from 'src/database/database.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Doctor, Appointment, User]),
    CaslModule,
  ],
  controllers: [DoctorsController],
  providers: [DoctorsService],
})
export class DoctorsModule {}
