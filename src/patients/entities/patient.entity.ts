import { User } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

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

  @Column('boolean')
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  registration_date: Date;

  @OneToOne(() => User, (user) => user.patient, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<User>;
}
