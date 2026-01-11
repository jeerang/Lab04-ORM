import { Router, type Request, type Response } from "express";
import { bookService } from "../services/BookService";

const router = Router();

/**
 * GET /books?keyword=xxx&page=1&limit=10
 * ค้นหาหนังสือด้วย keyword พร้อม pagination
 * ค้นหาได้จาก: ชื่อหนังสือ, หมวดหนังสือ, ชื่อผู้แต่ง, ชื่อผู้ยืม
 * ถ้าไม่ส่ง keyword จะแสดงหนังสือทั้งหมด
 */
router.get("/", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const keyword = (req.query.keyword as string) || "";

  const result = await bookService.searchBooksAdvanced(keyword, page, limit);

  if (result.data.length === 0) {
    return res.status(404).json({ message: "No books found" });
  }

  res.setHeader("x-total-count", result.total.toString());
  res.setHeader("x-total-pages", result.totalPages.toString());
  res.json({
    success: true,
    message: "Books retrieved successfully",
    ...result,
  });
});

export default router;
