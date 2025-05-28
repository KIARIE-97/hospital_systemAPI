import { Injectable } from '@nestjs/common';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UpdateDoctorDto } from './dto/update-doctor.dto';

@Injectable()
export class DoctorsService {
  private doctors: CreateDoctorDto[] = [];

   create(createDoctorDto: CreateDoctorDto): CreateDoctorDto {
    const newDoctor = {
      ...createDoctorDto,
      id: this.doctors.length + 1,
    };
    this.doctors.push(newDoctor);
    return newDoctor;
  }

  findAll(): CreateDoctorDto[] {
    return this.doctors;
  }

  findOne(id: number): CreateDoctorDto | undefined {
    return this.doctors.find((doctor) => doctor.id === id);
  }

  remove(id: number): string {
    const index = this.doctors.findIndex((doctor) => doctor.id === id);
    if (index === -1) return 'Doctor not found';
    this.doctors.splice(index, 1);
    return 'Doctor removed successfully';
  }

}
