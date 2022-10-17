import { Module } from '@nestjs/common';
import { StealzMailerService } from './stealz-mailer.service';

@Module({
  providers: [StealzMailerService],
  exports: [StealzMailerService],
})
export class StealzMailerModule {}
