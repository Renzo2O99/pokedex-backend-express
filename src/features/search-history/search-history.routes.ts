import { Router } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { SearchHistoryController } from "./search-history.controller";
import { authMiddleware } from "../../core/middleware/auth.middleware";
import { validateAddTerm, validateDeleteTerm } from "./search-history.validation";

const router = Router();

router.get(
  "/",
  authMiddleware,
  catchAsync(SearchHistoryController.handleGetHistory)
);

router.post(
  "/",
  authMiddleware,
  validateAddTerm,
  catchAsync(SearchHistoryController.handleAddTerm)
);

router.delete(
  "/:id",
  authMiddleware,
  validateDeleteTerm,
  catchAsync(SearchHistoryController.handleDeleteTerm)
);

export const historyRoutes = router;