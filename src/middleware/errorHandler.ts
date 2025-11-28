import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors";
import logger from "../config/logger";

/**
 * Global error handler middleware
 * Catches all errors and returns standardized JSON response
 */
const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Determine if error is operational (expected) or programming error
  const isOperational = err instanceof AppError;
  const statusCode = isOperational ? (err as AppError).statusCode : 500;
  const message = isOperational ? err.message : "Internal server error";

  // Log error with appropriate level
  if (statusCode >= 500) {
    logger.error(err.message, {
      statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else {
    logger.warn(err.message, {
      statusCode,
      path: req.path,
      method: req.method,
    });
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode,
    },
  });
};

export default errorHandler;

