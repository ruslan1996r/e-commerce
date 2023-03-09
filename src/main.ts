import { NestFactory } from '@nestjs/core';
import { getConnection } from 'typeorm';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';
import FileUpload from 'express-fileupload';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import type { NestExpressApplication } from '@nestjs/platform-express';

import { LoggerService } from './logger/LoggerService';
import { Config } from './config';
import { AppModule } from './app.module';

// import * as cluster from 'cluster';
// import * as os from 'os';

// export function runInCluster(bootstrap: () => Promise<void>) {
//   const numberOfCores = os.cpus().length;
//   console.log('numberOfCores', numberOfCores);
//   if (cluster.isMaster) {
//     for (let i = 0; i < numberOfCores; ++i) {
//       cluster.fork();
//     }
//   } else {
//     bootstrap();
//   }
// }
const onReady = (serverUrl: any) => console.log(`Server on: ${serverUrl}`); //http://localhost:${port}

async function bootstrap() {
  const logger = new LoggerService();

  try {
    const app: NestExpressApplication = await NestFactory.create(AppModule, {
      logger,
      // cors: true,
    });

    // TODO: вынести в отдельный модуль
    app.enableCors({
      origin: true, //'http://localhost:3001/',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      allowedHeaders: 'Content-Type, Accept',
      preflightContinue: false,
      credentials: true,
    });

    const config = app.get(ConfigService);

    logger.log(config.get(Config.DEPLOY_ENV));

    app.use(cookieParser());
    app.use(FileUpload());
    app.useStaticAssets(join(__dirname, '../static'), {
      prefix: '/static/',
    });
    app.use(
      session({
        secret: config.get(Config.SESSION_SECRET),
        resave: false,
        saveUninitialized: false,
        cookie: {
          maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years,
          httpOnly: true,
          sameSite: 'lax', // csrf protection
        },
        // https://wanago.io/2021/01/04/api-nestjs-in-memory-cache-performance/
        // store: new RedisStore({
        //   client: redis,
        //   disableTouch: true
        // }),
      }),
      // app.enableCors({
      //   // origin: true,
      //   origin: function (origin, callback) {
      //     if (whitelist.indexOf(origin) !== -1) {
      //       console.log('allowed cors for:', origin);
      //       callback(null, true);
      //     } else {
      //       console.log('blocked cors for:', origin);
      //       callback(new Error('Not allowed by CORS'));
      //     }
      //   },
      //   credentials: true,
      // }),
    );

    const PORT = config.get(Config.PORT) || 3000;

    await app.listen(PORT, () => onReady(config.get(Config.SERVER_URL)));

    const connect = getConnection();
    connect.runMigrations();
  } catch (error) {
    logger.error(error);
  }
}
// runInCluster(bootstrap);
bootstrap();
