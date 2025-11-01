// src/features/custom-lists/custom-lists.controller.ts

/**
 * @fileoverview Controlador para manejar las operaciones relacionadas con las listas personalizadas de Pokémon.
 * Proporciona métodos para crear, leer, actualizar y eliminar listas, así como gestionar los Pokémon dentro de ellas.
 * @module features/custom-lists/custom-lists.controller
 */

import { Request, Response } from "express";
import { CustomListsService } from "./custom-lists.service";
import { logger } from "../../core/utils/logger";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../core/utils/errors";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../../core/constants";
import { JwtPayload } from "../../types/express.d";

const listService = new CustomListsService();

/**
 * Verifica si un usuario es propietario de una lista específica.
 * @private
 * @async
 * @function checkOwnership
 * @param {number} userId - ID del usuario autenticado.
 * @param {number} listId - ID de la lista a verificar.
 * @returns {Promise<Object>} La lista si el usuario es el propietario.
 * @throws {NotFoundError} Si la lista no existe.
 * @throws {UnauthorizedError} Si el usuario no es el propietario de la lista.
 */
const checkOwnership = async (userId: number, listId: number) => {
  const list = await listService.getListById(listId);
  if (!list) {
    throw new NotFoundError(ERROR_MESSAGES.LIST_NOT_FOUND);
  }
  if (list.userId !== userId) {
    logger.warn(`Intento no autorizado. Usuario ${userId} intentó acceder a lista ${listId} de usuario ${list.userId}`);
    throw new UnauthorizedError(ERROR_MESSAGES.LIST_FORBIDDEN);
  }
  return list;
};

/**
 * @class CustomListsController
 * @description Controlador que maneja las operaciones relacionadas con las listas personalizadas de Pokémon.
 * Permite a los usuarios crear, leer, actualizar y eliminar listas, así como gestionar los Pokémon dentro de ellas.
 */
export class CustomListsController {
  /**
   * Obtiene todas las listas del usuario autenticado.
   * @static
   * @async
   * @param {Request} req - Objeto de solicitud de Express.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON con las listas del usuario.
   */
  public static async handleGetLists(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const lists = await listService.getListsByUserId(user.id);
    return res.status(200).json({
      message: SUCCESS_MESSAGES.LISTS_FETCHED,
      data: lists,
    });
  }

  /**
   * Obtiene los detalles de una lista específica incluyendo sus Pokémon.
   * @static
   * @async
   * @param {Request} req - Objeto de solicitud de Express con el ID de la lista en los parámetros.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON con los detalles de la lista y sus Pokémon.
   * @throws {NotFoundError} Si la lista no existe.
   * @throws {UnauthorizedError} Si el usuario no es el propietario de la lista.
   */
  public static async handleGetListById(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const listId = parseInt(req.params.listId, 10);

    await checkOwnership(user.id, listId);

    const listDetails = await listService.getListWithPokemons(listId);

    return res.status(200).json({
      message: SUCCESS_MESSAGES.LIST_DETAILS_FETCHED,
      data: listDetails,
    });
  }

  /**
   * Crea una nueva lista personalizada para el usuario autenticado.
   * @static
   * @async
   * @param {Request} req - Objeto de solicitud de Express con el nombre de la lista en el cuerpo.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON con la lista recién creada.
   */
  public static async handleCreateList(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const { name } = req.body;

    const newList = await listService.createList(user.id, name);
    logger.success(`Nueva lista creada (ID: ${newList.id}) por User ID: ${user.id}`);

    return res.status(201).json({
      message: SUCCESS_MESSAGES.LIST_CREATED,
      data: newList,
    });
  }

  /**
   * Actualiza el nombre de una lista personalizada existente.
   * @static
   * @async
   * @param {Request} req - Objeto de solicitud de Express con el ID de la lista y el nuevo nombre.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON con la lista actualizada.
   * @throws {NotFoundError} Si la lista no existe.
   * @throws {UnauthorizedError} Si el usuario no es el propietario de la lista.
   */
  public static async handleUpdateList(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const listId = parseInt(req.params.listId, 10);
    const { name } = req.body;

    await checkOwnership(user.id, listId); // Verificar propiedad
    const updatedList = await listService.updateList(listId, name);

    return res.status(200).json({
      message: SUCCESS_MESSAGES.LIST_UPDATED,
      data: updatedList,
    });
  }

  /**
   * Elimina una lista personalizada y todas sus entradas asociadas.
   * @static
   * @async
   * @param {Request} req - Objeto de solicitud de Express con el ID de la lista.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON confirmando la eliminación.
   * @throws {NotFoundError} Si la lista no existe.
   * @throws {UnauthorizedError} Si el usuario no es el propietario de la lista.
   */
  public static async handleDeleteList(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const listId = parseInt(req.params.listId, 10);

    await checkOwnership(user.id, listId); // Verificar propiedad
    await listService.deleteList(listId);

    return res.status(200).json({
      message: SUCCESS_MESSAGES.LIST_DELETED,
    });
  }

  /**
   * Añade un Pokémon a una lista personalizada.
   * @static
   * @async
   * @param {Request} req - Objeto de solicitud de Express con el ID de la lista y el ID del Pokémon.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON confirmando la adición del Pokémon.
   * @throws {NotFoundError} Si la lista no existe.
   * @throws {UnauthorizedError} Si el usuario no es el propietario de la lista.
   * @throws {ConflictError} Si el Pokémon ya está en la lista.
   */
  public static async handleAddPokemonToList(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const listId = parseInt(req.params.listId, 10);
    const { pokemonId } = req.body;

    await checkOwnership(user.id, listId);

    const existingEntry = await listService.findPokemonInList(listId, pokemonId);
    if (existingEntry) {
      throw new ConflictError(ERROR_MESSAGES.POKEMON_ALREADY_IN_LIST);
    }

    const newEntry = await listService.addPokemonToList(listId, pokemonId);

    return res.status(201).json({
      message: SUCCESS_MESSAGES.POKEMON_ADDED_TO_LIST,
      data: newEntry,
    });
  }

  /**
   * Elimina un Pokémon de una lista personalizada.
   * @static
   * @async
   * @param {Request} req - Objeto de solicitud de Express con el ID de la lista y el ID del Pokémon.
   * @param {Response} res - Objeto de respuesta de Express.
   * @returns {Promise<Response>} Respuesta JSON confirmando la eliminación del Pokémon.
   * @throws {NotFoundError} Si la lista no existe o el Pokémon no está en la lista.
   * @throws {UnauthorizedError} Si el usuario no es el propietario de la lista.
   */
  public static async handleRemovePokemonFromList(req: Request, res: Response): Promise<Response> {
    const user = req.user as JwtPayload;
    const listId = parseInt(req.params.listId, 10);
    const pokemonId = parseInt(req.params.pokemonId, 10);

    await checkOwnership(user.id, listId); 

    const existingEntry = await listService.findPokemonInList(listId, pokemonId);
    if (!existingEntry) {
      throw new NotFoundError(ERROR_MESSAGES.POKEMON_NOT_IN_LIST);
    }

    await listService.removePokemonFromList(listId, pokemonId);

    return res.status(200).json({
      message: SUCCESS_MESSAGES.POKEMON_REMOVED_FROM_LIST,
    });
  }
}