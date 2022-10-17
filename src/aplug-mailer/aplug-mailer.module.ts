import { Module } from '@nestjs/common';
import { AplugMailerService } from './aplug-mailer.service';

@Module({
  providers: [AplugMailerService],
  exports: [AplugMailerService],
})
export class AplugMailerModule {}
