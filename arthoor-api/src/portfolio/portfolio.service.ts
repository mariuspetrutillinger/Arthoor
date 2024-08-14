import { Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Portfolio } from 'src/entities/portofolio.entity';
import { Image } from '../entities/image.entity';
import { User } from '../entities/user.entity';
import { Response } from 'express';

@Injectable({})
export class PortfolioService {
	constructor(
		@InjectRepository(Portfolio)
		private portfolioRepository: Repository<Portfolio>,
		@InjectRepository(Image)
		private imageRepository: Repository<Image>,
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async createPortfolio(
		name: string,
		description: string,
		userId: string,
		res: Response,
	): Promise<Response> {
		try {
			const user: User = await this.userRepository.findOne({
				where: { id: userId },
			});
			const portfolio: Portfolio = this.portfolioRepository.create({
				name,
				description,
				user,
			});
			await this.portfolioRepository.save(portfolio);
		} catch (error) {
			console.log('Error creating portfolio');
			return res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Error creating portfolio',
			});
		}

		return res.status(HttpStatus.OK).json({
			message: 'Portfolio created',
		});
	}

	async createImage(
		file: Express.Multer.File,
		name: string,
		portfolio: string,
		res: Response,
	): Promise<Response> {
		let portfolioEntity: Portfolio;
		try {
			portfolioEntity = await this.portfolioRepository.findOne({
				where: { name: portfolio },
			});
		} catch (error) {
			console.log('Error finding portfolio');
			return res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Error finding portfolio',
			});
		}

		const image: Image = this.imageRepository.create({
			filename: name,
			mimetype: file.mimetype,
			data: file.buffer,
			portfolio: portfolioEntity,
		});

		try {
			await this.imageRepository.save(image);
		} catch (error) {
			console.log('Error creating image');
			return res.status(HttpStatus.BAD_REQUEST).json({
				message: 'Error creating image',
			});
		}

		return res.status(HttpStatus.OK).json({
			message: 'Image created',
		});
	}

	async getPortfolios(res: Response): Promise<Response> {
		const portfolios: Portfolio[] = await this.portfolioRepository.find({
			relations: ['images'],
		});

		return res.status(HttpStatus.OK).json(portfolios);
	}
}
