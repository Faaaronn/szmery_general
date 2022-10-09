import { Module } from '@nestjs/common';
import { CompressionModule } from 'src/compression/compression.module';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';

@Module({
  imports: [CompressionModule],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
