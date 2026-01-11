import type { BorrowItem } from "../generated/prisma/client";
import { BorrowItemRepository } from "../repositories/BorrowItemRepository";

export class BorrowItemService {
  constructor(private historyRepository: BorrowItemRepository) {}

  async getAllHistories(query: Record<string, any> = {}): Promise<BorrowItem[]> {
    return this.historyRepository.findAll(query);
  }

  async getAllHistoriesWithPagination(
    page: number,
    limit: number,
    query: Record<string, any> = {}
  ): Promise<{ data: BorrowItem[]; total: number; page: number; limit: number }> {
    const total = await this.historyRepository.count(query);
    const data = await this.historyRepository.findManyWithPagination(query, page, limit);

    return { data, total, page, limit };
  }

  async getAllHistoriesWithPaginationAndKeywordByUsingOr(
    page: number,
    limit: number,
    keyword: string,
    query: Record<string, any> = {}
  ): Promise<{ data: BorrowItem[]; total: number; page: number; limit: number }> {
    const total = await this.historyRepository.countWithKeywordByUsingOr(query, keyword);
    const data = await this.historyRepository.findManyWithPaginationAndKeywordByUsingOr(query, keyword, page, limit);

    return { data, total, page, limit };
  }
}

const historyRepository = new BorrowItemRepository();
export const historyService = new BorrowItemService(historyRepository);
