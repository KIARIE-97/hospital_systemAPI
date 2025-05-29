import { Appointment } from "src/appointments/entities/appointment.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column('text')
  specialty: string;

  @Column()
  password: string;

    @OneToOne(() => User, (user) => user.patient, {
      cascade: true,
      onDelete: 'CASCADE',
    })
    @JoinColumn()
    user: Relation<User>;

  @ManyToMany(() => Appointment, (appointment) => appointment.doctor)
  @JoinTable() // Important! This creates the join table in the database
  appointment: Relation<Appointment[]>;
}
