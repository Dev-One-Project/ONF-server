import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';

export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'refresh') {
  constructor() {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        console.log(cookie);
        const splitCookie = cookie.split(' ');
        let target = 0;
        for (let i = 0; i < splitCookie.length; i++) {
          if (splitCookie[i].includes('refreshToken=')) target = i;
        }
        const refreshToken = splitCookie[target].replace('refreshToken=', '');
        console.log(refreshToken);
        return refreshToken;
      },
      secretOrKey: process.env.REFRESH_TOKEN_KEY,
      ignoreExpiration: false,
    });
  }

  validate(payload) {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      company: payload.company,
      member: payload.member,
    };
  }
}
