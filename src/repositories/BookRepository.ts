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

  /**
   * ค้นหาหนังสือด้วย keyword พร้อม pagination
   * ค้นหาได้จาก: ชื่อหนังสือ, หมวดหนังสือ, ชื่อผู้แต่ง, ชื่อผู้ยืม
   */
  async searchBooksWithKeywordAndPagination(
    keyword: string,
    page: number,
    limit: number
  ): Promise<any[]> {
    const skip = (page - 1) * limit;

    // สร้าง where condition สำหรับค้นหาจากหลาย field
    const whereCondition = keyword
      ? {
          OR: [
            // ค้นหาจากชื่อหนังสือ
            { title: { contains: keyword, mode: "insensitive" as const } },
            // ค้นหาจากหมวดหนังสือ
            { category: { contains: keyword, mode: "insensitive" as const } },
            // ค้นหาจากชื่อผู้แต่ง (firstName หรือ lastName)
            {
              author: {
                OR: [
                  { firstName: { contains: keyword, mode: "insensitive" as const } },
                  { lastName: { contains: keyword, mode: "insensitive" as const } },
                ],
              },
            },
            // ค้นหาจากชื่อผู้ยืม (ผ่าน borrowItems -> transaction -> member)
            {
              borrowItems: {
                some: {
                  transaction: {
                    member: {
                      OR: [
                        { firstName: { contains: keyword, mode: "insensitive" as const } },
                        { lastName: { contains: keyword, mode: "insensitive" as const } },
                      ],
                    },
                  },
                },
              },
            },
          ],
        }
      : {};

    return prisma.book.findMany({
      where: whereCondition,
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            affiliation: true,
          },
        },
        borrowItems: {
          include: {
            transaction: {
              include: {
                member: {
                  select: {
                    id: true,
                    memberCode: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  /**
   * นับจำนวนหนังสือที่ค้นหาด้วย keyword
   * ค้นหาได้จาก: ชื่อหนังสือ, หมวดหนังสือ, ชื่อผู้แต่ง, ชื่อผู้ยืม
   */
  async countBooksWithKeyword(keyword: string): Promise<number> {
    const whereCondition = keyword
      ? {
          OR: [
            { title: { contains: keyword, mode: "insensitive" as const } },
            { category: { contains: keyword, mode: "insensitive" as const } },
            {
              author: {
                OR: [
                  { firstName: { contains: keyword, mode: "insensitive" as const } },
                  { lastName: { contains: keyword, mode: "insensitive" as const } },
                ],
              },
            },
            {
              borrowItems: {
                some: {
                  transaction: {
                    member: {
                      OR: [
                        { firstName: { contains: keyword, mode: "insensitive" as const } },
                        { lastName: { contains: keyword, mode: "insensitive" as const } },
                      ],
                    },
                  },
                },
              },
            },
          ],
        }
      : {};

    return prisma.book.count({ where: whereCondition });
  }
}
