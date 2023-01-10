import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //
  ) {}

  setRefreshToken({ user, res, req }) {
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        role: user.roles,
        company: user.companyId,
        member: user.member.id,
      },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '4w' },
    );

    // Deployment server
    // if (req.headers.origin.includes('localhost')) {
    //   res.setHeader(
    //     'Set-Cookie',
    //     `refreshToken=${refreshToken}; path=/; `,
    //   );

    const origin = req.headers.origin;

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin, Accept, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=${refreshToken}; path=/; domain=.brian-hong.tech; SameSite=None; Secure; httpOnly;`,
    );
  }

  getAccessToken({ user }) {
    return this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        role: user.roles,
        company: user.companyId,
        member: user.member.id,
      },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '5m' },
    );
  }
  async logout({ req, res }) {
    // if (req.headers.origin.includes('localhost')) {
    //   // 개발환경용
    //   res.setHeader('Set-Cookie', `refreshToken=; path=/;`);
    // } else {
    const origin = req.headers.origin;

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin, Accept, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    res.setHeader(
      'Set-Cookie',
      `refreshToken=; path=/; domain=.brian-hong.tech; SameSite=None; Secure; httpOnly; Max-Age=0`,
    );
    return '로그아웃에 성공하였습니다.';
  }

  // TODO : 프론트랑 상의
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
