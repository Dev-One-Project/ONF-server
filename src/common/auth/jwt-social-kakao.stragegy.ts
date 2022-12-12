import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-kakao';

export class JwtKakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      callbackURL: process.env.KAKAO_CALLBACK_URL,
      scope: ['profile_nickname', 'account_email'],
    });
  }

  validate(
    accessToken: string, //
    refreshToken: string,
    profile: Profile,
  ) {
    // console.log('카카오프로필', profile.provider);
    return {
      email: `${profile._json.kakao_account.email}(${profile.provider})`,
      password: profile.id,
      name: profile.displayName,
    };
  }
}
