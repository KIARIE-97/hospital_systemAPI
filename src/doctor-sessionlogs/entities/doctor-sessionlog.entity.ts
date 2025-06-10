import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Entity()
export class DoctorSessionlog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  login_time: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  logout_time: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.id, { nullable: true })
  doctor: Doctor['id'];
}