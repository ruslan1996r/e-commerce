import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity, UserType } from '@root/database/entities/UserEntity';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Config } from '@root/config';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const graphCtx = GqlExecutionContext.create(context);
    const req = graphCtx.getContext().req;

    const token = req.cookies.token;

    if (!token) {
      throw new Error('Token is empty');
    }

    const decryptedPayload = this.jwtService.verify(token, {
      secret: this.configService.get(Config.LOCAL_AUTH_SECRET),
    });

    const user = await this.userRepository.findOne({ id: decryptedPayload.id });

    if (!user) {
      throw new Error('This user is not exists');
    }

    if (user.user_type !== UserType.admin) {
      throw new Error('You do not have permission');
    }

    return true;
  }
}
