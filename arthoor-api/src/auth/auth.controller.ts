import { Controller, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Body } from '@nestjs/common';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private authService: AuthService) {}

	@Post('login')
	async login(
		@Body()
		loginDto: {
			email: string;
			password: string;
		},
		@Res() res: Response,
	): Promise<Response> {
		return await this.authService.login(
			loginDto.email,
			loginDto.password,
			res,
		);
	}

	@Post('register')
	async register(
		@Body()
		createUserDto: {
			email: string;
			password: string;
		},
		@Res() res: Response,
	): Promise<Response> {
		return await this.authService.register(
			createUserDto.email,
			createUserDto.password,
			res,
		);
	}

	@Post('verify')
	async verify(@Req() req: Request, @Res() res: Response): Promise<Response> {
		const sessionToken = req.headers['cookie'].split('=')[1];

		if (!sessionToken) {
			console.log('No session token provided');
			return res.status(HttpStatus.BAD_REQUEST).json({
				message: 'No session token provided',
			});
		}

		return await this.authService.verify(sessionToken, res);
	}
}
