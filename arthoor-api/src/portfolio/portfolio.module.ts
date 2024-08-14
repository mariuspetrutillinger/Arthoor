import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Portfolio } from '../entities/portofolio.entity';
import { Image } from '../entities/image.entity';
import { User } from '../entities/user.entity';

@Module({
	imports: [TypeOrmModule.forFeature([Portfolio, Image, User])],
	controllers: [PortfolioController],
	providers: [PortfolioService],
})
export class PortfolioModule {}
