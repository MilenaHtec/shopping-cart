import { Request, Response, NextFunction } from "express";
import logger from "../config/logger";

/**
 * Middleware to log all incoming requests and outgoing responses
 */
const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();

  // Log incoming request
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    body: req.body,
    query: req.query,
    ip: req.ip,
  });

  // Log response when finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Response sent", {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};

export default requestLogger;

