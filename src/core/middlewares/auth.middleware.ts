// src/core/middlewares/auth.middleware.ts
import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger";
import type { JwtPayload } from "../../types/express.d";
import { AUTH_TOKEN_PREFIX, ERROR_MESSAGES } from "../constants";
import { UnauthorizedError } from "../utils/errors";

/**
 * @fileoverview Middleware para autenticar usuarios mediante JWT.
 * @module core/middleware/auth
 */

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
	const err = new Error("JWT_SECRET no está definido en las variables de entorno para el middleware de autenticación.");
	logger.fatal(err);
	throw err;
}

/**
 * @function authMiddleware
 * @description Middleware para autenticar usuarios a través de un JSON Web Token (JWT).
 * Busca el token en la cabecera "Authorization" (formato "Bearer <token>").
 * Verifica la validez del token usando el `JWT_SECRET`.
 * Si es válido, decodifica el payload y lo adjunta a `req.user`.
 * Si es inválido o falta, lanza un `UnauthorizedError`.
 * @param {Request} req - El objeto de solicitud de Express. Se espera que contenga `headers.authorization`.
 * @param {Response} res - El objeto de respuesta de Express.
 * @param {NextFunction} next - La función para pasar al siguiente middleware o al controlador.
 * @throws {UnauthorizedError} Si el token falta, tiene formato incorrecto, es inválido o ha expirado.
 * @returns {void} Llama a `next()` si el token es válido, o lanza un error.
 */
export const authMiddleware = (req: Request, _res: Response, next: NextFunction): void => {
	const authHeader = req.headers.authorization;
	
	if (!authHeader) {
		logger.warn(`Petición bloqueada: Falta el encabezado de autorización para ${req.method} ${req.originalUrl}`);
		throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_REQUIRED);
	}

	const token = authHeader.startsWith(AUTH_TOKEN_PREFIX) ? authHeader.split(" ")[1] : null;

	if (!token) {
		logger.warn(`Petición bloqueada: No se proveyó token para ${req.method} ${req.originalUrl}`);
		throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_REQUIRED);
	}

	try {
		const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;

		if (!payload || typeof payload !== "object" || !payload.id || !payload.username) {
			logger.error(`Token válido pero payload inesperado: ${JSON.stringify(payload)}`);
			throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_PAYLOAD_INVALID);
		}

		req.user = payload;

		logger.info(`Usuario autenticado: ${payload.username} (ID: ${payload.id}) para ${req.method} ${req.originalUrl}`);

		next();
	} catch (error: unknown) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		logger.error(
			`Intento de acceso con token inválido/expirado para ${req.method} ${req.originalUrl}: ${errorMessage}`,
		);
		throw new UnauthorizedError(ERROR_MESSAGES.TOKEN_INVALID_OR_EXPIRED);
	}
};
