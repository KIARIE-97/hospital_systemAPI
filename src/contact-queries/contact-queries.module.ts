import { Module } from '@nestjs/common';
import { ContactQueriesService } from './contact-queries.service';
import { ContactQueriesController } from './contact-queries.controller';

@Module({
  controllers: [ContactQueriesController],
  providers: [ContactQueriesService],
})
export class ContactQueriesModule {}
