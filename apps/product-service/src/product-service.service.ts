import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductServiceService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: data.categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${data.categoryId} not found`);
    }

    const product = await this.prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price,
        quantity: data.quantity,
        type: data.type,
        image: data.image,
        categoryId: data.categoryId,
      },
      include: {
        category: true,
      },
    });

    return product;
  }

  async findAll() {
    return this.prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: number, data: UpdateProductDto) {
    // Check if product exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // If categoryId is being updated, verify category exists
    if (data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: data.categoryId },
      });
      if (!category) {
        throw new NotFoundException(`Category with ID ${data.categoryId} not found`);
      }
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.quantity !== undefined && { quantity: data.quantity }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      },
      include: {
        category: true,
      },
    });

    return product;
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return { message: `Product with ID ${id} has been deleted` };
  }
}
