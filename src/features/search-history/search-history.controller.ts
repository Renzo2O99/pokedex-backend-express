import { Request, Response } from "express";
import { SearchHistoryService } from "./search-history.service";
import { logger } from "../../core/utils/logger";
import { NotFoundError, UnauthorizedError } from "../../core/utils/errors";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../core/constants";
import { JwtPayload } from "../../types/express.d";

const historyService = new SearchHistoryService();

export class SearchHistoryController {

  public static async handleGetHistory(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const history = await historyService.getHistoryByUserId(user.id);
        
    return res.status(200).json({
      message: SUCCESS_MESSAGES.HISTORY_FETCHED,
      data: history,
    });
  }

  public static async handleAddTerm(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const { searchTerm } = req.body;

    const newEntry = await historyService.addSearchTerm(user.id, searchTerm);
    logger.success(`Término de historial guardado para User ID: ${user.id}`);
        
    return res.status(201).json({
      message: SUCCESS_MESSAGES.HISTORY_ENTRY_ADDED,
      data: newEntry,
    });
  }

  public static async handleDeleteTerm(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const entryId = parseInt(req.params.id, 10);

    const entry = await historyService.findHistoryEntryById(entryId);
    if (!entry) {
      throw new NotFoundError(ERROR_MESSAGES.HISTORY_ENTRY_NOT_FOUND);
    }

    if (entry.userId !== user.id) {
      logger.warn(`Intento no autorizado de borrado. Usuario ${user.id} intentó borrar entrada ${entryId} de usuario ${entry.userId}`);
      throw new UnauthorizedError(ERROR_MESSAGES.HISTORY_FORBIDDEN);
    }

    await historyService.removeSearchTerm(entryId);
    logger.success(`Entrada de historial ${entryId} eliminada por User ID: ${user.id}`);
        
    return res.status(200).json({
      message: SUCCESS_MESSAGES.HISTORY_ENTRY_REMOVED,
    });
  }
}