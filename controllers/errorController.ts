import { Request, Response, NextFunction } from "express";
import AppError from "../utils/AppError";
import { MongoServerError } from "mongodb";
import { Error } from "mongoose";

const handleDatabaseCastError = (error: Error.CastError) => {
  const message = `invalid ${error?.path}:${error?.value} `;
  return new AppError(message, 400);
};

const handleDatabaseDuplicateKeyError = (err: MongoServerError) => {
  const duplicateFieldName = Object.keys(err?.errorResponse?.keyValue)?.[0];
  const duplicateFieldValue =
    err?.errorResponse?.keyValue?.[duplicateFieldName];

  const message = `A tour with ${duplicateFieldName} of ${duplicateFieldValue} already exists`;
  return new AppError(message, 400);
};

const handleDatabaseValidationError = (err: Error.ValidationError) => {
  const message = Object.values(err?.errors)
    .map((error) => error?.message)
    ?.join(", ");

  return new AppError(message, 400);
};

const generateProductionError = (error: AppError, res: Response) => {
  if (error.isOperational) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
    });
  } else {
    // We want to know about the error in our server logs
    console.error(error);
    // We don't want to leak our Functional Error to the client
    res.status(500).json({
      status: "error",
      message: "Someting Went wrong",
    });
  }
};

const generateDevelopmentError = (error: AppError, res: Response) => {
  res.status(error.statusCode).json({
    isOperational: error.isOperational,
    status: error.status,
    message: error.message,
    stack: error.stack,
    error,
  });
};

export default (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode ?? 500;
  error.status = error.status ?? "error";
  error.isOperational = error.isOperational ?? false;
  if (process.env.NODE_ENV === "development") {
    generateDevelopmentError(error, res);
  } else if (process.env.NODE_ENV === "production") {
    let err = Object.create(Object.getPrototypeOf(error));
    Object.assign(err, error);
    console.log("//////////////////////////////////");
    console.log(err?.name);
    console.log("//////////////////////////////////");
    if (err?.name === "CastError") err = handleDatabaseCastError(err);
    if (err?.code === 11000) err = handleDatabaseDuplicateKeyError(err);

    if (err?.name === "ValidationError")
      err = handleDatabaseValidationError(err);

    generateProductionError(err, res);
  }
  next();
};
