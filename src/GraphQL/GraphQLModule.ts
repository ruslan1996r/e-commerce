import { TransactionModule } from './transaction/TransactionModule';
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql';
// import { pubSub } from '@root/networksAuth/google/GoogleController';
import { GraphQLError } from 'graphql';
import { ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/AuthModule';
import { DeliveryModule } from './delivery/DeliveryModule';
import { OrderModule } from './order/OrderModule';
import { ProductModule } from './product/ProductModule';
import { Config } from '../config/index';
import { JwtService } from '@nestjs/jwt';
import { CategoryModule } from './category/CategoryModule';

// https://github.com/benawad/type-graphql-series/blob/13_many_to_many/src/index.ts

// TODO: REDIS

const include = [
  ProductModule,
  AuthModule,
  DeliveryModule,
  OrderModule,
  CategoryModule,
  TransactionModule,
];

// ? import * as DataLoader from 'dataloader'; => new DataLoader(). Позволяет кэшировать результат выполнения лоадера
// https://www.youtube.com/watch?v=uCbFMZYQbxE

export const GraphQLModuleImport = GraphQLModule.forRootAsync({
  inject: [ConfigService],
  useFactory: async (
    configService: ConfigService,
    // graphQLContextFactory: GraphQLContextFactory,
  ) => {
    const isProduction =
      configService.get(Config.DEPLOY_ENV) === 'test_production';

    const gqlOptions: GqlModuleOptions = {
      autoSchemaFile: 'schema.gql',
      path: '/graphql',
      debug: !isProduction,
      // resolvers: [],
      // cors: {
      //   origin: 'http://localhost:3001/',
      //   credentials: true,
      // },
      cors: false,

      // validationRules: [],
      installSubscriptionHandlers: true,
      include,
      // schema:  buildSchema({

      // }),
      formatError: (error: GraphQLError) => error,
      context: async ({ req, res }) => ({
        req,
        res,
        getUser: () => getUser(req),
      }),
      // graphQLContextFactory.buildContext({ req, res }),
      // ({
      // req,
      // res,
      // getUser: () => {

      // },
      //   () => {
      //   console.log('session: ', req.session);
      //   return req.session.user;
      // },
      // user,
      // redis,
      // userLoader: createUserLoader(),
      // updootLoader: createUpdootLoader()
      // }),
      // executor: () =>{}
      // parseOptions:
    };

    return gqlOptions;
  },
});

const getUser = (req: { cookies: { token: any }; session: { user: any } }) => {
  const token = req.cookies.token;

  if (!token) {
    throw new Error('Token is empty');
  }

  const jwt = new JwtService({});
  console.log(
    'VERIFY: ',
    jwt.verify(token, { secret: process.env.LOCAL_AUTH_SECRET }),
  );

  const user = req.session.user;

  if (user) {
    return user;
  }
  console.log('user', user);

  return null;
};
