import { Column, PrimaryGeneratedColumn } from "typeorm";

export class ContactQuery {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_name: string;

  @Column()
  email: string;

  @Column()
  message: string;

  @Column()
  status: string;

  @Column()
  submitted_date;
}
