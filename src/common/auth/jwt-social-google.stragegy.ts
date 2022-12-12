import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: [
        'email', //
        'profile',
      ],
    });
  }

  validate(
    accessToken: string, //
    refreshToken: string,
    profile: Profile,
  ) {
    // console.log(accessToken);
    // console.log(refreshToken);
    console.log('구글프로필:', profile.provider);
    return {
      email: `${profile.emails[0].value}(${profile.provider})`,
      password: profile.id,
      name: profile.displayName,
    };
  }
}
