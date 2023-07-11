import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function main() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1/api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    always:true,
    forbidNonWhitelisted:true,
    whitelist:true
  }))
  await app.listen(3000);
}
main();