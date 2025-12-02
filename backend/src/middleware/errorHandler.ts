import { ErrorRequestHandler, Response } from "express";
import z from "zod";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "../contants/http";
import AppError from "../utils/AppError";
import { clearAuthCookies } from "../utils/cookies";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => {
    return {
      path: err.path.join("."),
      message: err.message,
    };
  });
  return res.status(BAD_REQUEST).json({
    message: error.message,
    errors,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  return res.status(error.statusCode).json({
    message: error.message,
    // errorCode: error.errorCode,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`PATH: ${req.path}`, error);

  if (req.path == "/auth/refresh") {
    clearAuthCookies(res);
  }
  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }
  if (error instanceof AppError) {
    return handleAppError(res, error);
  }
  return res.status(INTERNAL_SERVER_ERROR).send("Internal Server Error!!");
};

export default errorHandler;
