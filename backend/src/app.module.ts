import { Module } from '@nestjs/common';
import { CommunicationModule } from 'communication/communication.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [CommunicationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
