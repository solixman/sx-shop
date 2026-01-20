import { NestFactory } from '@nestjs/core';
import { OrderServiceModule } from './order-service.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(OrderServiceModule,{
    transport:Transport.TCP,
    options:{
      host:'127.0.0.1',
      port:3002
    }
  });
  await app.listen();
  Logger.log('✅ Order service is running with TCP transport on port 3002');
}
bootstrap();
