import { Module } from '@nestjs/common';
import { AplugContractsModule } from './aplug-contracts/aplug-contracts.module';
import { CompressionModule } from './compression/compression.module';
import { MailerModule } from './mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

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
    ]),
    AplugContractsModule,
    CompressionModule,
    MailerModule,
    ConfigModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
