// backend-express/src/core/db/schema.ts
import { pgTable, serial, varchar, text, integer, timestamp, primaryKey } from "drizzle-orm/pg-core";

//? --- Feature: Autenticación ---
export const users = pgTable("users", {
  "id": serial("id").primaryKey(),
  "username": varchar("username", { "length": 256 }).unique().notNull(),
  "email": varchar("email", { "length": 256 }).unique().notNull(),
  "passwordHash": text("password_hash").notNull(),
  "createdAt": timestamp("created_at").defaultNow().notNull(),
});

//? --- Feature: Favoritos ---
export const favorites = pgTable("favorites", {
  "userId": integer("user_id").notNull().references(() => users.id, { "onDelete": "cascade" }),
  "pokemonId": integer("pokemon_id").notNull(),
  "createdAt": timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  // Un usuario solo puede tener un pokémon favorito una vez
  primaryKey({ "columns": [table.userId, table.pokemonId] }),
]);

//? --- Feature: Historial de Búsquedas ---
export const searchHistory = pgTable("search_history", {
  "id": serial("id").primaryKey(),
  "userId": integer("user_id").notNull().references(() => users.id, { "onDelete": "cascade" }),
  "searchTerm": varchar("search_term", { "length": 256 }).notNull(),
  "createdAt": timestamp("created_at").defaultNow().notNull(),
});

//? --- Feature: Comentarios y Valoraciones ---
export const comments = pgTable("comments", {
  "id": serial("id").primaryKey(),
  "userId": integer("user_id").notNull().references(() => users.id, { "onDelete": "cascade" }),
  "pokemonId": integer("pokemon_id").notNull(),
  "content": text("content").notNull(),
  "createdAt": timestamp("created_at").defaultNow().notNull(),
});

export const ratings = pgTable("ratings", {
  "userId": integer("user_id").notNull().references(() => users.id, { "onDelete": "cascade" }),
  "pokemonId": integer("pokemon_id").notNull(),
  "value": integer("value").notNull(), // (ej. 1 a 5)
  "createdAt": timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  // Un usuario solo puede calificar un pokémon una vez
  primaryKey({ "columns": [table.userId, table.pokemonId] }),
]);

//? --- Feature: Listas Personalizadas ---
export const customLists = pgTable("custom_lists", {
  "id": serial("id").primaryKey(),
  "userId": integer("user_id").notNull().references(() => users.id, { "onDelete": "cascade" }),
  "name": varchar("name", { "length": 256 }).notNull(),
  "createdAt": timestamp("created_at").defaultNow().notNull(),
});

// Tabla pivote para la relación N-a-N (Muchos-a-Muchos)
// entre Listas y Pokémon
export const customListPokemons = pgTable("custom_list_pokemons", {
  "listId": integer("list_id").notNull().references(() => customLists.id, { "onDelete": "cascade" }),
  "pokemonId": integer("pokemon_id").notNull(),
}, (table) => [
  // Una lista solo puede tener un pokémon una vez
  primaryKey({ "columns": [table.listId, table.pokemonId] }),
]);