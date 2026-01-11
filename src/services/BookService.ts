import type { Book } from "../generated/prisma/client";
import { BookRepository } from "../repositories/BookRepository";

export class BookService {
  constructor(private bookRepository: BookRepository) {}

  async getAllBooks(query: Record<string, any> = {}): Promise<Book[]> {
    return this.bookRepository.findAll(query);
  }

  async getAllBoooksWithPagination(
    page: number,
    limit: number,
    query: Record<string, any> = {}
  ): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const total = await this.bookRepository.count(query);
    const data = await this.bookRepository.findManyWithPagination(query, page, limit);

    return { data, total, page, limit };
  }

  async getAllBoooksWithPaginationAndKeywordByUsingOr(
    page: number,
    limit: number,
    keyword: string,
    query: Record<string, any> = {}
  ): Promise<{ data: Book[]; total: number; page: number; limit: number }> {
    const total = await this.bookRepository.countWithKeywordByUsingOr(query, keyword);
    const data = await this.bookRepository.findManyWithPaginationAndKeywordByUsingOr(query, keyword, page, limit);

    return { data, total, page, limit };
  }

  async searchBooksWithRelations(
    keyword: string,
    page: number,
    limit: number
  ): Promise<{ data: any[]; total: number; page: number; limit: number }> {
    const total = await this.bookRepository.countWithKeywordWithRelations(keyword);
    const data = await this.bookRepository.findManyWithPaginationAndKeywordWithRelations(keyword, page, limit);

    return { data, total, page, limit };
  }

  /**
   * ค้นหาหนังสือด้วย keyword พร้อม pagination
   * ค้นหาได้จาก: ชื่อหนังสือ, หมวดหนังสือ, ชื่อผู้แต่ง, ชื่อผู้ยืม
   */
  async searchBooksAdvanced(
    keyword: string,
    page: number,
    limit: number
  ): Promise<{
    data: any[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const total = await this.bookRepository.countBooksWithKeyword(keyword);
    const data = await this.bookRepository.searchBooksWithKeywordAndPagination(
      keyword,
      page,
      limit
    );

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

const bookRepository = new BookRepository();
export const bookService = new BookService(bookRepository);
