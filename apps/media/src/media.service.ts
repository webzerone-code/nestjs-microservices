import { Injectable } from '@nestjs/common';
import { initCloudinary } from './cloudinary/cloudinary.client';
import { Media, MediaDocument } from './media/media.schema';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { AttachToProductDto, UploadProductImageDto } from './media/media.dto';
import { RpcException } from '@nestjs/microservices';
import { UploadApiResponse } from 'cloudinary';
import { resolve } from 'node:dns';

@Injectable()
export class MediaService {
  private readonly cloudinary = initCloudinary();
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async uploadProductImage(
    input: UploadProductImageDto,
  ): Promise<MediaDocument> {
    const buffer = Buffer.from(input.base64, 'base64');
    if (!buffer.length) throw new RpcException('Invalid image');

    const uploadResult = await new Promise<UploadApiResponse | undefined>(
      (resolve, reject) => {
        const stream = this.cloudinary.uploader.upload_stream(
          {
            folder: 'nestjs-microservice/products',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
              return;
            }
            resolve(result);
          },
        );
        stream.end(buffer);
      },
    );
    const url = uploadResult?.secure_url || uploadResult?.url;
    const publicId = uploadResult?.public_id;
    if (!url || !publicId)
      throw new RpcException('Failed to upload image to cloudinary');

    const mediaDoc: MediaDocument = await this.mediaModel.create({
      url,
      publicId,
      uploadedByUserId: input.uploadedByUserId,
      productId: undefined,
    });
    return mediaDoc;
  }

  async attachToProduct(input: AttachToProductDto): Promise<MediaDocument> {
    if (!isValidObjectId(input.mediaId))
      throw new RpcException('Invalid media id');
    const update = await this.mediaModel
      .findByIdAndUpdate(
        input.mediaId,
        {
          $set: { productId: input.productId },
        },
        { new: true },
      )
      .exec();
    if (!update) throw new RpcException('Failed to attach media to product');
    return update;
  }

  ping(): { ok: boolean; service: string; now: string } {
    return {
      ok: true,
      service: 'Media',
      now: new Date().toLocaleString(),
    };
  }
}
