import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { IOAuthUser } from 'src/common/types/authUser';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService, //
  ) {}

  // @Get('/login/google')
  // @UseGuards(AuthGuard('google'))
  // async loginGoogle(
  //   @Req() req: Request & IOAuthUser, //
  //   @Res() res: Response,
  // ) {
  //   this.authService.socialLogin({ req, res });
  // }

  // @Get('/login/kakao')
  // @UseGuards(AuthGuard('kakao'))
  // async loginKakao(
  //   @Req() req: Request & IOAuthUser, //
  //   @Res() res: Response,
  // ) {
  //   this.authService.socialLogin({ req, res });
  // }
}
