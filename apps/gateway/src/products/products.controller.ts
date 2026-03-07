import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UserContext } from '../auth/auth.types';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/public.decorator';

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  status: string;
  imageUrl: string | undefined;
  userId: string;
};

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
  ) {}

  @Post()
  async createProduct(
    @CurrentUser() user: UserContext,
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      status: string;
      imageUrl: string;
    },
  ) {
    //const product: Product = {};
    const payload = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      status: body.status,
      imageUrl: '', //body.imageUrl,
      userId: user.userId,
    };
    try {
      const result = await firstValueFrom(
        this.catalogClient.send<Product>('product.create', payload).pipe(
          timeout(5000),
          catchError((err) => throwError(err)),
        ),
      );
      return result;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get()
  @Public()
  async listProducts() {
    try {
      const result = await firstValueFrom(
        this.catalogClient.send<Product[]>('product.list', {}).pipe(
          timeout(5000),
          catchError((err) => throwError(err)),
        ),
      );
      return result;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }

  @Get(':productId')
  @Public()
  async getProductById(@Param('productId') productId: string) {
    try {
      const result = await firstValueFrom(
        this.catalogClient.send<Product>('product.getById', { productId }).pipe(
          timeout(5000),
          catchError((err) => throwError(err)),
        ),
      );
      return result;
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
