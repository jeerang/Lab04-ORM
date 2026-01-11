import type { Member } from "../generated/prisma/client";
import { MemberRepository } from "../repositories/MemberRepository";

export class MemberService {
  constructor(private memberRepository: MemberRepository) {}

  async getAllMembers(query: Record<string, any> = {}): Promise<Member[]> {
    return this.memberRepository.findAll(query);
  }

  async getAllMembersWithPagination(
    page: number,
    limit: number,
    query: Record<string, any> = {}
  ): Promise<{ data: Member[]; total: number; page: number; limit: number }> {
    const total = await this.memberRepository.count(query);
    const data = await this.memberRepository.findManyWithPagination(query, page, limit);

    return { data, total, page, limit };
  }

  async getAllMembersWithPaginationAndKeywordByUsingOr(
    page: number,
    limit: number,
    keyword: string,
    query: Record<string, any> = {}
  ): Promise<{ data: Member[]; total: number; page: number; limit: number }> {
    const total = await this.memberRepository.countWithKeywordByUsingOr(query, keyword);
    const data = await this.memberRepository.findManyWithPaginationAndKeywordByUsingOr(query, keyword, page, limit);

    return { data, total, page, limit };
  }
}

const memberRepository = new MemberRepository();
export const memberService = new MemberService(memberRepository);

