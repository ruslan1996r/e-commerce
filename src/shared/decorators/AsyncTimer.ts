import { Logger } from '@nestjs/common';

// https://github.com/norbornen/execution-time-decorator/blob/master/src/index.ts

export function AsyncTimer() {
  return function (
    target: any,
    propertyKey: string,
    propertyDescriptor: PropertyDescriptor,
  ) {
    // TODO: if production
    if (process.env.DEPLOY_ENV === 'TEST') {
      return;
    }

    const timername =
      (target instanceof Function
        ? `static ${target.name}`
        : target.constructor.name) + `:${propertyKey}`;

    const logger = new Logger(timername);
    propertyDescriptor =
      propertyDescriptor ||
      Object.getOwnPropertyDescriptor(target, propertyKey);

    const originalMethod = propertyDescriptor.value;
    propertyDescriptor.value = async function (...args: any[]) {
      const t0 = new Date().valueOf();
      logger.verbose(`[AsyncTimer]: begin`);
      try {
        const result = await originalMethod.apply(this, args);
        logger.verbose(
          `[AsyncTimer] ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`,
        );
        return result;
      } catch (err) {
        logger.verbose(
          `[AsyncTimer] ${((new Date().valueOf() - t0) * 0.001).toFixed(3)}s`,
        );
        throw err;
      }
    };
    return propertyDescriptor;
  };
}
