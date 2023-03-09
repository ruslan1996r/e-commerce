import {
  Mutation,
  Query,
  Resolver,
  Context,
  Args,
  Int,
  Field,
  ObjectType,
} from '@nestjs/graphql';
import { Logger, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

import { AuthService } from './AuthService';
import { UserEntity } from '../../database/entities/UserEntity';
import { AdminGuard } from '@root/shared/guards/AdminGuard';
import { UserInput, LogoutOutput } from './AuthTypes';
import { ContextSchema } from '@root/types/index';
import {
  GraphSelection,
  GraphSelections,
} from '@root/shared/decorators/GraphSelection';

@ObjectType()
export class UsersOutput {
  @Field(() => Int)
  total: number;

  @Field(() => [UserEntity])
  users: UserEntity[];
}

@Resolver()
export class AuthResolver {
  private readonly logger: Logger = new Logger(AuthResolver.name);
  constructor(private authService: AuthService) {}

  private addToSession(
    context: ContextSchema,
    user: UserEntity,
    token: string,
  ): void {
    context.res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    context.req.session.user = user;
  }

  @Query(() => UserEntity, { nullable: true })
  getCurrentUser(
    // @GetUser() user: UserEntity,
    @Context() context: ContextSchema,
  ): UserEntity {
    return context.getUser();
  }

  @Query(() => UserEntity, { nullable: true })
  getUser(
    @Args({ name: 'id', type: () => Int }) id: number,
    @GraphSelection() selections: GraphSelections[],
  ): Promise<UserEntity> {
    return this.authService.getUser(id, selections);
  }

  @Mutation(() => UserEntity)
  @UsePipes(ValidationPipe)
  async login(
    @Args('input') input: UserInput,
    @Context() context: ContextSchema,
  ): Promise<UserEntity> {
    // https://github.com/benawad/type-graphql-series/blob/13_many_to_many/src/modules/user/Login.ts

    const { token, user } = await this.authService.login(input);

    this.addToSession(context, user, token);

    this.logger.log(token, 'Login|Token');
    this.logger.verbose(user.email, 'Login/Local');

    return user;
  }

  @Mutation(() => UserEntity)
  @UsePipes(ValidationPipe)
  async register(
    @Args('input') input: UserInput,
    @Context() context: ContextSchema,
  ): Promise<UserEntity> {
    const { user, token } = await this.authService.register(input);

    this.addToSession(context, user, token);

    this.logger.log(token, 'Register|Token');
    this.logger.verbose(user.email, 'Register/Local');

    return user;
  }

  @Mutation(() => LogoutOutput)
  logout(@Context() context: ContextSchema): LogoutOutput {
    const { req, res } = context;

    const user = req.session.user;

    req.session.destroy((error: { message: string }) => {
      if (error) {
        return {
          message: error.message,
        };
      }
    });

    res.clearCookie('token');

    return { user };
  }

  @UseGuards(AdminGuard)
  @Query(() => String)
  adminTest() {
    return 'Admin_Test';
  }

  @Query(() => UsersOutput, { name: 'getUsers' })
  getUsers(
    @Args({ name: 'page', type: () => Int, defaultValue: 1 }) page: number,
    @Args({ name: 'limit', type: () => Int, defaultValue: 10 }) limit: number,
    @Args({ name: 'orderBy', type: () => String, defaultValue: 'id' })
    orderBy: string,
    @GraphSelection({ root: 'users' }) selections: GraphSelections[],
  ) {
    return this.authService.getUsers({
      page,
      limit,
      orderBy,
      selections,
    });
  }

  @Mutation(() => Boolean)
  delAllUsers() {
    return this.authService.delAllUsers();
  }
}
