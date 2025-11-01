// src/features/custom-lists/custom-lists.routes.ts

/**
 * @fileoverview Rutas para la gestión de listas personalizadas de Pokémon.
 * Proporciona endpoints para operaciones CRUD en listas y para añadir/eliminar Pokémon de ellas.
 * @module features/custom-lists/custom-lists.routes
 */

import { Router } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import { CustomListsController } from "./custom-lists.controller";
import { authMiddleware } from "../../core/middlewares/auth.middleware";
import {
  validateCreateList,
  validateUpdateList,
  validateListIdParam,
  validateAddPokemon,
  validateRemovePokemon
} from "./custom-lists.validation";

/**
 * @constant {Router} router - Instancia del enrutador de Express para las rutas de listas personalizadas.
 */
const router = Router();

/**
 * @description Aplica el middleware de autenticación a todas las rutas de listas personalizadas.
 */
router.use(authMiddleware);

router.route("/")
  /**
   * @route GET /api/lists
   * @description Obtiene todas las listas personalizadas del usuario autenticado.
   * @access Private
   */
  .get(catchAsync(CustomListsController.handleGetLists))
  /**
   * @route POST /api/lists
   * @description Crea una nueva lista personalizada para el usuario autenticado.
   * @access Private
   * @body {string} name - El nombre de la nueva lista.
   */
  .post(validateCreateList, catchAsync(CustomListsController.handleCreateList));

router.route("/:listId")
  /**
   * @route GET /api/lists/:listId
   * @description Obtiene los detalles de una lista personalizada específica, incluyendo sus Pokémon.
   * @access Private
   * @param {number} listId - El ID de la lista a recuperar.
   */
  .get(validateListIdParam, catchAsync(CustomListsController.handleGetListById))
  /**
   * @route PUT /api/lists/:listId
   * @description Actualiza el nombre de una lista personalizada específica.
   * @access Private
   * @param {number} listId - El ID de la lista a actualizar.
   * @body {string} name - El nuevo nombre para la lista.
   */
  .put(validateUpdateList, catchAsync(CustomListsController.handleUpdateList))
  /**
   * @route DELETE /api/lists/:listId
   * @description Elimina una lista personalizada específica.
   * @access Private
   * @param {number} listId - El ID de la lista a eliminar.
   */
  .delete(validateListIdParam, catchAsync(CustomListsController.handleDeleteList));

/**
 * @route POST /api/lists/:listId/pokemon
 * @description Añade un Pokémon a una lista personalizada específica.
 * @access Private
 * @param {number} listId - El ID de la lista a la que añadir el Pokémon.
 * @body {number} pokemonId - El ID del Pokémon a añadir.
 */
router.post(
  "/:listId/pokemon",
  validateAddPokemon,
  catchAsync(CustomListsController.handleAddPokemonToList)
);

/**
 * @route DELETE /api/lists/:listId/pokemon/:pokemonId
 * @description Elimina un Pokémon de una lista personalizada específica.
 * @access Private
 * @param {number} listId - El ID de la lista de la que eliminar el Pokémon.
 * @param {number} pokemonId - El ID del Pokémon a eliminar.
 */
router.delete(
  "/:listId/pokemon/:pokemonId",
  validateRemovePokemon,
  catchAsync(CustomListsController.handleRemovePokemonFromList)
);

/**
 * @exports customListsRoutes
 * @description Exporta el enrutador configurado para ser usado en `index.ts`.
 */
export const customListsRoutes = router;