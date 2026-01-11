import type { BorrowItem } from "../generated/prisma/client";
import { prisma } from "../lib/Prisma";
import {
  mapQueryToPrismaOptions,
  mapQueryToPrismaOptionsWithOutPagination,
  mapQueryToPrismaOptionsWithPagination,
} from "../utils/queryMapper";

export class BorrowItemRepository {
  async findAll(query: Record<string, any> = {}): Promise<BorrowItem[]> {
    const where = mapQueryToPrismaOptions(query);
    return prisma.borrowItem.findMany(where);
  }

  async findManyWithPagination(
    query: Record<string, any> = {},
    page: number,
    limit: number
  ): Promise<BorrowItem[]> {
    const where = mapQueryToPrismaOptionsWithPagination(query, page, limit);
    return prisma.borrowItem.findMany(where);
  }

  async count(query: Record<string, any> = {}): Promise<number> {
    const where = mapQueryToPrismaOptionsWithOutPagination(query);
    return prisma.borrowItem.count(where);
  }

  async create(data: BorrowItem): Promise<BorrowItem> {
    return prisma.borrowItem.create({ data });
  }

  async markReturned(itemId: number): Promise<BorrowItem> {
    return prisma.borrowItem.update({ where: { id: itemId }, data: { returnedAt: new Date() } });
  }
}

