import type { Book } from "../generated/prisma/client";
import { prisma } from "../lib/Prisma";
import {
  mapQueryToPrismaOptions,
  mapQueryToPrismaOptionsWithOutPagination,
  mapQueryToPrismaOptionsWithPagination,
  mapQueryToPrismaOptionsWithKeywordSearch,
  mapQueryToPrismaOptionsWithKeywordSearchWithoutPagination,
  mapQueryWithKeywordSearchAndRelations,
  buildKeywordSearchWhereWithRelations,
} from "../utils/queryMapper";

export class BookRepository {
  async findAll(query: Record<string, any> = {}): Promise<Book[]> {
    const where = mapQueryToPrismaOptions(query);
    return prisma.book.findMany(where);
  }

  async findManyWithPagination(
    query: Record<string, any> = {},
    page: number,
    limit: number
  ): Promise<Book[]> {
    const where = mapQueryToPrismaOptionsWithPagination(query, page, limit);
    return prisma.book.findMany(where);
  }

  async findManyWithPaginationAndKeywordByUsingOr(
    query: Record<string, any> = {},
    keyword: string,
    page: number,
    limit: number
  ): Promise<Book[]> {
    const options = mapQueryToPrismaOptionsWithKeywordSearch(
      query,
      keyword,
      ["title", "category"],
      page,
      limit
    );
    return prisma.book.findMany(options);
  }

  async count(query: Record<string, any> = {}): Promise<number> {
    const where = mapQueryToPrismaOptionsWithOutPagination(query);
    return prisma.book.count(where);
  }

  async countWithKeywordByUsingOr(
    query: Record<string, any> = {},
    keyword: string
  ): Promise<number> {
    const options = mapQueryToPrismaOptionsWithKeywordSearchWithoutPagination(
      query,
      keyword,
      ["title", "category"]
    );
    return prisma.book.count(options);
  }

  async findManyWithPaginationAndKeywordWithRelations(
    keyword: string,
    page: number,
    limit: number
  ): Promise<any[]> {
    const options = mapQueryWithKeywordSearchAndRelations(
      keyword,
      {
        directFields: ["title", "category"],
        relations: {
          author: {
            fields: ["firstName", "lastName"],
          },
          borrowItems: {
            useMany: true,
            nestedRelation: {
              name: "transaction",
              fields: ["createdAt"],
            },
          },
        },
      },
      {
        author: true,
        borrowItems: {
          include: {
            transaction: true,
          },
        },
      },
      page,
      limit
    );

    return prisma.book.findMany(options);
  }

  async countWithKeywordWithRelations(keyword: string): Promise<number> {
    const where = buildKeywordSearchWhereWithRelations(keyword, {
      directFields: ["title", "category"],
      relations: {
        author: {
          fields: ["firstName", "lastName"],
        },
        borrowItems: {
          useMany: true,
          nestedRelation: {
            name: "transaction",
            fields: ["createdAt"],
          },
        },
      },
    });

    return prisma.book.count({ where });
  }

  async create(data: Book): Promise<Book> {
    return prisma.book.create({ data });
  }
}
