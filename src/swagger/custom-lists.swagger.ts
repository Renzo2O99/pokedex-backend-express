// src/swagger/custom-lists.swagger.ts

/**
 * @fileoverview Definiciones de rutas OpenAPI/Swagger para la feature de Listas Personalizadas.
 * @module swagger/custom-lists
 */

/**
 * @description Objeto que define las rutas y operaciones para las listas personalizadas.
 */
export const customListsPaths = {
	"/lists": {
		get: {
			summary: "Obtener todas las listas del usuario.",
			tags: ["Listas Personalizadas"],
			security: [{ bearerAuth: [] }],
			responses: { "200": { description: "Listas obtenidas." } },
		},
		post: {
			summary: "Crear una nueva lista.",
			tags: ["Listas Personalizadas"],
			security: [{ bearerAuth: [] }],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								name: { type: "string", example: "Mi equipo Fuego" },
							},
						},
					},
				},
			},
			responses: { "201": { description: "Lista creada." } },
		},
	},
	"/lists/{listId}": {
		get: {
			summary: "Obtener detalles de una lista (incluye Pokémon).",
			tags: ["Listas Personalizadas"],
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "listId",
					in: "path",
					required: true,
					schema: { type: "integer" },
				},
			],
			responses: {
				"200": { description: "Detalles de la lista." },
				"404": { description: "Lista no encontrada." },
				"401": { description: "No autorizado (no eres propietario)." },
			},
		},
		put: {
			summary: "Actualizar el nombre de una lista.",
			tags: ["Listas Personalizadas"],
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "listId",
					in: "path",
					required: true,
					schema: { type: "integer" },
				},
			],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								name: { type: "string", example: "Equipo Fuego V2" },
							},
						},
					},
				},
			},
			responses: {
				"200": { description: "Lista actualizada." },
				"404": { description: "Lista no encontrada." },
				"401": { description: "No autorizado." },
			},
		},
		delete: {
			summary: "Eliminar una lista.",
			tags: ["Listas Personalizadas"],
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "listId",
					in: "path",
					required: true,
					schema: { type: "integer" },
				},
			],
			responses: {
				"200": { description: "Lista eliminada." },
				"404": { description: "Lista no encontrada." },
				"401": { description: "No autorizado." },
			},
		},
	},
	"/lists/{listId}/pokemon": {
		post: {
			summary: "Añadir un Pokémon a una lista.",
			tags: ["Listas Personalizadas"],
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "listId",
					in: "path",
					required: true,
					schema: { type: "integer" },
				},
			],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: { pokemonId: { type: "integer", example: 6 } },
						},
					},
				},
			},
			responses: {
				"201": { description: "Pokémon añadido." },
				"409": { description: "Conflicto (ya estaba en la lista)." },
				"401": { description: "No autorizado." },
			},
		},
	},
	"/lists/{listId}/pokemon/{pokemonId}": {
		delete: {
			summary: "Eliminar un Pokémon de una lista.",
			description: "Elimina un Pokémon específico de una lista personalizada. Se requiere autenticación y que el usuario sea el propietario de la lista.",
			tags: ["Listas Personalizadas"],
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "listId",
					in: "path",
					description: "ID de la lista personalizada",
					required: true,
					schema: { 
						type: "integer",
						example: 1,
						minimum: 1
					},
				},
				{
					name: "pokemonId",
					in: "path",
					description: "ID del Pokémon a eliminar de la lista",
					required: true,
					schema: { 
						type: "integer",
						example: 25,
						minimum: 1
					},
				},
			],
			responses: {
				"200": { 
					description: "Pokémon eliminado exitosamente de la lista.",
					content: {
						"application/json": {
							schema: {
								type: "object",
								properties: {
									message: { 
										type: "string",
										example: "Pokémon eliminado de la lista exitosamente"
									}
								}
							}
						}
					}
				},
				"400": {
					description: "Solicitud inválida - El ID de lista o Pokémon no es válido.",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ErrorResponse"
							}
						}
					}
				},
				"401": { 
					description: "No autorizado - Token inválido o no proporcionado.",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ErrorResponse"
							}
						}
					}
				},
				"403": {
					description: "Prohibido - El usuario no es propietario de la lista.",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ErrorResponse"
							}
						}
					}
				},
				"404": {
					description: "No encontrado - La lista no existe o el Pokémon no está en la lista.",
					content: {
						"application/json": {
							schema: {
								$ref: "#/components/schemas/ErrorResponse"
							}
						}
					}
				}
			},
		},
	},
};
