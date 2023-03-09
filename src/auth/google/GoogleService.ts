import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuthType, UserEntity } from '@root/database/entities/UserEntity';
import { GoogleUser } from './GoogleTypes';

@Injectable()
export class GoogleService {
  private readonly logger: Logger = new Logger(GoogleService.name);
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async login(googleUser: GoogleUser) {
    const userExists = await this.userRepository.findOne({
      network_id: googleUser.sub,
    });

    if (userExists) {
      this.logger.log(userExists.email, 'Login/Google');

      const payload = { id: userExists.id, email: userExists.email };
      return {
        user: userExists,
        token: this.jwtService.sign(payload),
      };
    }

    const user = await this.userRepository.save({
      network_id: googleUser.sub,
      email: googleUser.email,
      name: googleUser.given_name,
      surname: googleUser.family_name,
      picture: googleUser.picture,
      auth_type: AuthType.google,
    });

    this.logger.log(user.email, 'Register/Google');

    const payload = { id: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }
}
