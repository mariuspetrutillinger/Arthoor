import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Portfolio } from './portofolio.entity';

@Entity()
export class Image {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	filename: string;

	@Column()
	mimetype: string;

	// Optionally, store the binary data itself (not recommended for large files)
	@Column({ type: 'bytea', nullable: true })
	data: Buffer;

	@ManyToOne(() => Portfolio, (portfolio) => portfolio.images)
	portfolio: Portfolio;
}
