import app from "./app";
import logger from "./config/logger";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  logger.info(`API: http://localhost:${PORT}/api/cart`);
  logger.info(`Swagger docs: http://localhost:${PORT}/api-docs`);
  logger.info(`Health check: http://localhost:${PORT}/health`);
});

