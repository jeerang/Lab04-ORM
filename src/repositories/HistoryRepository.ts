import type { History } from "../generated/prisma/client";
import { prisma } from "../lib/Prisma";
import {
  mapQueryToPrismaOptions,
  mapQueryToPrismaOptionsWithKeywordSearch,
  mapQueryToPrismaOptionsWithKeywordSearchWithoutPagination,
  mapQueryToPrismaOptionsWithOutPagination,
  mapQueryToPrismaOptionsWithPagination,
} from "../utils/queryMapper";

export class HistoryRepository {
  async findAll(query: Record<string, any> = {}): Promise<History[]> {
    const where = mapQueryToPrismaOptions(query);
    return prisma.history.findMany(where);
  }

  async findManyWithPagination(
    query: Record<string, any> = {},
    page: number,
    limit: number
  ): Promise<History[]> {
    const where = mapQueryToPrismaOptionsWithPagination(query, page, limit);
    return prisma.history.findMany(where);
  }

  async count(query: Record<string, any> = {}): Promise<number> {
    const where = mapQueryToPrismaOptionsWithOutPagination(query);
    return prisma.history.count(where);
  }

  async countWithKeywordByUsingOr(
    query: Record<string, any> = {},
    keyword: string
  ): Promise<number> {
    const options = mapQueryToPrismaOptionsWithKeywordSearchWithoutPagination(
      query,
      keyword,
      ["memberNo", "expectReturn", "returnedAt", "batchId"]
    );
    return prisma.history.count(options);
  }

  async findManyWithPaginationAndKeywordByUsingOr(
    query: Record<string, any> = {},
    keyword: string,
    page: number,
    limit: number
  ): Promise<History[]> {
    const options = mapQueryToPrismaOptionsWithKeywordSearch(
      query,
      keyword,
      ["memberNo", "expectReturn", "returnedAt", "batchId"],
      page,
      limit
    );
    return prisma.history.findMany(options);
  }

  async create(data: History): Promise<History> {
    return prisma.history.create({ data });
  }
}
