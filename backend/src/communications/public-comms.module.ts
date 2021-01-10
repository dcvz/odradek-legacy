import { Module } from '@nestjs/common'
import { PublicGateway } from './public.gateway'

@Module({
  providers: [PublicGateway],
})
export class PublicCommunicationsModule {}
