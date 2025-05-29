import { Doctor } from "src/doctors/entities/doctor.entity";
import { Patient } from "src/patients/entities/patient.entity";
import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

export enum Role {
  ADMIN = 'admin',
  PATIENT = 'patient',
  DOCTOR = 'doctor',
}
export enum Status {
  ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  phone_number: string;

  @Column({ type: 'enum', enum: Role, default: Role.PATIENT })
  role: Role;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @OneToOne(() => Patient, (patient) => patient.user)
  patient: Relation<Patient>;

  @OneToOne(() => Doctor, (doctor) => doctor.user)
  doctor: Relation<Doctor>;
}
