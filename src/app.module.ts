import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { UploaderModule } from './uploader/UploaderModule';
import { configValidationSchema } from './config/configValidator';
import { LoggerModule } from './logger/LoggerModule';
import { ResolverModule } from './GraphQL/ResolverModule';
import { GraphQLModuleImport } from './GraphQL/GraphQLModule';
import { PostgresModule } from './database/PostgresModule';
import { AuthModule } from './GraphQL/auth/AuthModule';
import { NetworksAuthModule } from './auth/NetworksAuthModule';
import { MailModule } from './mail/MailModule';
import { OrderModule } from './GraphQL/order/OrderModule';
import { TransactionModule } from './GraphQL/transaction/TransactionModule';
// import { OrderService } from './GraphQL/order/OrderService';
// import { ProductEntity } from './database/entities/ProductEntity';
// import { TypeOrmModule } from '@nestjs/typeorm';

console.log('process.env.DEPLOY_ENV: ', process.env.DEPLOY_ENV);

// const redisConfig: any = {
//   type: 'ioredis',
//   options: {
//     host: 'localhost',
//     port: 6379,
//   },
// };

@Module({
  imports: [
    // TypeOrmModule.forFeature([ProductEntity]),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `environments/${process.env.DEPLOY_ENV}.env`],
      // envFilePath: ['.env', `environments/development.env`],
      validationSchema: configValidationSchema,
    }),
    GraphQLModuleImport,
    ResolverModule,
    UploaderModule,
    PostgresModule,
    LoggerModule,
    NetworksAuthModule,
    AuthModule,
    MailModule,
    OrderModule,
    TransactionModule,
    // RedisModule.forRoot({
    //   config: {
    //     url: 'redis://localhost:6379',
    //   },
    // }),
  ],
  controllers: [AppController],
})
export class AppModule {}
