// src/features/search-history/search-history.controller.ts

/**
 * @fileoverview Controlador para manejar la lógica del historial de búsqueda de los usuarios.
 * Proporciona métodos para obtener, añadir y eliminar términos de búsqueda del historial.
 * @module features/search-history/search-history.controller
 */

import type { Request, Response } from "express";
import { SearchHistoryService } from "./search-history.service";
import { logger } from "../../core/utils/logger";
import { NotFoundError, UnauthorizedError } from "../../core/utils/errors";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../core/constants";
import type { JwtPayload } from "../../types/express.d";

const historyService = new SearchHistoryService();

/**
 * Maneja la solicitud para obtener el historial de búsqueda del usuario autenticado.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<Response>} Una respuesta JSON con el historial de búsqueda del usuario.
 */
export async function getSearchHistory(req: Request, res: Response): Promise<Response> {
	const user = req.user as JwtPayload;
	const history = await historyService.getHistoryByUserId(user.id);

	return res.status(200).json({
		message: SUCCESS_MESSAGES.HISTORY_FETCHED,
		data: history,
	});
}

/**
 * Maneja la solicitud para añadir un nuevo término de búsqueda al historial del usuario autenticado.
 * Si el término ya existe, actualiza su marca de tiempo.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<Response>} Una respuesta JSON con la nueva entrada del historial.
 */
export async function addSearchTerm(req: Request, res: Response): Promise<Response> {
	const user = req.user as JwtPayload;
	const { searchTerm } = req.body;

	const newEntry = await historyService.addSearchTerm(user.id, searchTerm);
	logger.success(`Término de historial guardado para User ID: ${user.id}`);

	return res.status(201).json({
		message: SUCCESS_MESSAGES.HISTORY_ENTRY_ADDED,
		data: newEntry,
	});
}

/**
 * Maneja la solicitud para eliminar una entrada específica del historial de búsqueda del usuario autenticado.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<Response>} Una respuesta JSON confirmando la eliminación.
 * @throws {NotFoundError} Si la entrada del historial no se encuentra.
 * @throws {UnauthorizedError} Si el usuario no es el propietario de la entrada del historial.
 */
export async function deleteSearchTerm(req: Request, res: Response): Promise<Response> {
	const user = req.user as JwtPayload;
	const entryId = parseInt(req.params.id, 10);

	const entry = await historyService.findHistoryEntryById(entryId);
	if (!entry) {
		throw new NotFoundError(ERROR_MESSAGES.HISTORY_ENTRY_NOT_FOUND);
	}

	if (entry.userId !== user.id) {
		logger.warn(
			`Intento no autorizado de borrado. Usuario ${user.id} intentó borrar entrada ${entryId} de usuario ${entry.userId}`,
		);
		throw new UnauthorizedError(ERROR_MESSAGES.HISTORY_FORBIDDEN);
	}

	await historyService.removeSearchTerm(entryId);
	logger.success(`Entrada de historial ${entryId} eliminada por User ID: ${user.id}`);

	return res.status(200).json({
		message: SUCCESS_MESSAGES.HISTORY_ENTRY_REMOVED,
	});
}
