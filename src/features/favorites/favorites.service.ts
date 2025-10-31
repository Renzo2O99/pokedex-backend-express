import { db } from "../../core/db";
import { favorites } from "../../core/db/schema";
import { and, eq } from "drizzle-orm";
import { logger } from "../../core/utils/logger";

export class FavoritesService {
  /**
   * Obtiene todos los IDs de Pokémon favoritos para un usuario específico.
   * @param userId - El ID del usuario.
   * @returns Una promesa que resuelve con un array de favoritos.
   */
  public async getFavoritesByUserId(userId: number) {
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
   * Busca un solo favorito para ver si ya existe.
   * @param userId - El ID del usuario.
   * @param pokemonId - El ID del Pokémon.
   * @returns Una promesa que resuelve con el favorito si existe, o undefined.
   */
  public async findFavoriteById(userId: number, pokemonId: number) {
    return db.query.favorites.findFirst({
      where: and(
        eq(favorites.userId, userId),
        eq(favorites.pokemonId, pokemonId)
      ),
    });
  }

  /**
   * Añade un nuevo Pokémon a los favoritos de un usuario.
   * @param userId - El ID del usuario.
   * @param pokemonId - El ID del Pokémon.
   * @returns Una promesa que resuelve con el nuevo registro de favorito.
   */
  public async addFavorite(userId: number, pokemonId: number) {
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
   * Elimina un Pokémon de los favoritos de un usuario.
   * @param userId - El ID del usuario.
   * @param pokemonId - El ID del Pokémon.
   * @returns Una promesa que resuelve con el registro eliminado.
   */
  public async removeFavorite(userId: number, pokemonId: number) {
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