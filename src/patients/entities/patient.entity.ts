import { Appointment } from 'src/appointments/entities/appointment.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

export enum Gender{
    FEMALE = 'female',
    MALE = 'male',
    UNDEFINED = 'undefined',
}

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('date')
  dob: string;

  @Column({ type: 'enum', enum: Gender, default: Gender.UNDEFINED })
  gender: Gender;

  @Column('text')
  address: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registration_date: Date;

  @OneToOne(() => User, (user) => user.patient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<User>;

  @OneToMany(() => Appointment, (appointment) => appointment.patient)
  appointment: Appointment[];
}
