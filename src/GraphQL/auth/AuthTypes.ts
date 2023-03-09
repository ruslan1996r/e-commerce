import { ObjectType, Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

import { UserEntity, UserType } from '@root/database/entities/UserEntity';

@ObjectType()
export class AuthOutput {
  @Field(() => UserEntity)
  user: UserEntity;

  @Field(() => String)
  token?: string;
}

@ObjectType()
export class LogoutOutput {
  @Field(() => String, { nullable: true })
  message?: string;

  @Field(() => UserEntity, { nullable: true })
  user?: UserEntity;
}

@InputType()
export class UserInput {
  @Field(() => String)
  @IsEmail()
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String, { nullable: true })
  user_type?: string;
}

export type UserFields = {
  id?: number;
  user_type?: UserType;
  email?: string;
  name?: string;
  surname?: string;
  contact_info?: ContactInfoInput;
};

@InputType()
export class ContactInfoInput {
  @Field(() => Int)
  id?: number;

  @Field(() => String)
  region: string;

  @Field(() => String)
  city: string;

  @Field(() => String)
  warehouse: string;

  @Field(() => Int)
  // @isPhoneNumber()
  phone: number;
}

export class UserOrderInput {
  // Здесь ещё нужно добавить валидацию
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => String)
  email?: string;

  @Field(() => String)
  name?: string;

  @Field(() => String)
  surname?: string;
}
