import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const port = process.env.PORT;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: false,
    methods: ['GET', 'PUT', 'POST'],
    preflightContinue: true,
    credentials: true,
});
  await app.listen(port || 8080);

  Logger.log(`Server started running on http://localhost:${port}`, 'Bootstrap');
}
bootstrap();