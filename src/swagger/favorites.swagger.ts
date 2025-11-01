// src/swagger/favorites.swagger.ts

/**
 * @fileoverview Definiciones de rutas OpenAPI/Swagger para la feature de Favoritos.
 * @module swagger/favorites
 */

/**
 * @description Objeto que define las rutas y operaciones para los favoritos.
 */
export const favoritesPaths = {
	"/favorites": {
		get: {
			summary: "Obtener los favoritos del usuario.",
			description: "Recupera una lista de todos los Pokémon ID que el usuario autenticado ha marcado como favoritos.",
			tags: ["Favoritos"],
			security: [{ bearerAuth: [] }],
			responses: {
				"200": { description: "Lista de favoritos obtenida." },
				"401": { description: "No autorizado (token inválido o faltante)." },
			},
		},
		post: {
			summary: "Añadir un favorito.",
			description: "Añade un Pokémon a la lista de favoritos del usuario autenticado.",
			tags: ["Favoritos"],
			security: [{ bearerAuth: [] }],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								pokemonId: { type: "integer", example: 25 },
							},
						},
					},
				},
			},
			responses: {
				"201": { description: "Pokémon añadido a favoritos." },
				"400": {
					description: "Datos inválidos (ej. pokemonId falta o no es número).",
				},
				"401": { description: "No autorizado." },
				"409": { description: "Conflicto (el Pokémon ya es favorito)." },
			},
		},
	},
	"/favorites/{id}": {
		delete: {
			summary: "Eliminar un favorito por su ID de entrada.",
			description: "Elimina una entrada de favorito por su ID único.",
			tags: ["Favoritos"],
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: { type: "integer" },
					description: "El ID de la entrada de favorito a eliminar.",
				},
			],
			responses: {
				"200": { description: "Pokémon eliminado de favoritos." },
				"401": { description: "No autorizado." },
				"404": {
					description: "No encontrado (el Pokémon no estaba en favoritos).",
				},
			},
		},
	},
};
