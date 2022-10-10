import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsModule } from './contracts/contracts.module';
import { CompressionModule } from './compression/compression.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ContractsModule,
    CompressionModule,
    MailerModule,
    ConfigModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
