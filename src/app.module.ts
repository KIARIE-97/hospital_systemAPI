import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { PatientsModule } from './patients/patients.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { MedicalHistoriesModule } from './medical-histories/medical-histories.module';
import { ContactQueriesModule } from './contact-queries/contact-queries.module';
import { DoctorSessionlogsModule } from './doctor-sessionlogs/doctor-sessionlogs.module';
import { PatientSessionlogsModule } from './patient-sessionlogs/patient-sessionlogs.module';
import { LoggerMiddleware } from './logger.middleware';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    PatientsModule,
    DoctorsModule,
    AppointmentsModule,
    MedicalHistoriesModule,
    ContactQueriesModule,
    DoctorSessionlogsModule,
    PatientSessionlogsModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    UsersModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure( consumer: MiddlewareConsumer) {
    consumer
    .apply(LoggerMiddleware)
    .exclude(
      {path: 'patients/search', method:RequestMethod.GET},
    )
    .forRoutes('patients');
  }
}
