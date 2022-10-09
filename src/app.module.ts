import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContractsModule } from './contracts/contracts.module';
import { CompressionModule } from './compression/compression.module';

@Module({
  imports: [ContractsModule, CompressionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
