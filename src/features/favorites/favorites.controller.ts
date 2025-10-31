import { Request, Response } from "express";
import { FavoritesService } from "./favorites.service";
import { logger } from "../../core/utils/logger";
import { ConflictError, NotFoundError } from "../../core/utils/errors";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../core/constants";
import { JwtPayload } from "../../types/express.d";

const favoritesService = new FavoritesService();

export class FavoritesController {

  /**
   * Maneja la solicitud para obtener todos los favoritos de un usuario.
   */
  public static async handleGetFavorites(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;

    const userFavorites = await favoritesService.getFavoritesByUserId(user.id);

    return res.status(200).json({
      message: SUCCESS_MESSAGES.FAVORITES_FETCHED,
      data: userFavorites,
    });
  }

  /**
   * Maneja la solicitud para añadir un nuevo favorito.
   */
  public static async handleAddFavorite(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const { pokemonId } = req.body;

    const existing = await favoritesService.findFavoriteById(user.id, pokemonId);
    if (existing) {
      throw new ConflictError(ERROR_MESSAGES.FAVORITE_ALREADY_EXISTS);
    }

    const newFavorite = await favoritesService.addFavorite(user.id, pokemonId);
    logger.success(`Nuevo favorito añadido para User ID: ${user.id}`);

    return res.status(201).json({
      message: SUCCESS_MESSAGES.FAVORITE_ADDED,
      data: newFavorite,
    });
  }

  /**
   * Maneja la solicitud para eliminar un favorito.
   */
  public static async handleRemoveFavorite(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const pokemonId = parseInt(req.params.pokemonId, 10);

    const existing = await favoritesService.findFavoriteById(user.id, pokemonId);
    if (!existing) {
      throw new NotFoundError(ERROR_MESSAGES.FAVORITE_NOT_FOUND);
    }

    await favoritesService.removeFavorite(user.id, pokemonId);
    logger.success(`Favorito eliminado para User ID: ${user.id}`);

    return res.status(200).json({
      message: SUCCESS_MESSAGES.FAVORITE_REMOVED,
    });
  }
}