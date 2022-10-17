import { Module } from '@nestjs/common';
import { AplugContractsModule } from './aplug-contracts/aplug-contracts.module';
import { CompressionModule } from './compression/compression.module';
import { AplugMailerModule } from './aplug-mailer/aplug-mailer.module';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { StealzContractsModule } from './stealz-contracts/stealz-contracts.module';
import { StealzMailerModule } from './stealz-mailer/stealz-mailer.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: '/aplug',
        children: [
          {
            path: '/',
            module: AplugContractsModule,
          },
        ],
      },
      {
        path: '/stealz',
        children: [{ path: '/', module: StealzContractsModule }],
      },
    ]),
    AplugContractsModule,
    AplugMailerModule,
    StealzContractsModule,
    StealzMailerModule,
    CompressionModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
