import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const whitelist = [
    // 'http://localhost:3000',
    'https://mellow-donut-c93449.netlify.app/',
    'https://aplug-dashboard.vercel.app',
  ];

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  });
  app.use(bodyParser.json({ limit: '50mb' }));
  await app.listen(process.env.PORT || 900);
}
bootstrap();
