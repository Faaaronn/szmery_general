import { Module } from '@nestjs/common';
import { CompressionModule } from 'src/compression/compression.module';
import { StealzMailerModule } from 'src/stealz-mailer/stealz-mailer.module';
import { StealzContractsController } from './stealz-contracts.controller';
import { StealzContractsService } from './stealz-contracts.service';

@Module({
  imports: [CompressionModule, StealzMailerModule],
  controllers: [StealzContractsController],
  providers: [StealzContractsService],
})
export class StealzContractsModule {}
