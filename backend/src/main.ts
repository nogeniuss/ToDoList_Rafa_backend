import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common'
import { swaggerAuth } from "./shared/middlewares/swagger-auth.middleware"
import { DaoMaster } from "./database/dao-master";


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use('/docs', swaggerAuth);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('ToDo List Rafa')
    .setDescription('Documentação API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  app.enableCors({
    origin: [
      'https://todolistrafa.vercel.app/',
      'http://localhost:3000'
    ],
    credentials: true,
  });

  await app.listen(3000);

  const dao = new DaoMaster();
  await dao.createTables();
}
bootstrap();



