import { Module } from '@nestjs/common';

import { UploaderController } from './UploaderController';
import { UploaderService } from './UploaderService';

@Module({
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
