import { Appointment } from 'src/appointments/entities/appointment.entity';
import { DoctorSessionlog } from 'src/doctor-sessionlogs/entities/doctor-sessionlog.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  specialty: string;

  @Column()
  password: string;

  @OneToOne(() => User, (user) => user.doctor, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<User>;

  @ManyToMany(() => Appointment, (appointment) => appointment.doctor, {
    cascade: true,
  })
  @JoinTable() // Important! This creates the join table in the database
  appointment: Relation<Appointment[]>;

  @OneToMany(
    () => DoctorSessionlog,
    (doctorSessionlog) => doctorSessionlog.doctor,
    {
      nullable: true,
    },
  )
  sessionlog: DoctorSessionlog[];
}
