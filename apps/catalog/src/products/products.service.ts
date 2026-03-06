import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './product.schema';
import {
  CreateProductDto,
  GetProductByIdDto,
  UpdateProductDto,
} from './create-product.dto';
import { isValidObjectId, Model } from 'mongoose';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<Product>,
  ) {}

  async createNewProduct(input: CreateProductDto): Promise<ProductDocument> {
    const product: ProductDocument = await this.productModel.create({
      name: input.name,
      description: input.description,
      price: input.price,
      status: input.status ?? 'DRAFT',
      imageUrl: input.imageUrl ?? '',
      userId: input.userId,
    });
    return product;
  }

  async listProducts(): Promise<ProductDocument[]> {
    const products: ProductDocument[] = await this.productModel
      .find()
      .sort({ createdAt: -1 })
      .exec();
    return products;
  }

  async getProductById(input: GetProductByIdDto): Promise<ProductDocument> {
    if (!isValidObjectId(input.productId))
      throw new BadRequestException('Invalid Product Id');
    const product: ProductDocument | null = await this.productModel
      .findById(input.productId)
      .exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async updateProduct(input: UpdateProductDto): Promise<ProductDocument> {
    if (!isValidObjectId(input.productId))
      throw new BadRequestException('Invalid Product Id');
    const updateProduct: ProductDocument | null = await this.productModel
      .findByIdAndUpdate(input.productId, input, { new: true })
      .exec();
    if (!updateProduct) throw new NotFoundException('Product not found');
    return updateProduct;
  }
}
