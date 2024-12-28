import { Request, Response, NextFunction } from "express";

type handlerFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export const catchAsync = (asyncFunction: handlerFunction) => {
  return function (req: Request, res: Response, next: NextFunction) {
    asyncFunction(req, res, next).catch(next);
  };
};
