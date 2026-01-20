import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProductServiceController } from './product-service.controller';
import { ProductServiceService } from './product-service.service';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [ProductServiceController],
  providers: [ProductServiceService, PrismaService],
  exports: [ProductServiceService],
})
export class ProductServiceModule {}
