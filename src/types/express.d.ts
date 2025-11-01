// src/types/express.d.ts

/**
 * @fileoverview Extiende las definiciones de tipos globales para el objeto Request de Express.
 * @module types/express
 */

/**
 * @interface JwtPayload
 * @description Define la estructura esperada del payload decodificado de nuestros tokens JWT.
 * Usado por el middleware de autenticación.
 * @property {number} id - El ID numérico del usuario.
 * @property {string} username - El nombre de usuario.
 */
export interface JwtPayload {
  "id": number;
  "username": string;
}

declare global {
  /**
   * @namespace Express
   * @description Aumenta el namespace global de Express.
   */
  namespace Express {
    /**
     * @interface Request
     * @description Aumenta la interfaz Request de Express para añadir la propiedad `user`.
     * Esta propiedad será adjuntada por el middleware de autenticación.
     * @property {JwtPayload} [user] - Contiene el payload decodificado del JWT si el usuario está autenticado. Es opcional.
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface Request {
      user?: JwtPayload;
    }
  }
}