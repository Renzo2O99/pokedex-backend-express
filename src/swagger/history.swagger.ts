// src/swagger/history.swagger.ts

/**
 * @fileoverview Definiciones de rutas OpenAPI/Swagger para la feature de Historial de Búsqueda.
 * @module swagger/history
 */

/**
 * @description Objeto que define las rutas y operaciones para el historial de búsqueda.
 */
export const historyPaths = {
	"/search-history": {
		get: {
			summary: "Obtener historial de búsqueda.",
			description: "Recupera las 50 entradas más recientes del historial de búsqueda para el usuario autenticado.",
			tags: ["Historial"],
			security: [{ bearerAuth: [] }],
			responses: {
				"200": { description: "Lista de entradas del historial." },
				"401": { description: "No autorizado." },
			},
		},
		post: {
			summary: "Guardar un término de búsqueda (UPSERT).",
			description:
				'Añade un nuevo término al historial. Si el término ya existe, actualiza su marca de tiempo "createdAt".',
			tags: ["Historial"],
			security: [{ bearerAuth: [] }],
			requestBody: {
				required: true,
				content: {
					"application/json": {
						schema: {
							type: "object",
							properties: {
								searchTerm: { type: "string", example: "pikachu" },
							},
						},
					},
				},
			},
			responses: {
				"201": { description: "Término guardado o actualizado." },
				"400": { description: "Datos inválidos." },
				"401": { description: "No autorizado." },
			},
		},
	},
	"/search-history/{id}": {
		delete: {
			summary: "Eliminar una entrada del historial.",
			description: "Elimina una entrada específica del historial por su ID. Solo el propietario puede eliminar.",
			tags: ["Historial"],
			security: [{ bearerAuth: [] }],
			parameters: [
				{
					name: "id",
					in: "path",
					required: true,
					schema: { type: "integer" },
					description: "El ID de la entrada de historial a eliminar.",
				},
			],
			responses: {
				"200": { description: "Entrada eliminada." },
				"401": { description: "No autorizado (token inválido)." },
				"403": { description: "Prohibido (no eres el propietario)." },
				"404": { description: "No encontrado." },
			},
		},
	},
};
