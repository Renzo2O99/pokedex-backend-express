// backend-express/src/features/auth/auth.service.ts
import "dotenv/config";
import { db } from "../../core/db";
import { users } from "../../core/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logger } from "../../core/utils/logger";
import { ERROR_MESSAGES } from "../../core/constants";

export class AuthService {
  //? --- MÉTODO DE REGISTRO ---
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

  //? --- MÉTODO DE LOGIN ---
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

  //? --- MÉTODO PARA BUSCAR USUARIO POR EMAIL ---
  public async findUserByEmail(email: string) {
    return db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  //? --- MÉTODO PARA BUSCAR USUARIO POR NOMBRE ---
  public async findUserByUsername(username: string) {
    return db.query.users.findFirst({
      where: eq(users.username, username),
    });
  }
}