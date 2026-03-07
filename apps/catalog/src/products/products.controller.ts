import { Controller, InternalServerErrorException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import {
  CreateProductDto,
  GetProductByIdDto,
  UpdateProductDto,
} from './create-product.dto';
import { ProductDocument } from './product.schema';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('product.create')
  async create(
    @Payload() createProductDto: CreateProductDto,
  ): Promise<ProductDocument> {
    try {
      return await this.productsService.createNewProduct(createProductDto);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern('product.list')
  async list(): Promise<ProductDocument[]> {
    try {
      return await this.productsService.listProducts();
    } catch (e) {
      throw new RpcException(e?.message);
    }
  }

  @MessagePattern('product.getById')
  async find(@Payload() input: GetProductByIdDto): Promise<ProductDocument> {
    try {
      return await this.productsService.getProductById(input);
    } catch (e) {
      throw new RpcException(e?.message);
    }
  }

  @MessagePattern('product.update')
  async update(
    @Payload() updateProductDto: UpdateProductDto,
  ): Promise<ProductDocument> {
    try {
      return await this.productsService.updateProduct(updateProductDto);
    } catch (e) {
      throw new RpcException(e);
    }
  }
}
