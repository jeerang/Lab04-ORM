import { Router, type Request, type Response } from "express";
import { historyService } from "../services/BorrowItemService";

const router = Router();

// GET /histories - ดึงประวัติการยืมทั้งหมด
router.get("/", async (req: Request, res: Response) => {
  const histories = await historyService.getAllHistories(
    req.query as Record<string, any>
  );
  if (histories.length === 0) {
    return res.status(404).json({ message: "No histories found" });
  }
  res.json(histories);
});

// GET /histories/paginated - ดึงประวัติการยืมแบบแบ่งหน้า
router.get("/paginated", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await historyService.getAllHistoriesWithPagination(
    page,
    limit,
    req.query as Record<string, any>
  );

  if (result.data.length === 0) {
    return res.status(404).json({ message: "No histories found" });
  }

  res.setHeader("x-total-count", result.total.toString());
  res.json(result);
});

// GET /histories/unreturned - ค้นหาหนังสือที่ยังไม่ได้คืน
router.get("/unreturned", async (req: Request, res: Response) => {
  const histories = await historyService.getAllHistories({ returnedAt: null });
  if (histories.length === 0) {
    return res.status(404).json({ message: "No unreturned books found" });
  }
  res.json(histories);
});

// GET /histories/due-date?dueDate=2026-01-15 - ค้นหาหนังสือที่มีกำหนดการคืนในวันที่กำหนด
router.get("/due-date", async (req: Request, res: Response) => {
  const dueDate = req.query.dueDate as string;
  if (!dueDate) {
    return res
      .status(400)
      .json({ message: "dueDate query parameter is required (format: YYYY-MM-DD)" });
  }

  const histories = await historyService.getAllHistories({
    dueDate,
  });

  if (histories.length === 0) {
    return res
      .status(404)
      .json({ message: "No books found for the given due date" });
  }

  res.json(histories);
});

// GET /histories/due-date-unreturned?dueDate=2026-01-15 - ค้นหาหนังสือที่มีกำหนดการคืนในวันที่กำหนดและยังไม่ได้คืน
router.get("/due-date-unreturned", async (req: Request, res: Response) => {
  const dueDate = req.query.dueDate as string;
  if (!dueDate) {
    return res
      .status(400)
      .json({ message: "dueDate query parameter is required (format: YYYY-MM-DD)" });
  }

  const histories = await historyService.getAllHistories({
    dueDate,
    returnedAt: null,
  });

  if (histories.length === 0) {
    return res
      .status(404)
      .json({ message: "No unreturned books found for the given due date" });
  }

  res.json(histories);
});

// GET /histories/search?keyword=xxx - ค้นหาประวัติการยืม
router.get("/search", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const keyword = (req.query.keyword as string) || "";

  const result =
    await historyService.getAllHistoriesWithPaginationAndKeywordByUsingOr(
      page,
      limit,
      keyword,
      req.query as Record<string, any>
    );

  if (result.data.length === 0) {
    return res.status(404).json({ message: "No histories found" });
  }

  res.setHeader("x-total-count", result.total.toString());
  res.json(result);
});

export default router;
