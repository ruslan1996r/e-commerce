import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as util from 'util';

@Injectable()
export class LoggerService extends ConsoleLogger {
  error(message: any, trace?: string, context?: string): any {
    super.error.apply(this, [message, trace, context]);
  }

  //* Зелёный цвет логов
  log(message: any, context?: string): any {
    super.log.apply(this, [message, context]);
  }

  //* Жёлтый
  warn(message: any, context?: string): any {
    super.warn.apply(this, [message, context]);
  }

  //* Голубой
  verbose(message: any, context?: string): void {
    super.verbose.apply(this, [message, context]);
  }

  //* Розовый
  debug(message: any, context?: string): void {
    super.debug.apply(this, [message, context]);
  }

  deepLog(message: any) {
    super.log.apply(this, ['Deep object log:']);
    console.log(util.inspect(message, { depth: null, colors: true }));
  }
}
