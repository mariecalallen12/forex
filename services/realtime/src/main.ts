import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
  });

  const port = process.env.PORT || 3003;
  await app.listen(port);

  logger.log(`🚀 Realtime WebSocket Service running on port ${port}`);
  logger.log(`📡 WebSocket endpoints:`);
  logger.log(`   - ws://localhost:${port}/price (Price updates)`);
}

bootstrap();
