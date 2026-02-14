import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('service.ping')
  ping(): { ok: boolean; service: string; now: string } {
    return this.mediaService.ping();
  }
}
