import { Module } from '@nestjs/common';
import { CompressionService } from './compression.service';

@Module({
  controllers: [],
  providers: [CompressionService],
  exports: [CompressionService],
})
export class CompressionModule {}
