import { Router, type Request, type Response } from "express";
import { historyService } from "../services/HistoryService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const histories = await historyService.getAllHistories(
    req.query as Record<string, any>
  );
  if (histories.length === 0) {
    return res.status(404).json({ message: "No histories found" });
  }
  res.json(histories);
});

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

router.get("/unreturned", async (req: Request, res: Response) => {
  const histories = await historyService.getAllHistories({ returnedAt: null });
  if (histories.length === 0) {
    return res.status(404).json({ message: "No unreturned histories found" });
  }
  res.json(histories);
});

router.get("/due-date", async (req: Request, res: Response) => {
  const expectReturn = req.query.expectReturn as string;
  if (!expectReturn) {
    return res
      .status(400)
      .json({ message: "dueDate query parameter is required" });
  }

  console.log("Expect Return Date:", new Date(expectReturn));
  // 2026-01-02 08:49:40.095
  const histories = await historyService.getAllHistories({
    expectReturn,
    returnedAt: null,
  });

  if (histories.length === 0) {
    return res
      .status(404)
      .json({ message: "No histories found for the given due date" });
  }

  res.json(histories);
});

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
