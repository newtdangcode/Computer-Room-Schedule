import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000' , // Chỉ định nguồn cho phép truy cập
    credentials: true, // Cho phép sử dụng cookies trong yêu cầu
  });
  await app.listen(8080);
}
bootstrap();
