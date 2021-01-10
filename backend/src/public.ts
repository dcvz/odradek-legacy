import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { PublicModule } from './public.module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(PublicModule, new FastifyAdapter())
  await app.listen(parseInt(process.env.PORT) || 3000, '0.0.0.0')
}
bootstrap()
