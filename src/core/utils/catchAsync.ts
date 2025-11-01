// backend-express/src/core/utils/catchAsync.ts
import type { Request, Response, NextFunction } from "express";

type AsyncController = (
	req: Request,
	res: Response,
	next: NextFunction
) => Promise<Response | undefined>;

/**
 * Envuelve una función de controlador asíncrona para capturar errores
 * y pasarlos al middleware de manejo de errores de Express.
 * @param controller La función de controlador asíncrona.
 * @returns Una función de middleware de Express.
 */
export const catchAsync = (controller: AsyncController) => {
	return (req: Request, res: Response, next: NextFunction) => {
		controller(req, res, next).catch(next);
	};
};
