import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  ping(): { ok: boolean; service: string; now: string } {
    return {
      ok: true,
      service: 'Media',
      now: new Date().toLocaleString(),
    };
  }
}
