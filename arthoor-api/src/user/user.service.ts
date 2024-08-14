import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable({})
export class UserService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async getUser(id: string, res: Response): Promise<Response> {
		try {
			const user: User = await this.userRepository.findOne({
				where: { id },
			});

			if (!user) {
				return res.status(404).json({ message: 'User not found' });
			}

			return res.status(200).json(user);
		} catch (error) {
			return res.status(500).json({ message: 'Internal server error' });
		}
	}
}
