import { Module } from '@nestjs/common';
import { CompressionModule } from 'src/compression/compression.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { AplugContractsController } from './aplug-contracts.controller';
import { AplugContractsService } from './aplug-contracts.service';

@Module({
  imports: [CompressionModule, MailerModule],
  controllers: [AplugContractsController],
  providers: [AplugContractsService],
})
export class AplugContractsModule {}
