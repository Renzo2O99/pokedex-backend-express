// src/features/auth/auth.service.ts
import "dotenv/config";
import { db } from "../../core/db";
import { users } from "../../core/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../../core/utils/logger";
import { ERROR_MESSAGES } from "../../core/constants";

/**
 * @class AuthService
 * @description Servicio que maneja la lógica de autenticación de usuarios,
 * incluyendo registro, inicio de sesión y búsqueda de usuarios.
 */
export class AuthService {
  /**
   * Registra un nuevo usuario en el sistema.
   * @param {string} username - Nombre de usuario único.
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} pass - Contraseña en texto plano que será hasheada.
   * @returns {Promise<{id: string, username: string, email: string}>} Usuario registrado sin información sensible.
   * @throws {Error} Si ocurre un error durante el registro.
   */
  public async register(username: string, email: string, pass: string) {
    // 1. Hashear la contraseña
    const passwordHash = await bcrypt.hash(pass, 10);

    // 2. Insertar el usuario en la Base de Datos
    const newUser = await db
      .insert(users)
      .values({
        "username": username,
        "email": email,
        "passwordHash": passwordHash,
      })
      .returning({
        "id": users.id,
        "username": users.username,
        "email": users.email,
      });

    return newUser[0];
  }

  /**
   * Autentica a un usuario y genera un token JWT.
   * @param {string} email - Correo electrónico del usuario.
   * @param {string} userPassword - Contraseña en texto plano para autenticación.
   * @returns {Promise<{token: string, user: {id: string, username: string, email: string}}>} 
   *          Token JWT e información básica del usuario.
   * @throws {Error} Si las credenciales son inválidas o hay un error en el servidor.
   */
  public async login(email: string, userPassword: string) {
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!JWT_SECRET) {
      logger.fatal(new Error("JWT_SECRET no está definido en .env"));
      throw new Error("JWT_SECRET is not defined");
    }
    // 1. Encontrar al usuario por su email
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    // 2. Comparar la contraseña enviada con el hash guardado
    const isPasswordValid = await bcrypt.compare(userPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error(ERROR_MESSAGES.PASSWORD_INCORRECT);
    }

    // 3. Crear el Token JWT
    const tokenPayload = {
      "id": user.id,
      "username": user.username,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, {
      "expiresIn": "7d",
    });

    return {
      "token": token,
      "user": {
        "id": user.id,
        "username": user.username,
        "email": user.email,
      },
    };
  }

  /**
   * Busca un usuario por su dirección de correo electrónico.
   * @param {string} email - Correo electrónico a buscar.
   * @returns {Promise<{id: string, username: string, email: string, passwordHash: string} | undefined>} 
   *          El usuario encontrado o undefined si no existe.
   */
  public async findUserByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  /**
   * Busca un usuario por su nombre de usuario.
   * @param {string} username - Nombre de usuario a buscar.
   * @returns {Promise<{id: string, username: string, email: string, passwordHash: string} | undefined>} 
   *          El usuario encontrado o undefined si no existe.
   */
  public async findUserByUsername(username: string) {
    return db.query.users.findFirst({
      where: eq(users.username, username),
    });
  }
}