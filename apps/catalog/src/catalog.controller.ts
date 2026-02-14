import { Controller } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @MessagePattern('service.ping')
  ping(): { ok: boolean; service: string; now: string } {
    return this.catalogService.ping();
  }
}
