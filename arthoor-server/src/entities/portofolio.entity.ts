import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	OneToMany,
	ManyToOne,
} from 'typeorm';
import { Image } from './image.entity';
import { User } from './user.entity';

@Entity()
export class Portfolio {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	name: string;

	@Column()
	description: string;

	@ManyToOne(() => User, (user) => user.portfolios)
	user: User;

	@OneToMany(() => Image, (image) => image.portfolio, { cascade: true })
	images: Image[];
}
