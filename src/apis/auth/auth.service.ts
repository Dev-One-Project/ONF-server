import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from '../accounts/account.service';
import { Account } from '../accounts/entites/account.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService, //

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  getAccessToken({ user }) {
    return this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        role: user.roles,
        company: user.company.id,
        member: user.member.id,
      },
      { secret: process.env.ACCESS_TOKEN_KEY, expiresIn: '3w' },
    );
  }

  setRefreshToken({ user, res, req }) {
    const refreshToken = this.jwtService.sign(
      {
        email: user.email,
        sub: user.id,
        role: user.roles,
        company: user.company.id,
        member: user.member.id,
      },
      { secret: process.env.REFRESH_TOKEN_KEY, expiresIn: '4w' },
    );
    // Development server
    // res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`);

    // Deployment server
    const originList = process.env.ALLOWED_HOSTS.split(',');
    const origin = req.headers.origin;
    if (originList.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, HEAD, POST, OPTIONS, PUT, PATCH, DELETE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With, Origin, Accept, Access-Control-Request-Method, Access-Control-Request-Headers',
    );
    let cookie = '';
    if (refreshToken) {
      cookie = `refreshToken=${refreshToken}; path=/; domain=.brian-hong.tech; SameSite=None; Secure; httpOnly; Max-Age=${
        3600 * 24 * 14
      };`;
      res.setHeader('Set-Cookie', cookie);
    }
  }
  // TODO : 확인필
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
