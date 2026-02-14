import { Injectable } from '@nestjs/common';

@Injectable()
export class CatalogService {
  ping(): { ok: boolean; service: string; now: string } {
    return {
      ok: true,
      service: 'Catalog',
      now: new Date().toLocaleString(),
    };
  }
}
