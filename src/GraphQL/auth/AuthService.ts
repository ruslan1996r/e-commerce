import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import {
  AuthType,
  UserEntity,
  UserType,
} from '@root/database/entities/UserEntity';
import {
  ContactInfoInput,
  UserOrderInput,
  UserFields,
  UserInput,
} from './AuthTypes';
import { AuthRepository } from './AuthRepository';
import { SelectOptions } from '@root/database/repository/RepositoryHelpersTypes';

@Injectable()
export class AuthService {
  private readonly saltRounds: number = 10;
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private customUserRepository: AuthRepository,
  ) {}

  private async validateUser(
    user: UserEntity,
    password: string,
  ): Promise<UserEntity> {
    if (!user.password) {
      throw new NotFoundException('The guest user does not contain a password');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      delete user.password;
      return user;
    }
    throw new Error('Incorrect password');
  }

  async login(userInput: UserInput) {
    const { email, password } = userInput;

    const user = await this.userRepository.findOne({ email });

    if (!user) {
      throw new Error('This email is not exists');
    }
    const validPassword = this.validateUser(user, password);

    if (!validPassword) {
      return null;
    }

    const payload = { id: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async register(userInput: any) {
    const userExists = await this.userRepository.findOne({
      email: userInput.email,
    });

    if (userExists) {
      throw new Error('This user already exists');
    }

    // https://gist.github.com/jtushman/673f5cd9c0225ee50951fcf46be24df5
    const hashedPassword = await bcrypt.hash(
      userInput.password,
      this.saltRounds,
    );

    const user = await this.userRepository.save({
      email: userInput.email,
      password: hashedPassword,
      name: userInput.name ? userInput.name : userInput.email,
      user_type: userInput.user_type,
      auth_type: AuthType.local,
    });

    const payload = { id: user.id, email: user.email };

    return {
      token: this.jwtService.sign(payload),
      user,
    };
  }

  async updateContactInfo(
    contactInfo: ContactInfoInput,
    userInfo: UserOrderInput,
  ) {
    let user: UserEntity = null;

    if (userInfo.id) {
      // Уже существующий юзер мог обновить свои контактные данные, а также имя и фамилию
      const existingUser = await this.userRepository.findOne({
        id: userInfo.id,
      });

      // TODO: добавить тип
      const updatedFields: any = {
        id: existingUser.id,
        name: userInfo.name,
        surname: userInfo.surname,
        contact_info: contactInfo,
      };

      user = await this.userRepository.save(updatedFields);
    } else {
      const guestUser = await this.userRepository.findOne({
        email: userInfo.email,
      });

      // Новый незарегистрированный пользователь создаёт заказ
      const updatedFields: UserFields = {
        user_type: UserType.guest,
        email: userInfo.email,
        name: userInfo.name,
        surname: userInfo.surname,
        contact_info: contactInfo,
      };

      // Если такой юзер есть, добавит его ID в updatedFields, чтобы он (юзер) был обновлён, а не пересоздан
      if (guestUser) {
        updatedFields.id = guestUser.id;
      }

      user = await this.userRepository.save(updatedFields);
    }

    return {
      user,
      contact_info: user.contact_info,
    };
  }

  async getUser(userId: number, selections: any) {
    return this.customUserRepository.deepSelect({
      rootAlias: 'user',
      selections,
      id: userId,
    });
  }

  // async allUsers(selections: GraphSelections[]) {
  async getUsers({ page, limit, orderBy, selections }) {
    // const buildedRelations = buildRelationSchema({
    //   selections: selections,
    //   relations: new Set(['transaction', 'orders', 'contact_info']),
    // });

    // console.log(buildedRelations);
    const selectOptions: SelectOptions = {
      selections,
      rootAlias: 'users',
      page,
      limit,
      orderBy,
    };

    const [total, users] = await Promise.all([
      this.userRepository.count(),
      this.customUserRepository.deepSelectMany(selectOptions),
    ]);

    return { total, users };
    // return this.userRepository.find({
    //   relations: ['orders', 'contact_info'],
    // });
  }

  async delAllUsers() {
    try {
      const users = await this.userRepository.find();
      await this.userRepository.remove(users);
      return true;
    } catch (err) {
      console.log('delAllUsers_error: ', err);
      return false;
    }
  }
}
