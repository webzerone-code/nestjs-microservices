import { Controller } from '@nestjs/common';
import { SearchService } from './search.service';
import {
  EventPattern,
  MessagePattern,
  Payload,
  RpcException,
} from '@nestjs/microservices';
import { ProductCreatedDto } from './events/product-events.dto';
import { SearchQueryDto } from './search/search-query.dto';
import { SearchProductDocument } from './search/search-index-schema';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @MessagePattern('service.ping')
  ping(): { ok: boolean; service: string; now: string } {
    return this.searchService.ping();
  }

  @EventPattern('product.created')
  async OnProductCreated(@Payload() payload: ProductCreatedDto): Promise<void> {
    console.log('Product created event received:', payload);
    await this.searchService.upsertFromCatalogEvent({
      productId: payload.productId,
      name: payload.name,
      description: payload.description,
      status: payload.status,
      price: payload.price,
    });
  }

  @MessagePattern('search.query')
  async query(
    @Payload() payload: SearchQueryDto,
  ): Promise<SearchProductDocument[]> {
    try {
      return await this.searchService.query(payload);
    } catch (e) {
      throw new RpcException({
        statusCode: 400,
        message: e || e?.message || 'Failed to query search index',
      });
    }
  }
}
