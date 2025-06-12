import { Patient } from 'src/patients/entities/patient.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum ContactStatus {
  PENDING = 'pending',
  RESPONDED = 'responded',
  CLOSED = 'closed',
}

@Entity()
export class ContactQuery {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_name: string;

  @Column()
  email: string;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: ContactStatus, default: ContactStatus.PENDING })
  status: ContactStatus;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submitted_date: Date;

  @ManyToOne(() => Patient, (patient) => patient.id, { nullable: true })
  patient: Patient['id'];
}
