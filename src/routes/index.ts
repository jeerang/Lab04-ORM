import { Router } from "express";
import bookRoutes from "./bookRoutes";
import authorRoutes from "./authorRoutes";
import historyRoutes from "./historyRoutes";
import memberRoutes from "./memberRoutes";

const router = Router();

router.use("/books", bookRoutes);
router.use("/authors", authorRoutes);
router.use("/histories", historyRoutes);
router.use("/members", memberRoutes);

export default router;
