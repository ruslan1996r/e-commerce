import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@root/database/entities/UserEntity';
import { CustomJwtModule } from '@root/auth/jwt/JwtModule';
import { AuthService } from './AuthService';
import { AuthResolver } from './AuthResolver';
import { AuthRepository } from './AuthRepository';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    CustomJwtModule,
  ],
  providers: [AuthResolver, AuthService, AuthRepository],
  exports: [AuthService],
})
export class AuthModule {}
