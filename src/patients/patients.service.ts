import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientsService {
  private patients: CreatePatientDto[] = [];

  create(createPatientDto: CreatePatientDto): CreatePatientDto {
    const newPatient = {
      id: createPatientDto.id || this.patients.length + 1,
      first_name: createPatientDto.first_name,
      last_name: createPatientDto.last_name,
      // dob: createPatientDto.dob,
      // email: createPatientDto.email,
      // phone_number: createPatientDto.phone_number
    };
    this.patients.push(newPatient);
    return newPatient;
  }

  findAll(): CreatePatientDto[] {
    return this.patients;
  }
  search(query: string): CreatePatientDto[] {
    const foundPatient = this.patients.filter(
      (p) =>
        p.first_name.toLowerCase().includes(query.toLowerCase()) ||
        p.last_name.toLowerCase().includes(query.toLowerCase()),
    );
    return foundPatient;
  }
  findOne(id: number): CreatePatientDto | undefined {
    const foundPatient = this.patients.find((p) => p.id === id);
    return foundPatient;
  }

  update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): UpdatePatientDto | string {
    const patientIndex = this.patients.findIndex((p) => p.id === id);
    if (patientIndex === -1) {
      throw new InternalServerErrorException('Patient not found😥',{
        cause: new Error(),
        description: 'you do not have this patient id😪'
      });
      
    }
    const updatedPatient = {
      ...this.patients[patientIndex],
      ...updatePatientDto,
    };
    this.patients[patientIndex] = updatedPatient;
    return updatedPatient;
  }

  remove(id: number): string {
    const patientIndex = this.patients.findIndex((p) => p.id === id);
    if (patientIndex === -1) {
      return 'Patient not found';
    }
    this.patients.splice(patientIndex, 1);
    return 'Patient removed successfully';
  }
}
