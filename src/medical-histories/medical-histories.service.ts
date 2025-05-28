import { Injectable } from '@nestjs/common';
import { CreateMedicalHistoryDto } from './dto/create-medical-history.dto';
import { UpdateMedicalHistoryDto } from './dto/update-medical-history.dto';

@Injectable()
export class MedicalHistoriesService {
  private histories: CreateMedicalHistoryDto[] = [];

  create(
    createMedicalHistoryDto: CreateMedicalHistoryDto,
  ): CreateMedicalHistoryDto {
    const newHistory = {
      id: this.histories.length + 1,
      date_recorded: new Date(),
      ...createMedicalHistoryDto,
    };
    this.histories.push(newHistory);
    return newHistory;
  }

  findAll(): CreateMedicalHistoryDto[] {
    return this.histories;
  }

  findOne(id: number): CreateMedicalHistoryDto | undefined {
    return this.histories.find((h) => h.id === id);
  }

  update(
    id: number,
    updateMedicalHistoryDto: UpdateMedicalHistoryDto,
  ): CreateMedicalHistoryDto | string {
    const index = this.histories.findIndex((h) => h.id === id);
    if (index === -1) return 'Medical history not found';
    const updated = { ...this.histories[index], ...updateMedicalHistoryDto };
    this.histories[index] = updated;
    return updated;
  }

  search(query: string): CreateMedicalHistoryDto[] {
    return this.histories.filter(
      (h) =>
        h.diagnosis?.toLowerCase().includes(query.toLowerCase()) ||
        h.treatment?.toLowerCase().includes(query.toLowerCase()),
    );
  }

  remove(id: number): string {
    const index = this.histories.findIndex((h) => h.id === id);
    if (index === -1) return 'Medical history not found';
    this.histories.splice(index, 1);
    return 'Medical history removed successfully';
  }
}
