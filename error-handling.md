# Error Handling Plan - Shopping Cart API

## Overview

This document defines the error handling strategy for the Shopping Cart API. We use a centralized approach with a global Express error handler middleware to ensure consistent error responses across all endpoints.

---

## Error Handling Strategy

### Global Express Error Handler Middleware

All errors are caught and processed by a single error handler middleware. This ensures:

- Consistent error response format across all endpoints
- Centralized logging of all errors
- Proper HTTP status codes
- No sensitive information leaked to clients

### Implementation Approach

```typescript
// Error handler middleware (placed last in middleware chain)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // Log error
  logger.error(err.message, { stack: err.stack });

  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  // Send response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      statusCode: statusCode,
    },
  });
});
```

---

## Error Response Format

All error responses follow this standard JSON structure:

```json
{
  "success": false,
  "error": {
    "message": "Error description here",
    "statusCode": 400
  }
}
```

### Response Fields

| Field            | Type    | Description                      |
| ---------------- | ------- | -------------------------------- |
| success          | boolean | Always `false` for errors        |
| error.message    | string  | Human-readable error description |
| error.statusCode | number  | HTTP status code                 |

---

## HTTP Status Codes

| Code | Status                | When to Use                                               |
| ---- | --------------------- | --------------------------------------------------------- |
| 400  | Bad Request           | Invalid input, validation errors, missing required fields |
| 404  | Not Found             | Item not found in cart, resource doesn't exist            |
| 500  | Internal Server Error | Unexpected server errors, unhandled exceptions            |

---

## Custom Error Classes

### Base AppError Class

```typescript
class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Specific Error Classes

```typescript
// 400 Bad Request - Invalid input
class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}

// 404 Not Found - Resource not found
class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

// 400 Bad Request - Malformed request
class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400);
  }
}
```

---

## Error Scenarios

### 400 Bad Request - Invalid Input

**When:** Validation fails on request body or parameters.

**Examples:**

| Scenario            | Error Message                                               |
| ------------------- | ----------------------------------------------------------- |
| Missing productId   | `"productId is required"`                                   |
| Missing name        | `"name is required"`                                        |
| Invalid price       | `"price must be greater than 0"`                            |
| Invalid quantity    | `"quantity must be at least 1"`                             |
| Empty update body   | `"At least one field (quantity or price) must be provided"` |
| Empty cart checkout | `"Cannot checkout with an empty cart"`                      |

**Response:**

```json
{
  "success": false,
  "error": {
    "message": "productId is required",
    "statusCode": 400
  }
}
```

---

### 404 Not Found - Item Not Found

**When:** Trying to update or delete an item that doesn't exist in the cart.

**Examples:**

| Scenario                 | Error Message                                  |
| ------------------------ | ---------------------------------------------- |
| Update non-existent item | `"Item with productId {id} not found in cart"` |
| Delete non-existent item | `"Item with productId {id} not found in cart"` |

**Response:**

```json
{
  "success": false,
  "error": {
    "message": "Item with productId 123 not found in cart",
    "statusCode": 404
  }
}
```

---

### 500 Internal Server Error - Unexpected Error

**When:** Unhandled exceptions, database errors, or unexpected failures.

**Examples:**

| Scenario                    | Error Message             |
| --------------------------- | ------------------------- |
| Unexpected exception        | `"Internal server error"` |
| Unhandled promise rejection | `"Internal server error"` |

**Response:**

```json
{
  "success": false,
  "error": {
    "message": "Internal server error",
    "statusCode": 500
  }
}
```

**Note:** In production, never expose internal error details. Always use generic messages for 500 errors.

---

## Error Handling by Endpoint

| Endpoint                | Possible Errors                        |
| ----------------------- | -------------------------------------- |
| GET /cart               | 500 (unexpected)                       |
| POST /cart              | 400 (validation), 500                  |
| PUT /cart/:productId    | 400 (validation), 404 (not found), 500 |
| DELETE /cart/:productId | 404 (not found), 500                   |
| DELETE /cart            | 500 (unexpected)                       |
| POST /cart/checkout     | 400 (empty cart), 500                  |

---

## Validation Rules

### POST /cart - Add Item

```typescript
const addItemValidation = {
  productId: {
    required: true,
    type: "number",
    validate: (v) => Number.isInteger(v) && v > 0,
  },
  name: {
    required: true,
    type: "string",
    validate: (v) => v.trim().length > 0,
  },
  price: {
    required: true,
    type: "number",
    validate: (v) => v > 0,
  },
  quantity: {
    required: true,
    type: "number",
    validate: (v) => Number.isInteger(v) && v >= 1,
  },
};
```

### PUT /cart/:productId - Update Item

```typescript
const updateItemValidation = {
  quantity: {
    required: false,
    type: "number",
    validate: (v) => Number.isInteger(v) && v >= 1,
  },
  price: {
    required: false,
    type: "number",
    validate: (v) => v > 0,
  },
  // At least one field must be provided
};
```

---

## Try-Catch Pattern in Controllers

```typescript
// Controller method with error handling
const addItem = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const { productId, name, price, quantity } = req.body;

    if (!productId) {
      throw new ValidationError("productId is required");
    }

    // Business logic
    const cart = cartService.addItem({ productId, name, price, quantity });

    // Success response
    res.status(201).json({
      success: true,
      message: "Item added to cart",
      data: cart,
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};
```

---

## Async Error Wrapper

To avoid repetitive try-catch blocks, use an async wrapper:

```typescript
// Utility function
const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage
router.post("/cart", asyncHandler(cartController.addItem));
```

---

## Error Logging

All errors are logged before sending response:

```typescript
// In global error handler
logger.error({
  message: err.message,
  statusCode: statusCode,
  stack: err.stack,
  path: req.path,
  method: req.method,
  timestamp: new Date().toISOString(),
});
```

### Log Format

```
[ERROR] 2024-01-15T10:30:00.000Z - POST /api/cart - productId is required
```

---

## Best Practices

1. **Always use custom error classes** - Makes error handling predictable
2. **Never expose stack traces in production** - Security risk
3. **Log all errors** - Essential for debugging
4. **Use consistent response format** - Easier for frontend to handle
5. **Validate early** - Fail fast on invalid input
6. **Keep error messages user-friendly** - Clear and actionable

---

## Related Documents

| Document | Description |
|----------|-------------|
| [requirements.md](./requirements.md) | Basic project requirements |
| [prd.md](./prd.md) | Product Requirements Document |
| [architecture.md](./architecture.md) | System architecture and data flow |
| [data-model.md](./data-model.md) | Data model specifications |
| [api-spec.md](./api-spec.md) | Complete API specification |
| [logging.md](./logging.md) | Logging implementation |
| [testing.md](./testing.md) | Testing strategy |
| [swagger.md](./swagger.md) | Swagger setup guide |
| [tasks.md](./tasks.md) | Implementation checklist |
| [rules.md](./rules.md) | Development best practices |
