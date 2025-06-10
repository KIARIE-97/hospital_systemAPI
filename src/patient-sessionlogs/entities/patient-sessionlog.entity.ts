import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { ContactQuery } from 'src/contact-queries/entities/contact-query.entity';

@Entity()
export class PatientSessionlog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  login_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  logout_time: Date;

  @ManyToOne(() => Patient, (patient) => patient.id, { nullable: true })
  patient: Patient['id'];

 
}