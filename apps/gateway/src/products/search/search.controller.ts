import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
  ) {}

  @Get()
  async search(@Query('q') q: string, @Query('limit') limit?: string) {
    const limitNo =
      typeof limit === 'string' && limit.trim() ? Number(limit) : undefined;

    try {
      const result = await this.searchClient.send('search.query', {
        q,
        limit: limitNo,
      });
      return { q, count: Array.isArray(result) ? result.length : 0, result };
    } catch (e) {
      throw new RpcException(e?.message || e || 'Failed to search products');
    }
  }
}
