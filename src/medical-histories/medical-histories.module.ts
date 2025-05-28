import { Module } from '@nestjs/common';
import { MedicalHistoriesService } from './medical-histories.service';
import { MedicalHistoriesController } from './medical-histories.controller';

@Module({
  controllers: [MedicalHistoriesController],
  providers: [MedicalHistoriesService],
})
export class MedicalHistoriesModule {}
