import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.LOCAL_AUTH_SECRET,
      signOptions: { expiresIn: '36000s' },
    }),
  ],
  exports: [JwtModule],
})
export class CustomJwtModule {}
