import { User } from "src/users/entities/user.entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, Relation } from "typeorm";


@Entity()
export class Admin {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  username: string;

  @OneToOne(() => User, (user) => user.admin, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: Relation<User>;
}
