import type { Author } from "../generated/prisma/client";
import { AuthorRepository } from "../repositories/AuthorRepository";

export class AuthorService {
  constructor(private authorRepository: AuthorRepository) {}

  async getAllAuthors(query: Record<string, any> = {}): Promise<Author[]> {
    return this.authorRepository.findAll(query);
  }

  async getAllAuthorsWithPagination(
    page: number,
    limit: number,
    query: Record<string, any> = {}
  ): Promise<{ data: Author[]; total: number; page: number; limit: number }> {
    const total = await this.authorRepository.count(query);
    const data = await this.authorRepository.findManyWithPagination(query, page, limit);

    return { data, total, page, limit };
  }

  async getAllAuthorsWithPaginationAndKeywordByUsingOr(
    page: number,
    limit: number,
    keyword: string,
    query: Record<string, any> = {}
  ): Promise<{ data: Author[]; total: number; page: number; limit: number }> {
    const total = await this.authorRepository.countWithKeywordByUsingOr(query, keyword);
    const data = await this.authorRepository.findManyWithPaginationAndKeywordByUsingOr(query, keyword, page, limit);

    return { data, total, page, limit };
  }
}

const authorRepository = new AuthorRepository();
export const authorService = new AuthorService(authorRepository);

