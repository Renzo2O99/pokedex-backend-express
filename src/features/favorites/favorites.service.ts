// src/features/favorites/favorites.service.ts

/**
 * @fileoverview Servicio que maneja la lógica de negocio relacionada con los Pokémon favoritos de los usuarios.
 * Proporciona métodos para gestionar las operaciones CRUD de favoritos en la base de datos.
 * @module features/favorites/favorites.service
 */

import { db } from "../../core/db";
import { favorites } from "../../core/db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../../core/utils/logger";

/**
 * @class FavoritesService
 * @description Servicio que maneja la lógica de negocio relacionada con los Pokémon favoritos de los usuarios.
 * Proporciona métodos para gestionar las operaciones CRUD de favoritos en la base de datos.
 */
export class FavoritesService {
  /**
   * Obtiene todos los Pokémon favoritos de un usuario específico.
   * @param {number} userId - ID del usuario del que se quieren obtener los favoritos.
   * @returns {Promise<Array<{pokemonId: number, createdAt: Date}>>} Promesa que resuelve a un array de objetos con los IDs de los Pokémon favoritos y la fecha de creación.
   * @throws {Error} Si ocurre un error al consultar la base de datos.
   */
  public async getFavoritesByUserId(userId: number): Promise<Array<{pokemonId: number, createdAt: Date}>> {
    logger.info(`Buscando favoritos para el usuario ID: ${userId}`);
    return db.query.favorites.findMany({
      where: eq(favorites.userId, userId),
      columns: {
        pokemonId: true,
        createdAt: true
      }
    });
  }

  /**
   * Busca un Pokémon específico en los favoritos de un usuario.
   * @param {number} userId - ID del usuario.
   * @param {number} pokemonId - ID del Pokémon a buscar en favoritos.
   * @returns {Promise<{id: number, userId: number, pokemonId: number, createdAt: Date} | undefined>} 
   *          Promesa que resuelve al registro de favorito si existe, o undefined si no se encuentra.
   * @throws {Error} Si ocurre un error al consultar la base de datos.
   */
  public async findFavoriteById(
    userId: number, 
    pokemonId: number
  ): Promise<{id: number, userId: number, pokemonId: number, createdAt: Date} | undefined> {
    return db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.pokemonId, pokemonId)
      ),
    });
  }

  /**
   * Añade un nuevo Pokémon a la lista de favoritos de un usuario.
   * @param {number} userId - ID del usuario que está añadiendo el favorito.
   * @param {number} pokemonId - ID del Pokémon que se va a añadir a favoritos.
   * @returns {Promise<{id: number, userId: number, pokemonId: number, createdAt: Date}>} 
   *          Promesa que resuelve al registro del nuevo favorito creado.
   * @throws {Error} Si ocurre un error al insertar en la base de datos.
   */
  public async addFavorite(
    userId: number, 
    pokemonId: number
  ): Promise<{id: number, userId: number, pokemonId: number, createdAt: Date}> {
    logger.info(`Añadiendo favorito (User: ${userId}, Pokemon: ${pokemonId})`);
    const newFavorite = await db
      .insert(favorites)
      .values({
        userId: userId,
        pokemonId: pokemonId,
      })
      .returning();
      
    return newFavorite[0];
  }

  /**
   * Elimina un Pokémon de la lista de favoritos de un usuario.
   * @param {number} userId - ID del usuario que está eliminando el favorito.
   * @param {number} pokemonId - ID del Pokémon que se va a eliminar de favoritos.
   * @returns {Promise<{id: number, userId: number, pokemonId: number, createdAt: Date} | undefined>} 
   *          Promesa que resuelve al registro del favorito eliminado, o undefined si no existía.
   * @throws {Error} Si ocurre un error al eliminar de la base de datos.
   */
  public async removeFavorite(
    userId: number, 
    pokemonId: number
  ): Promise<{id: number, userId: number, pokemonId: number, createdAt: Date} | undefined> {
    logger.info(`Eliminando favorito (User: ${userId}, Pokemon: ${pokemonId})`);
    const removedFavorite = await db
      .delete(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.pokemonId, pokemonId)
        )
      )
      .returning();

    return removedFavorite[0];
  }
}