import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment, AStatus } from 'src/appointments/entities/appointment.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Gender, Patient } from 'src/patients/entities/patient.entity';
import { Role, Status, User } from 'src/users/entities/user.entity';
import { DataSource, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';

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
      await queryRunner.query('DELETE FROM doctor_appointment_appointment'); // Delete from junction table first
      await queryRunner.query('DELETE FROM appointment'); // Appointment has FK to Patient and Doctor
      await queryRunner.query('DELETE FROM doctor'); // Student has FK to Profile
      await queryRunner.query('DELETE FROM patient'); // Profile has FK to User
      await queryRunner.query('DELETE FROM "user"'); // Course has FK to Department

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

    for (let i = 0; i < 10; i++) {
      const appointment = new Appointment();
      const startDate = faker.date.past({ years: 1 });
      const endDate = new Date(startDate);
      endDate.setMonth(
        endDate.getMonth() + faker.number.int({ min: 3, max: 6 }),
      );
      appointment.appointment_date = endDate.toISOString().split('T')[0];
      appointment.status = AStatus.PENDING;
      appointment.reason = faker.lorem.sentence();
      appointments.push(await this.appointmentRepository.save(appointment));
    }
this.logger.log(`Created ${appointments.length} appointments`);
    // Save all appointments in a single query
    return appointments;
  }

  private async seedUsers(appointment: Appointment[]) {
    this.logger.log('Seeding user, doctor and patient...');
    const doctors: Doctor[] = [];
    const patients: Patient[] = [];

    for (let i = 0; i < 10; i++) {
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
      user.role = Role.PATIENT;
      user.status = Status.ACTIVE;

      // Save the profile
      const savedUser = await this.userRepository.save(user);

      // Create patient linked to the profile
      const patient = new Patient();
      patient.dob = faker.date.birthdate({ mode: 'year', min: 1900, max: 2025 }).toISOString().split('T')[0];
     patient.gender = Gender.UNDEFINED;
      patient.address = faker.location.streetAddress();
        patient.user = savedUser; 
  // Save the patient
      const savedpatient = await this.patientRepository.save(patient);

        // Create doctor linked to the profile
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
        doctor.password = faker.internet.password({ length: 20, memorable: true });
        doctor.user = savedUser; // Link the doctor to the user profile
        // Save the doctor
        const savedDoctor = await this.doctorRepository.save(doctor);

// Create a random number of appointments for the doctor and patient
        const appointmentCount = faker.number.int({ min: 1, max: 3 });
        const doctorAppointment: Appointment[] = [];
        const patientAppointment: Appointment[] = [];
const savedAppointments = [...appointment]; // Use the appointments created earlier
        
// Create appointments linked to the patient and doctor
        for (let j = 0; j < appointmentCount; j++) {
          if (savedAppointments.length === 0) break;
          const randomIndex = faker.number.int({ min: 0, max: savedAppointments.length - 1 });
          const selectedAppointment = savedAppointments.splice(randomIndex, 1)[0]; // Remove the selected appointment from the array
          doctorAppointment.push(selectedAppointment);
          patientAppointment.push(selectedAppointment);
        }

        // Link appointments to the doctor and patient
        savedDoctor.appointment = doctorAppointment;
        await this.doctorRepository.save(savedDoctor);
         doctors.push(savedDoctor);
       
        // Link appointments to the patient
        savedpatient.appointment = patientAppointment;
        await this.patientRepository.save(savedpatient);
        patients.push(savedpatient);


      
}

}
}
