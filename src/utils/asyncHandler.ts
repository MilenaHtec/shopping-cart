import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps async route handlers to catch errors and pass them to error middleware
 * Eliminates the need for try-catch blocks in every controller
 */
type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

const asyncHandler = (fn: AsyncRequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;

