import { Injectable } from '@nestjs/common';
import { CreateContactQueryDto } from './dto/create-contact-query.dto';
import { UpdateContactQueryDto } from './dto/update-contact-query.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Patient } from 'src/patients/entities/patient.entity';
import { Repository } from 'typeorm';
import { ContactQuery } from './entities/contact-query.entity';

@Injectable()
export class ContactQueriesService {
  constructor(
    @InjectRepository(Patient)
    private patientRepository: Repository<Patient>,
    @InjectRepository(ContactQuery)
    private contactQueryRepository: Repository<ContactQuery>,
  ) {}

  async create(
    createContactQueryDto: CreateContactQueryDto,
  ): Promise<ContactQuery> {
    // Find the patient
    const patient = await this.patientRepository.findOne({
      where: { id: createContactQueryDto.patient_id },
    });
    if (!patient) {
      throw new Error(
        `Patient with id ${createContactQueryDto.patient_id} not found`,
      );
    }

    // Create the contact query and associate with patient
    const newQuery = this.contactQueryRepository.create({
      user_name: createContactQueryDto.user_name,
      email: createContactQueryDto.email,
      status: createContactQueryDto.status,
      message: createContactQueryDto.query_message,
      patient: createContactQueryDto.patient_id,
    });

    // Save to DB
    return  this.contactQueryRepository.save(newQuery);
  }

  async findAll(): Promise<ContactQuery[]> {
    return this.contactQueryRepository.find({
      relations: ['patient'],
    });
  }

  async findOne(id: number): Promise<ContactQuery | string> {
    return await this.contactQueryRepository
      .findOne({
        where: { id },
        relations: ['patient'],
      })
      .then((contactQuery) => {
        if (!contactQuery) {
          return `No contactQuery found with id ${id}`;
        }
        return contactQuery;
      })
      .catch((error) => {
        console.error('Error finding contactQuery:', error);
        throw new Error(`Failed to find contactQuery with id ${id}`);
      });
  }

  async update(
    id: number,
    updateContactQueryDto: UpdateContactQueryDto,
  ): Promise<ContactQuery | string> {
    await this.contactQueryRepository.update(id, updateContactQueryDto);
    const updated = await this.contactQueryRepository.findOne({
      where: { id },
    });
    if (!updated) {
      return `No contact query found with id ${id}`;
    }
    return updated;
  }

  async search(user_name: string): Promise<ContactQuery[]> {
    return this.contactQueryRepository
      .createQueryBuilder('contactQuery')
      .leftJoinAndSelect('contactQuery.patient', 'patient')
      .where('LOWER(contactQuery.user_name) LIKE :user_name', {
        user_name: `%${user_name.toLowerCase()}%`,
      })
      .getMany();
  }

  async remove(id: number): Promise<string> {
    try {
      const contactQuery = await this.contactQueryRepository.findOne({
        where: { id },
      });
      if (!contactQuery) {
        return `No contact query found with id ${id}`;
      }
      await this.contactQueryRepository.remove(contactQuery);
      return `Contact query with id ${id} has been removed`;
    } catch (error) {
      console.error('Error removing contact query:', error);
      throw new Error(`Failed to remove contact query with id ${id}`);
    }
  }
}
