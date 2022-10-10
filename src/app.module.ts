import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsModule } from './contracts/contracts.module';
import { CompressionModule } from './compression/compression.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { SocketModule } from './socket/socket.module';
import { AppGateway } from './app.gateway';

@Module({
  imports: [
    ContractsModule,
    CompressionModule,
    MailerModule,
    ConfigModule.forRoot(),
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
