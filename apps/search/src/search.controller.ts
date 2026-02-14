import { Controller } from '@nestjs/common';
import { SearchService } from './search.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern('service.ping')
  ping(): { ok: boolean; service: string; now: string } {
    return this.searchService.ping();
  }
}
