/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Logger } from "@nestjs/common";
import { MessagePattern, Payload, RpcException } from "@nestjs/microservices";
import { ProductServiceService } from "./product-service.service";
import { plainToInstance } from "class-transformer";
import { validateOrReject } from "class-validator";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Controller()
export class ProductServiceController {
  private readonly logger = new Logger(ProductServiceController.name);

  constructor(private readonly productServiceService: ProductServiceService) {}

  @MessagePattern("product-create")
  async create(@Payload() data: Record<string, unknown>) {
    try {
      this.logger.log("Creating product:", JSON.stringify(data));
      const dto = plainToInstance(CreateProductDto, data);
      await validateOrReject(dto);
      const result = await this.productServiceService.create(dto);
      this.logger.log("Product created successfully");
      return result;
    } catch (error: any) {
      this.logger.error("Create error:", error.message);
      throw new RpcException({
        statusCode: 400,
        message: error.message || "Failed to create product",
      });
    }
  }

  @MessagePattern("product-find-all")
  async findAll() {
    try {
      this.logger.log("Fetching all products");
      return await this.productServiceService.findAll();
    } catch (error: any) {
      this.logger.error("FindAll error:", error.message);
      throw new RpcException({
        statusCode: 500,
        message: error.message || "Failed to fetch products",
      });
    }
  }

  @MessagePattern("product-find-one")
  async findOne(@Payload() id: number) {
    try {
      this.logger.log(`Finding product ID: ${id}`);
      return await this.productServiceService.findOne(id);
    } catch (error: any) {
      this.logger.error("FindOne error:", error.message);
      throw new RpcException({
        statusCode: 404,
        message: error.message || "Product not found",
      });
    }
  }

  @MessagePattern("product-update")
  async update(
    @Payload() data: { id: number; updateData: Record<string, unknown> },
  ) {
    try {
      this.logger.log(
        `Updating product ID: ${data.id}`,
        JSON.stringify(data.updateData),
      );
      const dto = plainToInstance(UpdateProductDto, data.updateData);
      await validateOrReject(dto);
      return await this.productServiceService.update(data.id, dto);
    } catch (error: any) {
      this.logger.error("Update error:", error.message);
      throw new RpcException({
        statusCode: 400,
        message: error.message || "Failed to update product",
      });
    }
  }

  @MessagePattern("product-delete")
  async remove(@Payload() id: number) {
    try {
      this.logger.log(`Deleting product ID: ${id}`);
      return await this.productServiceService.remove(id);
    } catch (error: any) {
      this.logger.error("Delete error:", error.message);
      throw new RpcException({
        statusCode: 404,
        message: error.message || "Failed to delete product",
      });
    }
  }
}
