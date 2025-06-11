import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Doctor } from 'src/doctors/entities/doctor.entity';

@Entity()
export class DoctorSessionlog {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('timestamp')
  login_time: Date;

  @Column('timestamp', { nullable: true })
  logout_time: Date;

  @ManyToOne(() => Doctor, (doctor) => doctor.id, { nullable: true })
  doctor: Doctor['id'];
}