// src/features/custom-lists/custom-lists.routes.ts

/**
 * @fileoverview Rutas para la gestión de listas personalizadas de Pokémon.
 * Proporciona endpoints para operaciones CRUD en listas y para añadir/eliminar Pokémon de ellas.
 * @module features/custom-lists/custom-lists.routes
 */

import { Router } from "express";
import { catchAsync } from "../../core/utils/catchAsync";
import {
	getLists,
	getListById,
	createList,
	updateList,
	deleteList,
	addPokemonToList,
	removePokemonFromList,
} from "./custom-lists.controller";
import { authMiddleware } from "../../core/middlewares/auth.middleware";
import {
	validateCreateList,
	validateUpdateList,
	validateListIdParam,
	validateAddPokemon,
	validateRemovePokemon,
} from "./custom-lists.validation";

/**
 * @constant {Router} router - Instancia del enrutador de Express para las rutas de listas personalizadas.
 */
const router = Router();

/**
 * @description Aplica el middleware de autenticación a todas las rutas de listas personalizadas.
 */
router.use(authMiddleware);

router
	.route("/")
	/**
	 * @route GET /api/lists
	 * @description Obtiene todas las listas personalizadas del usuario autenticado.
	 * @access Private
	 * @throws {401} Unauthorized - Si el token no es válido.
	 */
	.get(catchAsync(getLists))
	/**
	 * @route POST /api/lists
	 * @description Crea una nueva lista personalizada para el usuario autenticado.
	 * @access Private
	 * @body {string} name - El nombre de la nueva lista.
	 * @throws {400} Bad Request - Si el "name" no es un string o está vacío.
	 * @throws {401} Unauthorized - Si el token no es válido.
	 */
	.post(validateCreateList, catchAsync(createList));

router
	.route("/:listId")
	/**
	 * @route GET /api/lists/:listId
	 * @description Obtiene los detalles de una lista personalizada específica, incluyendo sus Pokémon.
	 * @access Private
	 * @param {number} listId - El ID de la lista a recuperar.
	 * @throws {400} Bad Request - Si el "listId" no es un número.
	 * @throws {401} Unauthorized - Si el token no es válido o el usuario no es el propietario de la lista.
	 * @throws {404} Not Found - Si la lista no se encuentra.
	 */
	.get(validateListIdParam, catchAsync(getListById))
	/**
	 * @route PUT /api/lists/:listId
	 * @description Actualiza el nombre de una lista personalizada específica.
	 * @access Private
	 * @param {number} listId - El ID de la lista a actualizar.
	 * @body {string} name - El nuevo nombre para la lista.
	 * @throws {400} Bad Request - Si el "listId" no es un número o el "name" no es un string.
	 * @throws {401} Unauthorized - Si el token no es válido o el usuario no es el propietario de la lista.
	 * @throws {404} Not Found - Si la lista no se encuentra.
	 */
	.put(validateUpdateList, catchAsync(updateList))
	/**
	 * @route DELETE /api/lists/:listId
	 * @description Elimina una lista personalizada específica.
	 * @access Private
	 * @param {number} listId - El ID de la lista a eliminar.
	 * @throws {400} Bad Request - Si el "listId" no es un número.
	 * @throws {401} Unauthorized - Si el token no es válido o el usuario no es el propietario de la lista.
	 * @throws {404} Not Found - Si la lista no se encuentra.
	 */
	.delete(validateListIdParam, catchAsync(deleteList));

/**
 * @route POST /api/lists/:listId/pokemon
 * @description Añade un Pokémon a una lista personalizada específica.
 * @access Private
 * @param {number} listId - El ID de la lista a la que añadir el Pokémon.
 * @body {number} pokemonId - El ID del Pokémon a añadir.
 * @throws {400} Bad Request - Si el "listId" o "pokemonId" no son números.
 * @throws {401} Unauthorized - Si el token no es válido o el usuario no es el propietario de la lista.
 * @throws {404} Not Found - Si la lista no se encuentra.
 * @throws {409} Conflict - Si el Pokémon ya existe en la lista.
 */
router.post("/:listId/pokemon", validateAddPokemon, catchAsync(addPokemonToList));

/**
 * @route DELETE /api/lists/:listId/pokemon/:pokemonId
 * @description Elimina un Pokémon de una lista personalizada específica.
 * @access Private
 * @param {number} listId - El ID de la lista de la que eliminar el Pokémon.
 * @param {number} pokemonId - El ID del Pokémon a eliminar.
 * @throws {400} Bad Request - Si el "listId" o "pokemonId" no son números.
 * @throws {401} Unauthorized - Si el token no es válido o el usuario no es el propietario de la lista.
 * @throws {404} Not Found - Si la lista o el Pokémon en la lista no se encuentran.
 */
router.delete("/:listId/pokemon/:pokemonId", validateRemovePokemon, catchAsync(removePokemonFromList));

/**
 * @exports customListsRoutes
 * @description Exporta el enrutador configurado para ser usado en `index.ts`.
 */
export const customListsRoutes = router;
