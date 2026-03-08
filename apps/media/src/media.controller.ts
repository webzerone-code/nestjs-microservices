import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { AttachToProductDto, UploadProductImageDto } from './media/media.dto';
import { MediaDocument } from './media/media.schema';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('service.ping')
  ping(): { ok: boolean; service: string; now: string } {
    return this.mediaService.ping();
  }

  @MessagePattern('media.uploadProductImage')
  async uploadProductImage(
    @Payload() payload: UploadProductImageDto,
  ): Promise<MediaDocument> {
    try {
      return await this.mediaService.uploadProductImage(payload);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }

  @MessagePattern('media.attachToProduct')
  async attachToProduct(
    @Payload() payload: AttachToProductDto,
  ): Promise<MediaDocument> {
    try {
      return await this.mediaService.attachToProduct(payload);
    } catch (e) {
      throw new RpcException(e.message);
    }
  }
}
