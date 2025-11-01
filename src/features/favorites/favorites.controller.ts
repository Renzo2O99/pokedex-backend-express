// src/features/favorites/favorites.controller.ts

/**
 * @fileoverview Controlador que maneja las solicitudes relacionadas con los Pokémon favoritos de los usuarios.
 * Proporciona funciones para obtener, agregar y eliminar Pokémon de la lista de favoritos de un usuario.
 * @module features/favorites/favorites.controller
 */

import type { Request, Response } from "express";
import { FavoritesService } from "./favorites.service";
import { logger } from "../../core/utils/logger";
import { NotFoundError, UnauthorizedError } from "../../core/utils/errors";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../core/constants";
import type { JwtPayload } from "../../types/express.d";

const favoritesService = new FavoritesService();

/**
 * Obtiene todos los Pokémon favoritos de un usuario autenticado.
 * @param {Request} req - Objeto de solicitud de Express que contiene el usuario autenticado.
 * @param {Response} res - Objeto de respuesta de Express.
 * @returns {Promise<Response>} Respuesta JSON con la lista de Pokémon favoritos del usuario.
 * @throws {Error} Si ocurre un error al obtener los favoritos.
 */
export async function getFavorites(req: Request, res: Response): Promise<Response> {
	const user = req.user as JwtPayload;

	const userFavorites = await favoritesService.getFavoritesByUserId(user.id);

	return res.status(200).json({
		message: SUCCESS_MESSAGES.FAVORITES_FETCHED,
		data: userFavorites,
	});
}

/**
 * Añade un nuevo Pokémon a la lista de favoritos del usuario autenticado.
 * @param {Request} req - Objeto de solicitud de Express que contiene el ID del Pokémon y el usuario autenticado.
 * @param {Response} res - Objeto de respuesta de Express.
 * @returns {Promise<Response>} Respuesta JSON con el Pokémon añadido a favoritos.
 * @throws {ConflictError} Si el Pokémon ya está en la lista de favoritos del usuario.
 * @throws {Error} Si ocurre un error al añadir el favorito.
 */
export async function addFavorite(req: Request, res: Response): Promise<Response> {
	const user = req.user as JwtPayload;
	const { pokemonId } = req.body;

	const newFavorite = await favoritesService.addFavorite(user.id, pokemonId);
	logger.success(`Nuevo favorito añadido para User ID: ${user.id}`);

	return res.status(201).json({
		message: SUCCESS_MESSAGES.FAVORITE_ADDED,
		data: newFavorite,
	});
}

/**
 * Maneja la solicitud para eliminar un favorito por su ID de entrada único.
 * Este es el método recomendado para eliminar favoritos, ya que utiliza la clave primaria de la tabla.
 * @param {Request} req - Objeto de solicitud de Express que contiene el ID de la entrada de favorito y el usuario autenticado.
 * @param {Response} res - Objeto de respuesta de Express.
 * @returns {Promise<Response>} Respuesta JSON indicando que el Pokémon fue eliminado de favoritos.
 * @throws {NotFoundError} Si la entrada de favorito no se encuentra.
 * @throws {UnauthorizedError} Si el usuario no tiene permiso para eliminar la entrada de favorito.
 * @throws {Error} Si ocurre un error al eliminar el favorito.
 */
export async function removeFavoriteById(req: Request, res: Response): Promise<Response> {
	const user = req.user as JwtPayload;
	const favoriteEntryId = parseInt(req.params.id, 10);

	// 1. Verificar si la entrada de favorito existe
	const favoriteEntry = await favoritesService.findFavoriteByEntryId(favoriteEntryId);

	if (!favoriteEntry) {
		throw new NotFoundError(ERROR_MESSAGES.FAVORITE_NOT_FOUND);
	}

	// 2. Verificar si el usuario tiene permiso para eliminar esta entrada
	if (favoriteEntry.userId !== user.id) {
		throw new UnauthorizedError("No tienes permiso para eliminar este favorito.");
	}

	// 3. Si todo es correcto, proceder con la eliminación
	await favoritesService.removeFavoriteById(favoriteEntryId);

	logger.success(`Favorito (Entrada ID: ${favoriteEntryId}) eliminado por User ID: ${user.id}`);

	return res.status(200).json({
		message: SUCCESS_MESSAGES.FAVORITE_REMOVED,
	});
}
