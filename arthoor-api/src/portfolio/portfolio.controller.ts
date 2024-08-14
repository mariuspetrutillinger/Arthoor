import {
	Controller,
	Get,
	Post,
	Req,
	Res,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { Body } from '@nestjs/common';
import { Response } from 'express';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('portfolio')
export class PortfolioController {
	constructor(private portfolioService: PortfolioService) {}

	@Post('new-portfolio')
	async createPortfolio(
		@Body()
		createPortfolioDto: {
			name: string;
			description: string;
		},
		@Req() req: Request,
		@Res() res: Response,
	): Promise<Response> {
		const userId = req.headers['cookie'].split('=')[1];
		return await this.portfolioService.createPortfolio(
			createPortfolioDto.name,
			createPortfolioDto.description,
			userId,
			res,
		);
	}

	@Post('new-image')
	@UseInterceptors(FileInterceptor('image'))
	async createImage(
		@UploadedFile() file: Express.Multer.File,
		@Body() createImageDto: { name: string; portfolio: string },
		@Res() res: Response,
	): Promise<Response> {
		return await this.portfolioService.createImage(
			file,
			createImageDto.name,
			createImageDto.portfolio,
			res,
		);
	}

	@Get()
	async getPortfolios(@Res() res: Response): Promise<Response> {
		return await this.portfolioService.getPortfolios(res);
	}
}
