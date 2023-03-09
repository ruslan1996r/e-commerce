import { Module } from '@nestjs/common';
import { GoogleModule } from './google/GoogleModule';

@Module({
  imports: [GoogleModule],
})
export class NetworksAuthModule {}
