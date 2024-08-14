import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Portfolio } from './portofolio.entity';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	email: string;

	@Column()
	password: string;

	@OneToMany(() => Portfolio, (portfolio) => portfolio.user, {
		cascade: true,
	})
	portfolios: Portfolio[];
}
