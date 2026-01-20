import { Module } from "@nestjs/common";
import { ApiGatewayController } from "./api-gateway.controller";
import { ApiGatewayService } from "./api-gateway.service";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AuthController } from "./app/auth/auth.controller";
import { ProductsController } from "./app/products/products.controller";

@Module({
  imports: [
    ClientsModule.register([
      {
        name: "AUTH-SERVICE",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3001,
        },
      },
      {
        name: "PRODUCT-SERVICE",
        transport: Transport.TCP,
        options: {
          host: "127.0.0.1",
          port: 3003,
        },
      },
    ]),
  ],
  controllers: [ApiGatewayController, AuthController, ProductsController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
