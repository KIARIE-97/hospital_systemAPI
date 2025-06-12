import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
// import { Doctor } from 'src/doctors/entities/doctor.entity';
import { Patient } from 'src/patients/entities/patient.entity';
// import { ContactQuery } from 'src/contact-queries/entities/contact-query.entity';

@Entity()
export class PatientSessionlog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('timestamp')
  login_time: Date;

  @Column('timestamp', { nullable: true })
  logout_time: Date;

  @ManyToOne(() => Patient, (patient) => patient.id, { nullable: true })
  patient: Patient['id'];
}
