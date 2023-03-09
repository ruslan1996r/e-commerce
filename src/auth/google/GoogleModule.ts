import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

import { GOOGLE_SERVICE } from '@root/constants';
import { GoogleController } from './GoogleController';
// import { JwtModule } from '@nestjs/jwt';
import { GoogleService } from './GoogleService';
import { UserEntity } from '@root/database/entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomJwtModule } from '@root/auth/jwt/JwtModule';
import { Config } from '@root/config';

@Module({
  imports: [
    // ConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    CustomJwtModule,
    // JwtModule.register({
    //   secret: process.env.LOCAL_AUTH_SECRET,
    //   signOptions: { expiresIn: '36000s' },
    // }),
  ],
  controllers: [GoogleController],
  providers: [
    ConfigService,
    GoogleService,
    {
      provide: GOOGLE_SERVICE,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return passport.use(
          new GoogleStrategy(
            {
              clientID: configService.get(Config.GOOGLE_AUTH_ID),
              clientSecret: configService.get(Config.GOOGLE_AUTH_SECRET),
              callbackURL: `${configService.get(
                Config.SERVER_URL,
              )}/google/callback`,
            },
            (token, tokenSecret, profile, done) => {
              return done(null, { profile, token, tokenSecret });
            },
          ),
        );
      },
    },
  ],
})
export class GoogleModule {}
