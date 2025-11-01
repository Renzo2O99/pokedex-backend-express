// src/features/favorites/favorites.controller.ts

/**
 * @fileoverview Controlador que maneja las solicitudes relacionadas con los Pokémon favoritos de los usuarios.
 * Proporciona métodos para obtener, agregar y eliminar Pokémon de la lista de favoritos de un usuario.
 * @module features/favorites/favorites.controller
 */

import { Request, Response } from "express";
import { FavoritesService } from "./favorites.service";
import { logger } from "../../core/utils/logger";
import { ConflictError, NotFoundError } from "../../core/utils/errors";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../core/constants";
import { JwtPayload } from "../../types/express.d";

const favoritesService = new FavoritesService();

/**
 * @class FavoritesController
 * @description Controlador que maneja las solicitudes relacionadas con los Pokémon favoritos de los usuarios.
 * Proporciona métodos para obtener, agregar y eliminar Pokémon de la lista de favoritos de un usuario.
 */
export class FavoritesController {

  /**
   * Obtiene todos los Pokémon favoritos de un usuario autenticado.
   * @static
   * @param {Request} req - Objeto de solicitud de Express que contiene el usuario autenticado.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON con la lista de Pokémon favoritos del usuario.
   * @throws {Error} Si ocurre un error al obtener los favoritos.
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
   * Añade un nuevo Pokémon a la lista de favoritos del usuario autenticado.
   * @static
   * @param {Request} req - Objeto de solicitud de Express que contiene el ID del Pokémon y el usuario autenticado.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON con el Pokémon añadido a favoritos.
   * @throws {ConflictError} Si el Pokémon ya está en la lista de favoritos del usuario.
   * @throws {Error} Si ocurre un error al añadir el favorito.
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
   * Elimina un Pokémon de la lista de favoritos del usuario autenticado.
   * @static
   * @param {Request} req - Objeto de solicitud de Express que contiene el ID del Pokémon y el usuario autenticado.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON indicando que el Pokémon fue eliminado de favoritos.
   * @throws {NotFoundError} Si el Pokémon no se encuentra en la lista de favoritos del usuario.
   * @throws {Error} Si ocurre un error al eliminar el favorito.
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