import { Module } from '@nestjs/common';
import { CompressionModule } from 'src/compression/compression.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [CompressionModule, MailerModule],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
