/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import {
  Controller,
  Inject,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom, catchError, throwError } from "rxjs";

@Controller("products")
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(
    @Inject("PRODUCT-SERVICE") private readonly productClient: ClientProxy,
  ) {}

  @Post()
  async create(
    @Body()
    body: {
      title: string;
      description?: string;
      price: number;
      quantity: number;
      type?: string;
      image?: string;
      categoryId: number;
    },
  ) {
    try {
      this.logger.log("Creating product with data:", JSON.stringify(body));
      return await firstValueFrom(
        this.productClient.send("product-create", body).pipe(
          catchError((error) => {
            this.logger.error("Microservice error:", error);
            const statusCode =
              error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error?.message || "Failed to create product";
            this.logger.error(`Status: ${statusCode}, Message: ${message}`);
            return throwError(() => new HttpException(message, statusCode));
          }),
        ),
      );
    } catch (error: any) {
      this.logger.error("Controller error:", error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error?.message || "Failed to create product",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll() {
    try {
      this.logger.log("Fetching all products");
      return await firstValueFrom(
        this.productClient.send("product-find-all", {}).pipe(
          catchError((error) => {
            this.logger.error("Microservice error:", error);
            const statusCode =
              error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error?.message || "Failed to fetch products";
            return throwError(() => new HttpException(message, statusCode));
          }),
        ),
      );
    } catch (error: any) {
      this.logger.error("Controller error:", error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error?.message || "Failed to fetch products",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(":id")
  async findOne(@Param("id") id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new HttpException("Invalid product ID", HttpStatus.BAD_REQUEST);
    }
    try {
      this.logger.log(`Fetching product with ID: ${productId}`);
      return await firstValueFrom(
        this.productClient.send("product-find-one", productId).pipe(
          catchError((error) => {
            this.logger.error("Microservice error:", error);
            const statusCode = error?.statusCode || HttpStatus.NOT_FOUND;
            const message = error?.message || "Product not found";
            return throwError(() => new HttpException(message, statusCode));
          }),
        ),
      );
    } catch (error: any) {
      this.logger.error("Controller error:", error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error?.message || "Product not found",
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Put(":id")
  async update(@Param("id") id: string, @Body() body: any) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new HttpException("Invalid product ID", HttpStatus.BAD_REQUEST);
    }
    try {
      this.logger.log(
        `Updating product ID: ${productId}`,
        JSON.stringify(body),
      );
      return await firstValueFrom(
        this.productClient
          .send("product-update", { id: productId, updateData: body })
          .pipe(
            catchError((error) => {
              this.logger.error("Microservice error:", error);
              const statusCode =
                error?.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
              const message = error?.message || "Failed to update product";
              return throwError(() => new HttpException(message, statusCode));
            }),
          ),
      );
    } catch (error: any) {
      this.logger.error("Controller error:", error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error?.message || "Failed to update product",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(":id")
  async remove(@Param("id") id: string) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new HttpException("Invalid product ID", HttpStatus.BAD_REQUEST);
    }
    try {
      this.logger.log(`Deleting product ID: ${productId}`);
      return await firstValueFrom(
        this.productClient.send("product-delete", productId).pipe(
          catchError((error) => {
            this.logger.error("Microservice error:", error);
            const statusCode = error?.statusCode || HttpStatus.NOT_FOUND;
            const message = error?.message || "Failed to delete product";
            return throwError(() => new HttpException(message, statusCode));
          }),
        ),
      );
    } catch (error: any) {
      this.logger.error("Controller error:", error);
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        error?.message || "Failed to delete product",
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
