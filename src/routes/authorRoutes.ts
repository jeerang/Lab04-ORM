import { Router, type Request, type Response } from "express";
import { authorService } from "../services/AuthorService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const authors = await authorService.getAllAuthors(
    req.query as Record<string, any>
  );
  if (authors.length === 0) {
    return res.status(404).json({ message: "No authors found" });
  }
  res.json(authors);
});

router.get("/paginated", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await authorService.getAllAuthorsWithPagination(
    page,
    limit,
    req.query as Record<string, any>
  );

  if (result.data.length === 0) {
    return res.status(404).json({ message: "No authors found" });
  }

  res.setHeader("x-total-count", result.total.toString());
  res.json(result);
});

router.get("/search", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const keyword = (req.query.keyword as string) || "";

  const result =
    await authorService.getAllAuthorsWithPaginationAndKeywordByUsingOr(
      page,
      limit,
      keyword,
      req.query as Record<string, any>
    );

  if (result.data.length === 0) {
    return res.status(404).json({ message: "No authors found" });
  }

  res.setHeader("x-total-count", result.total.toString());
  res.json(result);
});

export default router;
