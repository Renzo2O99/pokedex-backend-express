// src/features/auth/auth.controller.ts

/**
 * @fileoverview Controlador para manejar la lógica de autenticación de usuarios.
 * Proporciona métodos para registrar y loguear usuarios, interactuando con `AuthService`.
 * @module features/auth/auth.controller
 */

import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { logger } from "../../core/utils/logger";
import { UnauthorizedError } from "../../core/utils/errors";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../core/constants";
import bcrypt from "bcryptjs";
import type { JwtPayload } from "../../types/express.d";

const authService = new AuthService();

/**
 * Maneja la solicitud para registrar un nuevo usuario. Valida los datos de entrada,
 * verifica si el username o email ya existen y llama al servicio de registro.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<Response>} Una respuesta JSON indicando éxito o error.
 * @throws {ConflictError} Si el username o email ya están en uso.
 */
export async function registerUser(req: Request, res: Response): Promise<Response> {
	const { username, email, password } = req.body;

	const newUser = await authService.register(username, email, password);
	logger.success(`Usuario registrado: ${newUser.username} (ID: ${newUser.id})`);

	return res.status(201).json({
		message: SUCCESS_MESSAGES.REGISTER_SUCCESS,
		user: newUser,
	});
}

/**
 * Maneja la solicitud para iniciar sesión. Valida las credenciales
 * y llama al servicio de login para generar un token JWT.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<Response>} Una respuesta JSON con el token y datos del usuario o un error.
 * @throws {UnauthorizedError} Si las credenciales son inválidas.
 */
export async function loginUser(req: Request, res: Response): Promise<Response> {
	logger.info(`Intento de login para: ${req.body.email}`);

	const { email, password } = req.body;

	try {
		const result = await authService.login(email, password);
		logger.success(`Login exitoso para: ${result.user.email} (ID: ${result.user.id})`);
		return res.status(200).json({
			message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
			data: result,
		});
	} catch (error: unknown) {
		if (
			error instanceof Error &&
			(error.message === ERROR_MESSAGES.USER_NOT_FOUND || error.message === ERROR_MESSAGES.PASSWORD_INCORRECT)
		) {
			logger.error(`\nLogin fallido para: ${email} - Credenciales inválidas`);
			throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
		}
		logger.error(`Error inesperado durante login para ${email}:`, error);
		throw error;
	}
}

/**
 * Maneja la solicitud para obtener el perfil del usuario autenticado.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<Response>} Una respuesta JSON con los datos del usuario.
 * @throws {NotFoundError} Si el usuario del token ya no existe.
 */
export async function getCurrentUser(req: Request, res: Response): Promise<Response> {
	const userPayload = req.user as JwtPayload; // Proviene del authMiddleware
	logger.info(`Request received for /api/auth/me for user: ${userPayload.username}`);

	const user = await authService.findUserById(userPayload.id);

	if (!user) {
		throw new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND);
	}

	return res.status(200).json({
		message: SUCCESS_MESSAGES.PROFILE_FETCHED,
		data: {
			id: user.id,
			username: user.username,
			email: user.email,
			createdAt: user.createdAt,
		},
	});
}

/**
 * Maneja la solicitud para cambiar la contraseña del usuario.
 * @param {Request} req - El objeto de solicitud de Express.
 * @param {Response} res - El objeto de respuesta de Express.
 * @returns {Promise<Response>} Una respuesta JSON de éxito.
 * @throws {UnauthorizedError} Si la contraseña antigua es incorrecta.
 */
export async function changeUserPassword(req: Request, res: Response): Promise<Response> {
	const userPayload = req.user as JwtPayload;
	const { oldPassword, newPassword } = req.body;
	logger.info(`Intento de cambio de contraseña para: ${userPayload.username}`);

	// 1. Obtener el usuario (incluyendo su hash)
	const user = await authService.findUserById(userPayload.id);
	if (!user) {
		throw new UnauthorizedError(ERROR_MESSAGES.USER_NOT_FOUND);
	}

	// 2. Verificar la contraseña antigua
	const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);
	if (!isPasswordValid) {
		logger.warn(`Cambio de contraseña fallido para ${userPayload.username}: Contraseña antigua incorrecta.`);
		throw new UnauthorizedError(ERROR_MESSAGES.PASSWORD_OLD_INCORRECT);
	}

	// 3. Hashear y guardar la nueva contraseña
	const newPasswordHash = await bcrypt.hash(newPassword, 10);
	await authService.updatePassword(user.id, newPasswordHash);

	logger.success(`Contraseña actualizada exitosamente para: ${userPayload.username}`);
	return res.status(200).json({
		message: SUCCESS_MESSAGES.PASSWORD_CHANGED,
	});
}
