import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Response } from 'express';

@Injectable({})
export class AuthService {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async login(
		email: string,
		password: string,
		res: Response,
	): Promise<Response> {
		const user: User | null = await this.userRepository.findOne({
			where: { email, password },
		});

		if (!user) {
			console.log('Invalid credentials');
			return res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Invalid credentials',
			});
		}

		console.log('Login succesful');
		return res
			.status(HttpStatus.OK)
			.cookie('session_token', user.id, {
				httpOnly: false,
				secure: true,
				sameSite: 'none',
			})
			.json({
				message: 'Login successful',
			});
	}

	async verify(sessionToken: string, res: Response): Promise<Response> {
		const user: User | undefined = await this.userRepository.findOne({
			where: { id: sessionToken },
		});

		if (!user) {
			console.log('Invalid session token');
			return res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Invalid session token',
			});
		}

		console.log('Session token verified');
		return res.status(HttpStatus.OK).json({
			message: 'Session token verified',
		});
	}

	async register(
		email: string,
		password: string,
		res: Response,
	): Promise<Response> {
		try {
			await this.userRepository.save({ email, password });
		} catch (error) {
			console.log(error);
			return res.status(HttpStatus.BAD_REQUEST).json({
				message: 'User already exists',
			});
		}

		const user: User = await this.userRepository.findOne({
			where: { email },
		});

		console.log('User created');
		return res
			.status(HttpStatus.CREATED)
			.cookie('session_token', user.id, {
				httpOnly: true,
				secure: true,
				sameSite: 'strict',
			})
			.json({
				message: 'User created',
			});
	}
}
