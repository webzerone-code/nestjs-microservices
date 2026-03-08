import {
  Body,
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UserContext } from '../auth/auth.types';
import { catchError, firstValueFrom, throwError, timeout } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('image', {
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
    }),
  )
  async createProduct(
    @CurrentUser() user: UserContext,
    @UploadedFile() file: Express.Multer.File,
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      status: string;
      imageUrl: string;
    },
  ): Promise<Product> {
    let imageUrl: string | undefined = undefined;
    let mediaId: string | undefined = undefined;
    if (file) {
      const base64 = file.buffer.toString('base64');
      try {
        const uploadResult = await firstValueFrom(
          this.mediaClient.send('media.uploadProductImage', {
            fileName: file.originalname,
            mimeType: file.mimetype,
            base64,
            uploadedByUserId: user.userId,
          }),
        );
        imageUrl = uploadResult.url;
        mediaId = String(uploadResult._id);
      } catch (e) {
        throw new InternalServerErrorException(
          e?.message || 'Failed to upload image',
        );
      }
    }

    //const product: Product = {};
    const payload = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      status: body.status,
      imageUrl: imageUrl, //body.imageUrl,
      userId: user.userId,
    };
    try {
      const result = await firstValueFrom(
        this.catalogClient.send<Product>('product.create', payload).pipe(
          timeout(5000),
          catchError((err) => throwError(err)),
        ),
      );
      // Attach media to product
      if (mediaId) {
        const media = await firstValueFrom(
          this.mediaClient.send('media.attachToProduct', {
            mediaId,
            productId: String(result._id),
            attachedByUserId: user.userId,
          }),
        );
      }

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
