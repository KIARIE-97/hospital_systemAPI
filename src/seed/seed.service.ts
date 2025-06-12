import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Appointment,
  AStatus,
} from 'src/appointments/entities/appointment.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Gender, Patient } from 'src/patients/entities/patient.entity';
import { Role, User, UStatus } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Admin } from 'src/admin/entities/admin.entity';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    this.logger.log('Starting the seeding process...');

    try {
      // Clear all tables using a transaction
      await this.clearTables();

      const appointment = await this.seedAppointment();
      // Seed user
      const user = await this.seedUsers(appointment);

      this.logger.log('Seeding completed successfully');
      return { message: 'Database seeded successfully' };
    } catch (error) {
      this.logger.error('Error during seeding:', error);
      throw error;
    }
  }

  private async clearTables() {
    this.logger.log('Clearing existing data...');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Order matters due to foreign key relationships
      await queryRunner.query(
        'TRUNCATE TABLE doctor_appointment_appointment RESTART IDENTITY CASCADE',
      ); // Delete from junction table first
      await queryRunner.query(
        'TRUNCATE TABLE appointment RESTART IDENTITY CASCADE',
      ); // Appointment has FK to Patient and Doctor
      await queryRunner.query('TRUNCATE TABLE doctor RESTART IDENTITY CASCADE'); // Student has FK to Profile
      await queryRunner.query(
        'TRUNCATE TABLE patient RESTART IDENTITY CASCADE',
      ); // Profile has FK to User
      await queryRunner.query('TRUNCATE TABLE "user" RESTART IDENTITY CASCADE'); // Course has FK to Department

      await queryRunner.commitTransaction();
      this.logger.log('All tables cleared successfully');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to clear tables', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async seedAppointment() {
    this.logger.log('Seeding appointments...');
    const appointments: Appointment[] = [];

    const Status: AStatus[] = Array.from({ length: 10 }, () => {
      const statuses = [AStatus.PENDING, AStatus.CONFIRMED, AStatus.CANCELLED];
      return statuses[Math.floor(Math.random() * statuses.length)];
    });

    // Shuffle Status
    for (let i = Status.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [Status[i], Status[j]] = [Status[j], Status[i]];
    }

    for (let i = 0; i < 10; i++) {
      const status = Status[i];

      const appointment = new Appointment();
      const startDate = faker.date.past({ years: 1 });
      const endDate = new Date(startDate);
      endDate.setMonth(
        endDate.getMonth() + faker.number.int({ min: 3, max: 6 }),
      );
      appointment.appointment_date = endDate.toISOString().split('T')[0];
      appointment.status = status;
      appointment.reason = faker.lorem.sentence();
      appointments.push(await this.appointmentRepository.save(appointment));
    }
    this.logger.log(`Created ${appointments.length} appointments`);
    // Save all appointments in a single query
    return appointments;
  }

  private async seedUsers(appointment: Appointment[]) {
    this.logger.log('Seeding user, admin, doctor and patient...');
    const doctors: Doctor[] = [];
    const patients: Patient[] = [];
    const admins: Admin[] = [];

    const roles: Role[] = Array.from({ length: 10 }, () => {
      const allRoles = [Role.DOCTOR, Role.PATIENT, Role.ADMIN];
      return allRoles[Math.floor(Math.random() * allRoles.length)];
    });

    const genders: Gender[] = Array.from({ length: 10 }, () =>
      Math.random() > 0.5 ? Gender.FEMALE : Gender.MALE,
    );

    const Status: UStatus[] = Array.from({ length: 5 }, () =>
      Math.random() > 0.5 ? UStatus.ACTIVE : UStatus.INACTIVE,
    );

    // Shuffle roles
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }

    //shuffle gender
    for (let i = genders.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [genders[i], genders[j]] = [genders[j], genders[i]];
    }

    // Shuffle Status
    for (let i = Status.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [Status[i], Status[j]] = [Status[j], Status[i]];
    }

    for (let i = 0; i < 10; i++) {
      const role = roles[i];
      const gender = genders[i];
      const status = Status[i];

      // Create profile
      const user = new User();
      user.first_name = faker.person.firstName();
      user.last_name = faker.person.lastName();
      user.email = faker.internet.email({
        firstName: user.first_name,
        lastName: user.last_name,
        provider: 'gohealth.hos',
      });
      user.password = faker.internet.password({ length: 20, memorable: true });
      user.phone_number = faker.phone.number();
      user.role = role;
      user.status = status;

      // Save the profile
      const savedUser = await this.userRepository.save(user);

      //create admin if role is ADMIN
      if (role === Role.ADMIN) {
        const admin = new Admin();
        admin.username = faker.internet.username();
        admin.user = savedUser;

        const savedAdmin = await this.adminRepository.save(admin);
        admins.push(savedAdmin);
      }

      // Create patient linked to the profile
      const appointmentCount = faker.number.int({ min: 1, max: 3 });
      const selectedAppointments: Appointment[] = [];

      for (let j = 0; j < appointmentCount; j++) {
        const randomIndex = faker.number.int({
          min: 0,
          max: appointment.length - 1,
        });
        selectedAppointments.push(appointment[randomIndex]);
      }

      const usedDoctorAppointmentPairs = new Set<string>();

      if (role === Role.DOCTOR && status === UStatus.ACTIVE) {
        const doctor = new Doctor();
        doctor.specialty = faker.helpers.arrayElement([
          'Cardiology',
          'Neurology',
          'Pediatrics',
          'Orthopedics',
          'Dermatology',
          'General Medicine',
          'Psychiatry',
          'Radiology',
        ]);
        doctor.password = faker.internet.password({
          length: 20,
          memorable: true,
        });
        doctor.user = savedUser;

        const uniqueAppointments: Appointment[] = [];

        for (const appt of selectedAppointments) {
          const pairKey = `${savedUser.id}-${appt.id}`; // ensure doctor-appointment combo is unique
          if (!usedDoctorAppointmentPairs.has(pairKey)) {
            usedDoctorAppointmentPairs.add(pairKey);
            uniqueAppointments.push(appt);
          }
        }

        doctor.appointment = uniqueAppointments;

        const savedDoctor = await this.doctorRepository.save(doctor);
        doctors.push(savedDoctor);
      }

      if (role === Role.PATIENT && status === UStatus.ACTIVE) {
        const patient = new Patient();
        patient.dob = faker.date
          .birthdate({ mode: 'year', min: 1900, max: 2025 })
          .toISOString()
          .split('T')[0];
        patient.gender = gender;
        patient.address = faker.location.streetAddress();
        patient.user = savedUser;

        const savedPatient = await this.patientRepository.save(patient);

        // Assign patient to each selected appointment
        for (const appointment of selectedAppointments) {
          appointment.patient = savedPatient.id;
          await this.appointmentRepository.save(appointment);
        }

        patients.push(savedPatient);
      }
    }
  }
}
