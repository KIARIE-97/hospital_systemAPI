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
// import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
// import { CacheableMemory, Keyv } from 'cacheable';
// import { createKeyv } from '@keyv/redis';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';
import { CaslModule } from './casl/casl.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
// import { MailerModule } from './mailer/mailer.module';
import { MailerModule } from '@nestjs-modules/mailer';
// import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
// import { join } from 'path';

@Module({
  imports: [
    // MailerModule.forRoot({
    //   transport: {
    //     service: 'gmail', // SMTP provider
    //     auth: {
    //       user: process.env.GMAIL_USER,
    //       pass: process.env.GMAIL_PASS, //app password for Gmail
    //     },
    //   },
    //   defaults: {
    //     from: '"No Reply" sarahwanjiruki1@gmail.com', // Default sender address
    //   },
    //   template: {
    //     // Path to your template files
    //     dir: join(__dirname, 'src', 'templates'), // folder with your .hbs files
    //     adapter: new HandlebarsAdapter(), // or PugAdapter, EjsAdapter
    //     options: {
    //       strict: true,
    //     },
    //   },
    // }),
    // Global cache configuration
    // CacheModule.registerAsync({
    //   imports: [ConfigModule],
    //   inject: [ConfigService],
    //   isGlobal: true, // Makes cache available globally
    //   useFactory: (configService: ConfigService) => {
    //     return {
    //       stores: [
    //         // Memory cache for fast local access
    //         // new Keyv({
    //         //   store: new CacheableMemory({ ttl: 30000, lruSize: 5000 }),
    //         // }),
    //         // Redis cache for persistent storage
    //         createKeyv(configService.getOrThrow<string>('REDIS_URL')),
    //       ],
    //     };
    //   },
    // }),
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
    CaslModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow<number>('THROTTLE_TTL', {
            infer: true,
          }),
          limit: configService.getOrThrow<number>('THROTTLE_LIMIT', {
            infer: true,
          }),
          ignoreUserAgents: [/^curl\//], // Ignore specific user agents
        },
      ],
    }),
    MailerModule,
  ],
  controllers: [],
  providers: [
    // {
    //   provide: 'APP_INTERCEPTOR',
    //   useClass: CacheInterceptor, // Global cache interceptor
    // },
    {
      provide: APP_GUARD,
      useClass: AtGuard, // Use AuthModule to provide global authentication guard
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard, // Use ThrottlerModule to provide global rate limiting
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
        'admin',
      );
  }
}
