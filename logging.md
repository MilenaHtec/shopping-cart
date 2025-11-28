# Logging Plan - Shopping Cart API

## Overview

This document defines the logging strategy for the Shopping Cart API. Logging is essential for debugging, monitoring, and auditing all major activities in the application.

**Requirement:** Log all major activities.

---

## Logging Library

We will use **Winston** as the primary logging library for Node.js.

```bash
npm install winston
```

---

## Log Levels

| Level | Priority | Usage |
|-------|----------|-------|
| error | 0 | Error conditions (exceptions, failures) |
| warn | 1 | Warning conditions (deprecated features, retry attempts) |
| info | 2 | Normal operations (requests, responses, business events) |
| debug | 3 | Detailed debugging information (development only) |

---

## Logger Configuration

```typescript
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
```

---

## What to Log

### Major Activities to Log

| Activity | Log Level | Description |
|----------|-----------|-------------|
| Server start | info | Application startup |
| Incoming requests | info | All HTTP requests |
| Outgoing responses | info | All HTTP responses |
| Item added to cart | info | POST /cart success |
| Item updated | info | PUT /cart/:productId success |
| Item removed | info | DELETE /cart/:productId success |
| Cart cleared | info | DELETE /cart success |
| Checkout completed | info | POST /cart/checkout success |
| Validation errors | warn | Invalid input data |
| Item not found | warn | 404 errors |
| Server errors | error | 500 errors, exceptions |

---

## Log Format

### Standard Log Entry

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Item added to cart",
  "meta": {
    "productId": 1,
    "name": "Milk",
    "quantity": 2
  }
}
```

### Request Log Entry

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "info",
  "message": "Incoming request",
  "meta": {
    "method": "POST",
    "path": "/api/cart",
    "ip": "127.0.0.1"
  }
}
```

### Error Log Entry

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "level": "error",
  "message": "Item with productId 999 not found in cart",
  "meta": {
    "statusCode": 404,
    "path": "/api/cart/999",
    "method": "DELETE"
  }
}
```

---

## Request Logging Middleware

Log all incoming HTTP requests:

```typescript
const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log incoming request
  logger.info("Incoming request", {
    method: req.method,
    path: req.path,
    ip: req.ip,
    body: req.body,
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
```

---

## Service Layer Logging

### Cart Service Examples

```typescript
// Add item
addItem(item: CartItem): Cart {
  logger.info("Adding item to cart", { productId: item.productId, name: item.name });
  // ... business logic
  logger.info("Item added to cart", { productId: item.productId, quantity: item.quantity });
  return cart;
}

// Update item
updateItem(productId: number, updates: Partial<CartItem>): Cart {
  logger.info("Updating cart item", { productId, updates });
  // ... business logic
  logger.info("Cart item updated", { productId });
  return cart;
}

// Remove item
removeItem(productId: number): Cart {
  logger.info("Removing item from cart", { productId });
  // ... business logic
  logger.info("Item removed from cart", { productId });
  return cart;
}

// Clear cart
clearCart(): Cart {
  logger.info("Clearing cart");
  // ... business logic
  logger.info("Cart cleared");
  return cart;
}

// Checkout
checkout(): CheckoutResult {
  logger.info("Processing checkout", { itemCount: cart.items.length });
  // ... business logic
  logger.info("Checkout completed", { total, orderId });
  return result;
}
```

---

## Error Logging

Integrated with global error handler:

```typescript
// In error handler middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  if (statusCode >= 500) {
    logger.error(err.message, {
      statusCode,
      stack: err.stack,
      path: req.path,
      method: req.method,
    });
  } else if (statusCode >= 400) {
    logger.warn(err.message, {
      statusCode,
      path: req.path,
      method: req.method,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: { message: err.message, statusCode },
  });
});
```

---

## Log Output Examples

### Console Output (Development)

```
info: Server started on port 3000
info: Incoming request {"method":"POST","path":"/api/cart"}
info: Adding item to cart {"productId":1,"name":"Milk"}
info: Item added to cart {"productId":1,"quantity":2}
info: Response sent {"statusCode":201,"duration":"45ms"}
warn: Item with productId 999 not found in cart {"statusCode":404}
error: Internal server error {"statusCode":500,"stack":"..."}
```

### File Output (logs/combined.log)

```
{"timestamp":"2024-01-15T10:30:00.000Z","level":"info","message":"Server started on port 3000"}
{"timestamp":"2024-01-15T10:30:01.000Z","level":"info","message":"Incoming request","method":"POST","path":"/api/cart"}
{"timestamp":"2024-01-15T10:30:01.050Z","level":"info","message":"Item added to cart","productId":1,"quantity":2}
{"timestamp":"2024-01-15T10:30:01.100Z","level":"info","message":"Response sent","statusCode":201,"duration":"45ms"}
```

---

## Environment Configuration

```typescript
// Different log levels per environment
const LOG_LEVELS = {
  development: "debug",
  test: "warn",
  production: "info",
};

const logger = winston.createLogger({
  level: LOG_LEVELS[process.env.NODE_ENV] || "info",
  // ...
});
```

---

## Best Practices

1. **Log at appropriate levels** - Use info for normal operations, warn for recoverable issues, error for failures
2. **Include context** - Always include relevant data (productId, method, path)
3. **Don't log sensitive data** - Never log passwords, tokens, or personal information
4. **Use structured logging** - JSON format for easy parsing and searching
5. **Log request/response cycle** - Track the full lifecycle of each request
6. **Include timestamps** - Essential for debugging and auditing

---

## Related Documents

| Document | Description |
|----------|-------------|
| [requirements.md](./requirements.md) | Basic project requirements |
| [prd.md](./prd.md) | Product Requirements Document |
| [architecture.md](./architecture.md) | System architecture and data flow |
| [data-model.md](./data-model.md) | Data model specifications |
| [api-spec.md](./api-spec.md) | Complete API specification |
| [error-handling.md](./error-handling.md) | Error handling strategy |
| [testing.md](./testing.md) | Testing strategy |
| [swagger.md](./swagger.md) | Swagger setup guide |
| [tasks.md](./tasks.md) | Implementation checklist |
| [rules.md](./rules.md) | Development best practices |
