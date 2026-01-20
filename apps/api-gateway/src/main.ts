import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
   app.enableCors({
    origin: [
      'http://localhost:4000'
    ], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true, 
  });
  console.log(process.env.API_GATEWAY_PORT);
  await app.listen(process.env.API_GATEWAY_PORT ?? 3000);
  console.log(`the api-gateway is running and listening on PORT ${process.env.API_GATEWAY_PORT}`);
}
bootstrap();
