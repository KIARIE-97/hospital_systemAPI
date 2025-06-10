import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './entities/admin.entity';
import { User } from '../users/entities/user.entity';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { UsersService } from 'src/users/users.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { PatientsService } from 'src/patients/patients.service';
import { AppointmentsService } from 'src/appointments/appointments.service';
import { CreateDoctorDto } from 'src/doctors/dto/create-doctor.dto';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { UpdateDoctorDto } from 'src/doctors/dto/update-doctor.dto';
import { Patient } from 'src/patients/entities/patient.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: Repository<Admin>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly doctorService: DoctorsService,
    private readonly patientService: PatientsService,
    private readonly appointmentService: AppointmentsService,
  ) {}
  //fetching all users, doctors, patients, and appointments
  getAllUsers() {
    return this.userService.findAll(); // returns all users
  }

  getAllDoctors() {
    return this.doctorService.getDoctorAppointments(); // returns all doctors
  }

  getAllPatients() {
    console.log('Fetching all patients from admin service');
    return this.patientService.findAll(); // returns all patients
  }

  getAllAppointments() {
    return this.appointmentService.findAll(); // returns all appointments
  }

  // Find all admins with their associated user
  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find({ relations: ['user'] });
  }

  //find patients and filter by name
  async findPatients(search?: string) {
    if (search) {
      return this.patientService.searchPatient(search); // returns filtered patients
    }
  }

  //add appointments to doctors
  async addAppointmentToDoctor(
    doctor_id: number,
    appointment_id: number,
  ): Promise<Doctor> {
    return this.doctorService.addAppointmenttoDoctor(
      doctor_id,
      appointment_id,
    ); // returns all doctors
  }

  // Find all doctors with their associated user, appointment and filter by specialization

  // Find one admin by id with associated user
  async findOne(id: number): Promise<Admin | string> {
    const admin = await this.adminRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!admin) {
      return `No admin found with id ${id}`;
    }
    return admin;
  }

  // Create an admin using an existing user
  async create(createAdminDto: CreateAdminDto): Promise<Admin> {
    const user = await this.userRepository.findOneBy({
      id: createAdminDto.user_id,
    });
    if (!user) {
      throw new NotFoundException(
        `User with id ${createAdminDto.user_id} not found`,
      );
    }
    const admin = this.adminRepository.create({
      username: createAdminDto.username,
      user: user,
    });
    return this.adminRepository.save(admin);
  }
  //create a doctor as an admin
  async createDoctor(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return this.doctorService.create(createDoctorDto); // returns all doctors
  }
  // Update admin and (optionally) their user
  async update(
    id: number,
    updateAdminDto: UpdateAdminDto,
  ): Promise<Admin | string> {
    await this.adminRepository.update(id, updateAdminDto);
    return this.findOne(id);
  }
  //update a doctor as an admin
  async updateDoctor(
    id: number,
    updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor | string> {
    return this.doctorService.update(id, updateDoctorDto); // returns all doctors
  }
  // edit the patients data
  async updatePatient(
    id: number,
    updatePatientDto: UpdateDoctorDto,
  ): Promise<Patient | string> {
    return this.patientService.update(id, updatePatientDto); // returns all patients
  }
//
  // Reset password for a user
  

  // Remove admin and (optionally) their user
  async remove(id: number): Promise<string> {
    const result = await this.adminRepository.delete(id);
    if (result.affected === 0) {
      return `No admin found with id ${id}`;
    }
    return `Admin with id ${id} has been removed`;
  }
}
