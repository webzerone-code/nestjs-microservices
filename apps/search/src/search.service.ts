import { Injectable } from '@nestjs/common';

@Injectable()
export class SearchService {
  ping(): { ok: boolean; service: string; now: string } {
    return {
      ok: true,
      service: 'Search',
      now: new Date().toLocaleString(),
    };
  }
}
