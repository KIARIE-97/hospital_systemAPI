import { Injectable } from '@nestjs/common';
import { CreateContactQueryDto } from './dto/create-contact-query.dto';
import { UpdateContactQueryDto } from './dto/update-contact-query.dto';

@Injectable()
export class ContactQueriesService {
  private contactQueries: CreateContactQueryDto[] = [];

  create(createContactQueryDto: CreateContactQueryDto): CreateContactQueryDto {
    const newQuery = {
      ...createContactQueryDto,
      id: this.contactQueries.length + 1,
      submitted_date: new Date(),
    };
    this.contactQueries.push(newQuery);
    return newQuery;
  }

  findAll(): CreateContactQueryDto[] {
    return this.contactQueries;
  }

  findOne(id: number): CreateContactQueryDto | undefined {
    return this.contactQueries.find((q) => q.id === id);
  }

  update(
    id: number,
    updateContactQueryDto: UpdateContactQueryDto,
  ): CreateContactQueryDto | string {
    const index = this.contactQueries.findIndex((q) => q.id === id);
    if (index === -1) {
      return 'Contact query not found';
    }
    const updatedQuery = {
      ...this.contactQueries[index],
      ...updateContactQueryDto,
    };
    this.contactQueries[index] = updatedQuery;
    return updatedQuery;
  }

  search(query: string): CreateContactQueryDto[] {
    return this.contactQueries.filter(
      (q) =>
        q.user_name?.toLowerCase().includes(query.toLowerCase()) ||
        q.email?.toLowerCase().includes(query.toLowerCase()) ||
        q.query_message?.toLowerCase().includes(query.toLowerCase()) ||
        q.status?.toLowerCase().includes(query.toLowerCase()),
    );
  }

  remove(id: number): string {
    const index = this.contactQueries.findIndex((q) => q.id === id);
    if (index === -1) return 'Contact query not found';
    this.contactQueries.splice(index, 1);
    return 'Contact query removed successfully';
  }
}
