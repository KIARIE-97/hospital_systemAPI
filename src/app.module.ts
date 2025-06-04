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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { SeedModule } from './seed/seed.module';
import { LogsModule } from './logs/logs.module';
import { AdminModule } from './admin/admin.module';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { CacheableMemory, Keyv } from 'cacheable';
import { createKeyv } from '@keyv/redis';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';

@Module({
  imports: [
    // Global cache configuration
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      isGlobal: true, // Makes cache available globally
      useFactory: (configService: ConfigService) => {
        return {
          stores: [
            // Memory cache for fast local access
            new Keyv({
              store: new CacheableMemory({ ttl: 30000, lruSize: 5000 }),
            }),
            // Redis cache for persistent storage
            createKeyv(configService.getOrThrow<string>('REDIS_URL')),
          ],
        };
      },
    }),
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
    LogsModule,
    AdminModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: 'APP_INTERCEPTOR',
      useClass: CacheInterceptor, // Global cache interceptor
    },
    {
      provide: 'APP_GUARD',
      useClass: AtGuard, // Use AuthModule to provide global authentication guard
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(
        'patients',
        'doctors',
        'appointments',
        'medical-histories',
        'contact-queries',
        'doctor-sessionlogs',
        'patient-sessionlogs',
        'users',
      );
  }
}
