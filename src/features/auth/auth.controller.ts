import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { logger } from "../../core/utils/logger";
import { ConflictError, UnauthorizedError } from "../../core/utils/errors";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../core/constants";

const authService = new AuthService();

/**
 * @class AuthController
 * @description Maneja las solicitudes HTTP entrantes para la autenticación.
 */
export class AuthController {
  
  /**
   * @static
   * @description Maneja la solicitud para registrar un nuevo usuario. Valida los datos de entrada,
   * verifica si el username o email ya existen y llama al servicio de registro.
   * @param {Request} req - El objeto de solicitud de Express.
   * @param {Response} res - El objeto de respuesta de Express.
   * @returns {Promise<Response>} Una respuesta JSON indicando éxito o error.
   * @throws {ConflictError} Si el username o email ya están en uso.
   */
  public static async register(req: Request, res: Response): Promise<Response> { 
    const { username, email, password } = req.body;

    const existingUserByUsername = await authService.findUserByUsername(username);
    if (existingUserByUsername) {
      throw new ConflictError(ERROR_MESSAGES.USERNAME_IN_USE);
    }

    const existingUserByEmail = await authService.findUserByEmail(email);
    if (existingUserByEmail) {
      throw new ConflictError(ERROR_MESSAGES.EMAIL_IN_USE);
    }

    const newUser = await authService.register(username, email, password);
    logger.success(`Usuario registrado: ${newUser.username} (ID: ${newUser.id})`);
    
    return res.status(201).json({
      "message": SUCCESS_MESSAGES.REGISTER_SUCCESS,
      "user": newUser,
    });
  }

  /**
   * @static
   * @description Maneja la solicitud para iniciar sesión. Valida las credenciales
   * y llama al servicio de login para generar un token JWT.
   * @param {Request} req - El objeto de solicitud de Express.
   * @param {Response} res - El objeto de respuesta de Express.
   * @returns {Promise<Response>} Una respuesta JSON con el token y datos del usuario o un error.
   * @throws {UnauthorizedError} Si las credenciales son inválidas.
   */
  public static async login(req: Request, res: Response): Promise<Response> { 
    logger.info(`Intento de login para: ${req.body.email}`); 
    
    const { email, password } = req.body;

    try {
      const result = await authService.login(email, password);
      logger.success(`Login exitoso para: ${result.user.email} (ID: ${result.user.id})`);
      return res.status(200).json({
        "message": SUCCESS_MESSAGES.LOGIN_SUCCESS,
        "data": result,
      });
    } catch (error: any) {
      if (error.message === ERROR_MESSAGES.USER_NOT_FOUND || error.message === ERROR_MESSAGES.PASSWORD_INCORRECT) {
      logger.error(`\nLogin fallido para: ${email} - Credenciales inválidas`);
        throw new UnauthorizedError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }
      logger.error(`Error inesperado durante login para ${email}:`, error); 
        throw error; 
    }
  }
}