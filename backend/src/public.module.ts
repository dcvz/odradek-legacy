import { Module } from '@nestjs/common'

import { PublicCommunicationsModule } from './communications/public-comms.module'
import { PublicController } from './public.controller'

@Module({
  imports: [PublicCommunicationsModule],
  controllers: [PublicController],
  providers: [],
})
export class PublicModule {}
