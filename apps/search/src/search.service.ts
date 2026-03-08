import { Injectable } from '@nestjs/common';
import {
  SearchProduct,
  SearchProductDocument,
} from './search/search-index-schema';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(SearchProduct.name)
    private readonly model: Model<SearchProductDocument>,
  ) {}

  normalizeText(input: { name: string; description: string }): string {
    return `${input.name} ${input.description}`.toLowerCase();
  }

  async upsertFromCatalogEvent(input: {
    productId: string;
    name: string;
    description: string;
    status: 'DRAFT' | 'ACTIVE';
    price: number;
  }): Promise<SearchProductDocument> {
    const normalizedText = this.normalizeText(input);
    if (!isValidObjectId(input.productId))
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid product id',
      });
    const productSearch: SearchProductDocument | null =
      await this.model.findOneAndUpdate(
        { productId: input.productId },
        {
          $set: {
            name: input.name,
            normalizedText,
            status: input.status,
            price: input.price,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    if (!productSearch) throw new RpcException('Failed to upsert product');
    return productSearch;
  }

  async query(input: {
    q: string;
    limit?: number;
  }): Promise<SearchProductDocument[]> {
    const q: string = (input.q ?? '').trim().toLowerCase();
    if (!q)
      throw new RpcException({
        statusCode: 400,
        message: 'Invalid query',
      });
    const limit: number = Math.min(Math.max(input.limit ?? 10, 1), 25);
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

    return await this.model
      .find({ normalizedText: { $regex: regex } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  ping(): { ok: boolean; service: string; now: string } {
    return {
      ok: true,
      service: 'Search',
      now: new Date().toLocaleString(),
    };
  }
}
