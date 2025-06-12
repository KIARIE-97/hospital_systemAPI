import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

export enum AStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}
@Entity()
export class Appointment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('date')
  appointment_date: string;

  @Column({ type: 'enum', enum: AStatus, default: AStatus.PENDING })
  status: AStatus;

  @Column('text')
  reason: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @ManyToOne(() => Patient, (patient) => patient.id, { nullable: true })
  patient: Patient['id'];

  @ManyToMany(() => Doctor, (doctor) => doctor.appointment)
  doctor: Relation<Doctor[]>; // Relation to the Doctor entity, allowing many-to-many relationship
}
