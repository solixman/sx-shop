"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
            ? (desc = Object.getOwnPropertyDescriptor(target, key))
            : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return (c > 3 && r && Object.defineProperty(target, key, r), r);
  };
var __metadata =
  (this && this.__metadata) ||
  function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
      return Reflect.metadata(k, v);
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsController = void 0;
const common_1 = require("@nestjs/common");
const microservices_1 = require("@nestjs/microservices");
const rxjs_1 = require("rxjs");
const rxjs_2 = require("rxjs");
let ProductsController = class ProductsController {
  constructor(productClient) {
    this.productClient = productClient;
  }
  async create(body) {
    try {
      return await (0, rxjs_1.firstValueFrom)(
        this.productClient
          .send("product-create", body)
          .pipe(
            (0, rxjs_1.catchError)((error) =>
              (0, rxjs_2.throwError)(() => error),
            ),
          ),
      );
    } catch (error) {
      throw new common_1.HttpException(
        error?.message || "Failed to create product",
        error?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findAll() {
    try {
      return await (0, rxjs_1.firstValueFrom)(
        this.productClient
          .send("product-find-all", {})
          .pipe(
            (0, rxjs_1.catchError)((error) =>
              (0, rxjs_2.throwError)(() => error),
            ),
          ),
      );
    } catch (error) {
      throw new common_1.HttpException(
        error?.message || "Failed to fetch products",
        error?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async findOne(id) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new common_1.HttpException(
        "Invalid product ID",
        common_1.HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await (0, rxjs_1.firstValueFrom)(
        this.productClient
          .send("product-find-one", productId)
          .pipe(
            (0, rxjs_1.catchError)((error) =>
              (0, rxjs_2.throwError)(() => error),
            ),
          ),
      );
    } catch (error) {
      throw new common_1.HttpException(
        error?.message || "Failed to fetch product",
        error?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async update(id, body) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new common_1.HttpException(
        "Invalid product ID",
        common_1.HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await (0, rxjs_1.firstValueFrom)(
        this.productClient
          .send("product-update", { id: productId, updateData: body })
          .pipe(
            (0, rxjs_1.catchError)((error) =>
              (0, rxjs_2.throwError)(() => error),
            ),
          ),
      );
    } catch (error) {
      throw new common_1.HttpException(
        error?.message || "Failed to update product",
        error?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async remove(id) {
    const productId = parseInt(id, 10);
    if (isNaN(productId)) {
      throw new common_1.HttpException(
        "Invalid product ID",
        common_1.HttpStatus.BAD_REQUEST,
      );
    }
    try {
      return await (0, rxjs_1.firstValueFrom)(
        this.productClient
          .send("product-delete", productId)
          .pipe(
            (0, rxjs_1.catchError)((error) =>
              (0, rxjs_2.throwError)(() => error),
            ),
          ),
      );
    } catch (error) {
      throw new common_1.HttpException(
        error?.message || "Failed to delete product",
        error?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
};
exports.ProductsController = ProductsController;
__decorate(
  [
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise),
  ],
  ProductsController.prototype,
  "create",
  null,
);
__decorate(
  [
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise),
  ],
  ProductsController.prototype,
  "findAll",
  null,
);
__decorate(
  [
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise),
  ],
  ProductsController.prototype,
  "findOne",
  null,
);
__decorate(
  [
    (0, common_1.Put)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise),
  ],
  ProductsController.prototype,
  "update",
  null,
);
__decorate(
  [
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise),
  ],
  ProductsController.prototype,
  "remove",
  null,
);
exports.ProductsController = ProductsController = __decorate(
  [
    (0, common_1.Controller)("products"),
    __param(0, (0, common_1.Inject)("PRODUCT-SERVICE")),
    __metadata("design:paramtypes", [microservices_1.ClientProxy]),
  ],
  ProductsController,
);
//# sourceMappingURL=products.controller.js.map
