import { Module } from '@nestjs/common';
import { ContactQueriesService } from './contact-queries.service';
import { ContactQueriesController } from './contact-queries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { ContactQuery } from './entities/contact-query.entity';
import { DatabaseModule } from 'src/database/database.module';
import { CaslModule } from 'src/casl/casl.module';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([Patient, ContactQuery]),
    CaslModule,
  ],
  controllers: [ContactQueriesController],
  providers: [ContactQueriesService],
})
export class ContactQueriesModule {}
