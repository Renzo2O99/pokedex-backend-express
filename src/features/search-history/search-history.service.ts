import { db } from "../../core/db";
import { searchHistory } from "../../core/db/schema";
import { and, eq, desc, inArray, notInArray } from "drizzle-orm"; 
import { logger } from "../../core/utils/logger";

const HISTORY_LIMIT = 25;

export class SearchHistoryService {

  /**
  * Obtiene el historial de un usuario, limitado a las N entradas más recientes.
  */
  public async getHistoryByUserId(userId: number) {
    logger.info(`Buscando historial para el usuario ID: ${userId}`);
    return db.query.searchHistory.findMany({
      where: eq(searchHistory.userId, userId),
      orderBy: [desc(searchHistory.createdAt)],
      limit: HISTORY_LIMIT,
    });
  }

  /**
  * Añade un término de búsqueda. Si ya existe, actualiza su "createdAt" para mantenerlo relevante en la lista.
  */
  public async addSearchTerm(userId: number, searchTerm: string) {
    logger.info(`Guardando historial (User: ${userId}, Term: ${searchTerm})`);

    const newEntry = await db
      .insert(searchHistory)
      .values({
        userId: userId,
        searchTerm: searchTerm,
        createdAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [searchHistory.userId, searchHistory.searchTerm],
        set: {
          createdAt: new Date(),
        },
      })
      .returning();

    this._trimHistory(userId).catch(err => logger.error("Error limpiando historial", err));

    return newEntry[0];
  }

  /**
  * Elimina una entrada de historial específica por su ID.
  */
  public async removeSearchTerm(entryId: number) {
    logger.info(`Eliminando entrada de historial ID: ${entryId}`);
    const removedEntry = await db
      .delete(searchHistory)
      .where(eq(searchHistory.id, entryId))
      .returning();

    return removedEntry[0];
  }

  /**
  * Busca una entrada de historial por su ID (para verificar propiedad antes de borrar).
  */
  public async findHistoryEntryById(entryId: number) {
    return db.query.searchHistory.findFirst({
      where: eq(searchHistory.id, entryId),
    });
  }

  /**
  * Rutina de limpieza. Se asegura de que el usuario no tenga más de N entradas.
  * Elimina las entradas más antiguas que excedan el HISTORY_LIMIT.
  */
  private async _trimHistory(userId: number): Promise<void> {
    try {
      const recentEntries = await db
        .select({ id: searchHistory.id })
        .from(searchHistory)
        .where(eq(searchHistory.userId, userId))
        .orderBy(desc(searchHistory.createdAt))
        .limit(HISTORY_LIMIT);

      if (recentEntries.length < HISTORY_LIMIT) {
        return; 
      }

      const idsToKeep = recentEntries.map(e => e.id);

      const deleted = await db
        .delete(searchHistory)
        .where(
          and(
            eq(searchHistory.userId, userId),
            notInArray(searchHistory.id, idsToKeep)
          )
        ).returning({ id: searchHistory.id });

      if (deleted.length > 0) {
        logger.info(`Limpiadas ${deleted.length} entradas antiguas de historial para User ID: ${userId}`);
      }

    } catch (error) {
      logger.error(`Error no fatal durante _trimHistory para User ID: ${userId}`, error);
    }
  }
}