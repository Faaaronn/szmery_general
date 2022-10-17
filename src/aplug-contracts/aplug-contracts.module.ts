import { Module } from '@nestjs/common';
import { CompressionModule } from 'src/compression/compression.module';
import { AplugMailerModule } from 'src/aplug-mailer/aplug-mailer.module';
import { AplugContractsController } from './aplug-contracts.controller';
import { AplugContractsService } from './aplug-contracts.service';

@Module({
  imports: [CompressionModule, AplugMailerModule],
  controllers: [AplugContractsController],
  providers: [AplugContractsService],
})
export class AplugContractsModule {}
