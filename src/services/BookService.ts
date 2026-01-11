import type { Book } from "../generated/prisma/client";
import { BookRepository } from "../repositories/BookRepository";

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async getAllBooks(query: Record<string, any> = {}): Promise<Book[]> {
    const books = await this.bookRepository.findAll(query);
    return books;
  }

  async getAllBoooksWithPagination(
    page: number,
    limit: number,
    query: Record<string, any> = {}
  ): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const total = await this.bookRepository.count(query);
    const data = await this.bookRepository.findManyWithPagination(
      query,
      page,
      limit
    );

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async getAllBoooksWithPaginationAndKeywordByUsingOr(
    page: number,
    limit: number,
    keyword: string,
    query: Record<string, any> = {}
  ): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const total = await this.bookRepository.countWithKeywordByUsingOr(
      query,
      keyword
    );
    const data =
      await this.bookRepository.findManyWithPaginationAndKeywordByUsingOr(
        query,
        keyword,
        page,
        limit
      );

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async searchBooksWithRelations(
    keyword: string,
    page: number,
    limit: number
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const total = await this.bookRepository.countWithKeywordWithRelations(
      keyword
    );
    const data =
      await this.bookRepository.findManyWithPaginationAndKeywordWithRelations(
        keyword,
        page,
        limit
      );

    return {
      data,
      total,
      page,
      limit,
    };
  }
}

// Export singleton instance
const bookRepository = new BookRepository();
export const bookService = new BookService(bookRepository);
