// src/core/utils/get-current-timestamp.ts

/**
 * @fileoverview Utilidad para obtener la marca de tiempo actual formateada.
 * @module core/utils/get-current-timestamp
 */

/**
 * @function getCurrentTimestamp
 * @description Genera una cadena de texto con la fecha y hora actuales en formato `YYYY-MM-DD HH:MMhs`.
 * @returns {string} La marca de tiempo formateada.
 */
export const getCurrentTimestamp = (): string => {
	const now = new Date();

	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, "0");
	const day = String(now.getDate()).padStart(2, "0");
	const hours = String(now.getHours()).padStart(2, "0");
	const minutes = String(now.getMinutes()).padStart(2, "0");

	return `${year}-${month}-${day} ${hours}:${minutes}hs`;
};
