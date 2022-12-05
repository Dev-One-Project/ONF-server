import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AccountService } from '../accounts/account.service';
import { AuthService } from './auth.service';

interface IOAuthUser {
  user?: {
    email: string;
    hashedPassword: string;
    name: string;
  };
}

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
    private readonly accountService: AccountService,
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    let user = await this.accountService.findOne({ email: req.user.email });

    // console.log(user);

    if (!user) user = await this.accountService.create({ ...req.user });

    const refreshToken = this.authService.setRefreshToken({ user, res });
    console.log(user);
    console.log(refreshToken);

    res.redirect('http://localhost:5000/frontend/social-login.html');
  }
}
