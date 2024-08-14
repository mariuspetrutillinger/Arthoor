import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { User } from './entities/user.entity';
import { Portfolio } from './entities/portofolio.entity';
import { Image } from './entities/image.entity';

@Module({
	imports: [
		AuthModule,
		UserModule,
		PortfolioModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'postgres',
			database: 'Arthoor',
			entities: [User, Portfolio, Image],
			synchronize: true,
		}),
		UserModule,
		PortfolioModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
