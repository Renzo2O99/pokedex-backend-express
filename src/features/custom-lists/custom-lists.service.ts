// src/features/custom-lists/custom-lists.service.ts

/**
 * @fileoverview Servicio que maneja la lógica de negocio relacionada con las listas personalizadas de Pokémon.
 * Proporciona métodos para gestionar las operaciones CRUD de listas y sus relaciones con Pokémon.
 * @module features/custom-lists/custom-lists.service
 */

import { db } from "../../core/db";
import { customLists, customListPokemons, users } from "../../core/db/schema";
import { and, eq, desc } from "drizzle-orm";
import { logger } from "../../core/utils/logger";

/**
 * @class CustomListsService
 * @description Servicio que maneja la lógica de negocio relacionada con las listas personalizadas de Pokémon.
 * Proporciona métodos para gestionar las operaciones CRUD de listas y sus relaciones con Pokémon.
 */
export class CustomListsService {
  /**
   * Crea una nueva lista personalizada para un usuario.
   * @async
   * @param {number} userId - ID del usuario propietario de la lista.
   * @param {string} name - Nombre de la lista.
   * @returns {Promise<{id: number, userId: number, name: string, createdAt: Date}>} La lista recién creada.
   * @throws {Error} Si ocurre un error al crear la lista en la base de datos.
   */
  public async createList(userId: number, name: string) {
    const newList = await db.insert(customLists).values({
      userId,
      name,
    }).returning();
    return newList[0];
  }

  /**
   * Actualiza el nombre de una lista personalizada existente.
   * @async
   * @param {number} listId - ID de la lista a actualizar.
   * @param {string} name - Nuevo nombre para la lista.
   * @returns {Promise<{id: number, userId: number, name: string, createdAt: Date}>} La lista actualizada.
   * @throws {Error} Si ocurre un error al actualizar la lista en la base de datos.
   */
  public async updateList(listId: number, name: string) {
    const updatedList = await db.update(customLists)
      .set({ name, createdAt: new Date() }) // Opcional: actualizar 'createdAt' como 'updatedAt'
      .where(eq(customLists.id, listId))
      .returning();
    return updatedList[0];
  }

  /**
   * Elimina una lista personalizada y todas sus relaciones con Pokémon.
   * @async
   * @param {number} listId - ID de la lista a eliminar.
   * @returns {Promise<{id: number, userId: number, name: string, createdAt: Date}>} La lista eliminada.
   * @throws {Error} Si ocurre un error al eliminar la lista de la base de datos.
   */
  public async deleteList(listId: number) {
    const deletedList = await db.delete(customLists)
      .where(eq(customLists.id, listId))
      .returning();
    // La BD se encarga de borrar en cascada los pokémon de `customListPokemons`
    return deletedList[0];
  }

  /**
   * Obtiene todas las listas de un usuario sin incluir los Pokémon.
   * @async
   * @param {number} userId - ID del usuario cuyas listas se desean obtener.
   * @returns {Promise<Array<{id: number, userId: number, name: string, createdAt: Date}>>} 
   *          Un array de listas ordenadas por fecha de creación descendente.
   * @throws {Error} Si ocurre un error al consultar la base de datos.
   */
  public async getListsByUserId(userId: number) {
    return db.query.customLists.findMany({
      where: eq(customLists.userId, userId),
      orderBy: [desc(customLists.createdAt)],
    });
  }

  /**
   * Obtiene una lista específica junto con los IDs de sus Pokémon asociados.
   * @async
   * @param {number} listId - ID de la lista a recuperar.
   * @returns {Promise<{id: number, userId: number, name: string, createdAt: Date, pokemons: Array<{pokemonId: number}>} | undefined>} 
   *          La lista con los IDs de sus Pokémon, o undefined si no se encuentra.
   * @throws {Error} Si ocurre un error al consultar la base de datos.
   */
  public async getListWithPokemons(listId: number) {
    // Si definiste las relaciones en Drizzle, puedes hacer esto:
    return db.query.customLists.findFirst({
      where: eq(customLists.id, listId),
      with: {
        pokemons: {
          columns: {
            pokemonId: true
          }
        }
      }
    });
  }

  /**
   * Obtiene una lista por su ID sin incluir los Pokémon asociados.
   * @async
   * @param {number} listId - ID de la lista a buscar.
   * @returns {Promise<{id: number, userId: number, name: string, createdAt: Date} | undefined>} 
   *          La lista encontrada o undefined si no existe.
   * @throws {Error} Si ocurre un error al consultar la base de datos.
   */
  public async getListById(listId: number) {
    return db.query.customLists.findFirst({
      where: eq(customLists.id, listId)
    });
  }

  /**
   * Busca un Pokémon específico dentro de una lista.
   * @async
   * @param {number} listId - ID de la lista donde buscar.
   * @param {number} pokemonId - ID del Pokémon a buscar.
   * @returns {Promise<{id: number, listId: number, pokemonId: number, createdAt: Date} | undefined>} 
   *          La entrada encontrada o undefined si el Pokémon no está en la lista.
   * @throws {Error} Si ocurre un error al consultar la base de datos.
   */
  public async findPokemonInList(listId: number, pokemonId: number) {
    return db.query.customListPokemons.findFirst({
      where: and(
        eq(customListPokemons.listId, listId),
        eq(customListPokemons.pokemonId, pokemonId)
      )
    });
  }

  /**
   * Añade un Pokémon a una lista personalizada.
   * @async
   * @param {number} listId - ID de la lista a la que añadir el Pokémon.
   * @param {number} pokemonId - ID del Pokémon a añadir.
   * @returns {Promise<{id: number, listId: number, pokemonId: number, createdAt: Date}>} 
   *          La entrada creada que relaciona el Pokémon con la lista.
   * @throws {Error} Si ocurre un error al insertar en la base de datos.
   */
  public async addPokemonToList(listId: number, pokemonId: number) {
    const newEntry = await db.insert(customListPokemons).values({
      listId,
      pokemonId,
    }).returning();
    return newEntry[0];
  }

  /**
   * Elimina un Pokémon de una lista personalizada.
   * @async
   * @param {number} listId - ID de la lista de la que eliminar el Pokémon.
   * @param {number} pokemonId - ID del Pokémon a eliminar.
   * @returns {Promise<{id: number, listId: number, pokemonId: number, createdAt: Date} | undefined>} 
   *          La entrada eliminada que relacionaba el Pokémon con la lista, o undefined si no existía.
   * @throws {Error} Si ocurre un error al eliminar de la base de datos.
   */
  public async removePokemonFromList(listId: number, pokemonId: number) {
    const deletedEntry = await db.delete(customListPokemons)
      .where(and(
        eq(customListPokemons.listId, listId),
        eq(customListPokemons.pokemonId, pokemonId)
      ))
      .returning();
    return deletedEntry[0];
  }
}