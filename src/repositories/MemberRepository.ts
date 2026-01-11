import type { Member } from "../generated/prisma/client";
import { prisma } from "../lib/Prisma";
import {
  mapQueryToPrismaOptions,
  mapQueryToPrismaOptionsWithKeywordSearch,
  mapQueryToPrismaOptionsWithKeywordSearchWithoutPagination,
  mapQueryToPrismaOptionsWithOutPagination,
  mapQueryToPrismaOptionsWithPagination,
} from "../utils/queryMapper";

export class MemberRepository {
  async findAll(query: Record<string, any> = {}): Promise<Member[]> {
    const where = mapQueryToPrismaOptions(query);
    return prisma.member.findMany(where);
  }

  async findManyWithPagination(
    query: Record<string, any> = {},
    page: number,
    limit: number
  ): Promise<Member[]> {
    const where = mapQueryToPrismaOptionsWithPagination(query, page, limit);
    return prisma.member.findMany(where);
  }

  async count(query: Record<string, any> = {}): Promise<number> {
    const where = mapQueryToPrismaOptionsWithOutPagination(query);
    return prisma.member.count(where);
  }

  async countWithKeywordByUsingOr(
    query: Record<string, any> = {},
    keyword: string
  ): Promise<number> {
    const options = mapQueryToPrismaOptionsWithKeywordSearchWithoutPagination(
      query,
      keyword,
      ["memberCode", "firstName", "lastName", "phone"]
    );
    return prisma.member.count(options);
  }

  async findManyWithPaginationAndKeywordByUsingOr(
    query: Record<string, any> = {},
    keyword: string,
    page: number,
    limit: number
  ): Promise<Member[]> {
    const options = mapQueryToPrismaOptionsWithKeywordSearch(
      query,
      keyword,
      ["memberCode", "firstName", "lastName", "phone"],
      page,
      limit
    );
    return prisma.member.findMany(options);
  }

  async create(data: Member): Promise<Member> {
    return prisma.member.create({ data });
  }
}
