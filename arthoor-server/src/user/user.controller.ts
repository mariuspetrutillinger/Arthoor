import { Controller, Get, Req, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { Response } from 'express';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Get()
	async getUser(
		@Res() res: Response,
		@Req() req: Request,
	): Promise<Response> {
		const id = req.headers['cookie'].split('=')[1];
		return await this.userService.getUser(id, res);
	}
}
