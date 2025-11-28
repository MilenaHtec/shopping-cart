import express, { Application, Request, Response } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { requestLogger, errorHandler } from "./middleware";
import { cartRoutes } from "./routes";

// Create Express app
const app: Application = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (_req: Request, res: Response) => {
  res.json(swaggerSpec);
});

// API Routes
app.use("/api/cart", cartRoutes);

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "Shopping Cart API",
    version: "1.0.0",
    documentation: "/api-docs",
  });
});

// 404 handler for unknown routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: "Route not found",
      statusCode: 404,
    },
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;

