import { Router, type Request, type Response } from "express";
import { memberService } from "../services/MemberService";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const members = await memberService.getAllMembers(
    req.query as Record<string, any>
  );
  if (members.length === 0) {
    return res.status(404).json({ message: "No members found" });
  }
  res.json(members);
});

router.get("/paginated", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await memberService.getAllMembersWithPagination(
    page,
    limit,
    req.query as Record<string, any>
  );

  if (result.data.length === 0) {
    return res.status(404).json({ message: "No members found" });
  }

  res.setHeader("x-total-count", result.total.toString());
  res.json(result);
});

router.get("/search", async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const keyword = (req.query.keyword as string) || "";

  const result =
    await memberService.getAllMembersWithPaginationAndKeywordByUsingOr(
      page,
      limit,
      keyword,
      req.query as Record<string, any>
    );

  if (result.data.length === 0) {
    return res.status(404).json({ message: "No members found" });
  }

  res.setHeader("x-total-count", result.total.toString());
  res.json(result);
});

export default router;
