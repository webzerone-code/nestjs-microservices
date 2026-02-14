import { Controller, Get, Inject } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class GatewayController {
  constructor(
    private readonly gatewayService: GatewayService,
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
  ) {}

  @Get('health')
  async health() {
    const ping = async (serviceName: string, client: ClientProxy) => {
      try {
        const result = await firstValueFrom(
          client.send<any>('service.ping', { from: 'gateway', timeout: 5000 }),
        );
        return {
          ok: true,
          service: serviceName,
          result,
        };
      } catch (e) {
        return {
          ok: false,
          service: serviceName,
          error: e?.message ?? 'Unknown error',
        };
      }
    };
    const [catalog, media, search] = await Promise.all([
      ping('catalog', this.catalogClient),
      ping('media', this.mediaClient),
      ping('search', this.searchClient),
    ]);
    const ok = [catalog, media, search].every((p) => p.ok);
    return {
      ok,
      gateway: { service: 'gateway', now: new Date().toISOString() },
      services: { catalog, media, search },
    };
  }
}
