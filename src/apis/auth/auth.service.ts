import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AccountService } from '../accounts/account.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
    private readonly accountService: AccountService,
  ) {}

  getAccessToken({ user }) {
    return this.jwtService.sign(
      { email: user.email, sub: user.id, role: user.roles },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '3w' },
    );
  }

  setRefreshToken({ user, res }) {
    // console.log('setRefreshTokenUser:', user);
    const refreshToken = this.jwtService.sign(
      { email: user.email, sub: user.id, role: user.roles },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '4w' },
    );
    // console.log(user, res),
    // 개발환경
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    // 배포환경
    // res.setHeader('Access-Control-Allow-Origin', 'https://ONF.com')
    // res.setHeader(
    //     'Set-Cookie',
    //     `refreshToken=${refreshToken}; path=/; domain=.ONF.com; SameSite=None; Secure; httpOnly;`
    // )
  }

  // async socialLogin({ res, req }) {
  //   let user = await this.accountService.findOne({ email: req.user.email });

  //   if (!user) {
  //     user = await this.accountService.create({
  //       email: req.user.email,
  //       hashedPassword: req.user.password,
  //       name: req.user.name,
  //       phone: req.user.phone,
  //     });
  //   }
  //   this.setRefreshToken({ user, res });
  //   res.redirect('http://localhost:5000/frontend/social-login.html');
  // }
}
