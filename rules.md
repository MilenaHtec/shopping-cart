# Development Rules & Best Practices

## Overview

This document defines the coding standards, conventions, and best practices for the Shopping Cart API project. Following these rules ensures consistent, maintainable, and high-quality code.

---

## 1. Project Structure

### 1.1 Folder Organization

```
src/
├── config/        # Configuration files (logger, swagger)
├── controllers/   # Request handlers (thin, delegate to services)
├── services/      # Business logic (fat, contain core logic)
├── middleware/    # Express middleware
├── models/        # TypeScript interfaces and types
├── routes/        # Route definitions
├── errors/        # Custom error classes
└── utils/         # Utility functions
```

### 1.2 File Naming Conventions

| Type        | Pattern                          | Example                   |
| ----------- | -------------------------------- | ------------------------- |
| Controllers | `*.controller.ts`                | `cart.controller.ts`      |
| Services    | `*.service.ts`                   | `cart.service.ts`         |
| Routes      | `*.routes.ts`                    | `cart.routes.ts`          |
| Models      | `*.model.ts`                     | `cart.model.ts`           |
| Middleware  | `*.middleware.ts` or descriptive | `errorHandler.ts`         |
| Tests       | `*.test.ts`                      | `cart.service.test.ts`    |
| Config      | descriptive name                 | `logger.ts`, `swagger.ts` |

### 1.3 One Responsibility Per File

- Each file should have a single, clear purpose
- Don't mix controllers with services
- Don't mix models with business logic

---

## 2. TypeScript Rules

### 2.1 Always Use Types

```typescript
// ✅ Good - explicit types
function addItem(item: CartItem): Cart {
  // ...
}

// ❌ Bad - implicit any
function addItem(item) {
  // ...
}
```

### 2.2 Use Interfaces for Objects

```typescript
// ✅ Good - interface for object shape
interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

// ❌ Bad - inline types everywhere
function addItem(item: {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}) {
  // ...
}
```

### 2.3 Avoid `any` Type

```typescript
// ✅ Good - specific type
const items: CartItem[] = [];

// ❌ Bad - any type
const items: any[] = [];
```

### 2.4 Use Enums for Fixed Values

```typescript
// ✅ Good - enum for fixed values
enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

// ❌ Bad - magic numbers
res.status(400).json({ error: "Bad request" });
```

---

## 3. Code Style

### 3.1 Naming Conventions

| Type       | Convention                 | Example                         |
| ---------- | -------------------------- | ------------------------------- |
| Variables  | camelCase                  | `cartItems`, `totalPrice`       |
| Functions  | camelCase                  | `addItem()`, `calculateTotal()` |
| Classes    | PascalCase                 | `CartService`, `AppError`       |
| Interfaces | PascalCase                 | `CartItem`, `ApiResponse`       |
| Constants  | UPPER_SNAKE_CASE           | `MAX_QUANTITY`, `DEFAULT_PORT`  |
| Files      | kebab-case or dot notation | `cart.service.ts`               |

### 3.2 Function Length

- Functions should be **short and focused**
- If a function is longer than **20-30 lines**, consider breaking it up
- Each function should do **one thing**

```typescript
// ✅ Good - small, focused functions
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

// ❌ Bad - one giant function doing everything
function processCart(items: CartItem[]) {
  // 100 lines of code doing multiple things
}
```

### 3.3 Early Returns

```typescript
// ✅ Good - early return
function getItem(productId: number): CartItem | undefined {
  if (!productId) {
    return undefined;
  }

  const item = this.items.find((i) => i.productId === productId);
  if (!item) {
    return undefined;
  }

  return item;
}

// ❌ Bad - deep nesting
function getItem(productId: number): CartItem | undefined {
  if (productId) {
    const item = this.items.find((i) => i.productId === productId);
    if (item) {
      return item;
    } else {
      return undefined;
    }
  } else {
    return undefined;
  }
}
```

### 3.4 Avoid Magic Numbers/Strings

```typescript
// ✅ Good - named constants
const MIN_QUANTITY = 1;
const MIN_PRICE = 0;

if (quantity < MIN_QUANTITY) {
  throw new ValidationError("quantity must be at least 1");
}

// ❌ Bad - magic numbers
if (quantity < 1) {
  throw new ValidationError("quantity must be at least 1");
}
```

---

## 4. Controller Rules

### 4.1 Keep Controllers Thin

Controllers should:

- Extract data from request (params, body, query)
- Call service methods
- Return response

Controllers should NOT:

- Contain business logic
- Access database directly
- Perform complex calculations

```typescript
// ✅ Good - thin controller
const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId, name, price, quantity } = req.body;
  const cart = cartService.addItem({ productId, name, price, quantity });

  res.status(201).json({
    success: true,
    message: "Item added to cart",
    data: cart,
  });
});

// ❌ Bad - fat controller with business logic
const addItem = asyncHandler(async (req: Request, res: Response) => {
  const { productId, name, price, quantity } = req.body;

  // Business logic should be in service!
  const existingItem = cart.items.find((i) => i.productId === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId, name, price, quantity });
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  // ...
});
```

### 4.2 Always Use asyncHandler

```typescript
// ✅ Good - wrapped with asyncHandler
const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = cartService.getCart();
  res.json({ success: true, data: cart });
});

// ❌ Bad - manual try-catch everywhere
const getCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cart = cartService.getCart();
    res.json({ success: true, data: cart });
  } catch (error) {
    next(error);
  }
};
```

---

## 5. Service Rules

### 5.1 Keep Business Logic in Services

All business logic belongs in services:

- Validation
- Calculations
- Data manipulation
- Error throwing

```typescript
// ✅ Good - validation in service
addItem(item: CartItem): CartResponse {
  if (!item.productId) {
    throw new ValidationError("productId is required");
  }
  if (item.price <= 0) {
    throw new ValidationError("price must be greater than 0");
  }
  // ... business logic
}
```

### 5.2 Services Should Be Stateless (When Possible)

- Avoid storing state in service class properties when not necessary
- Pass data through method parameters

### 5.3 Return Consistent Types

```typescript
// ✅ Good - consistent return type
getCart(): CartResponse {
  return {
    items: this.cart.items,
    total: this.calculateTotal(),
    itemCount: this.calculateItemCount(),
  };
}

// ❌ Bad - inconsistent return
getCart() {
  if (this.cart.items.length === 0) {
    return null; // Sometimes null
  }
  return this.cart; // Sometimes object
}
```

---

## 6. Error Handling Rules

### 6.1 Use Custom Error Classes

```typescript
// ✅ Good - custom error with status code
throw new NotFoundError(`Item with productId ${productId} not found`);

// ❌ Bad - generic error
throw new Error("Not found");
```

### 6.2 Throw Errors, Don't Return Them

```typescript
// ✅ Good - throw error
if (!item) {
  throw new NotFoundError("Item not found");
}
return item;

// ❌ Bad - return error object
if (!item) {
  return { error: "Item not found" };
}
return { data: item };
```

### 6.3 Let Errors Bubble Up

```typescript
// ✅ Good - let error propagate to global handler
const addItem = asyncHandler(async (req, res) => {
  const cart = cartService.addItem(req.body); // May throw
  res.status(201).json({ success: true, data: cart });
});

// ❌ Bad - catching and re-throwing unnecessarily
const addItem = asyncHandler(async (req, res) => {
  try {
    const cart = cartService.addItem(req.body);
    res.status(201).json({ success: true, data: cart });
  } catch (error) {
    throw error; // Pointless catch
  }
});
```

### 6.4 Never Expose Internal Errors

```typescript
// ✅ Good - generic message for 500 errors
if (!err.isOperational) {
  res.status(500).json({
    success: false,
    error: { message: "Internal server error", statusCode: 500 },
  });
}

// ❌ Bad - exposing stack trace
res.status(500).json({
  error: err.message,
  stack: err.stack, // Security risk!
});
```

---

## 7. Logging Rules

### 7.1 Log at Appropriate Levels

| Level   | When to Use                                  |
| ------- | -------------------------------------------- |
| `error` | Exceptions, failures, 500 errors             |
| `warn`  | Recoverable issues, 4xx errors               |
| `info`  | Normal operations, requests, business events |
| `debug` | Detailed debugging (development only)        |

### 7.2 Include Context in Logs

```typescript
// ✅ Good - includes context
logger.info("Item added to cart", {
  productId: item.productId,
  quantity: item.quantity,
});

// ❌ Bad - no context
logger.info("Item added");
```

### 7.3 Never Log Sensitive Data

```typescript
// ✅ Good - no sensitive data
logger.info("User logged in", { userId: user.id });

// ❌ Bad - logging sensitive data
logger.info("User logged in", { email: user.email, password: user.password });
```

---

## 8. Testing Rules

### 8.1 One Assertion Per Test (When Possible)

```typescript
// ✅ Good - focused tests
test("should add item to empty cart", () => {
  const result = cartService.addItem(item);
  expect(result.items).toHaveLength(1);
});

test("should calculate correct total after adding item", () => {
  const result = cartService.addItem(item);
  expect(result.total).toBe(5.0);
});
```

### 8.2 Use Descriptive Test Names

```typescript
// ✅ Good - describes behavior
test("should increment quantity when adding existing item", () => {});
test("should throw NotFoundError when updating non-existent item", () => {});

// ❌ Bad - vague names
test("test add", () => {});
test("error case", () => {});
```

### 8.3 Arrange-Act-Assert Pattern

```typescript
test("should add item to cart", () => {
  // Arrange
  const item = { productId: 1, name: "Milk", price: 2.5, quantity: 2 };

  // Act
  const result = cartService.addItem(item);

  // Assert
  expect(result.items).toHaveLength(1);
  expect(result.items[0]).toEqual(item);
});
```

### 8.4 Reset State Before Each Test

```typescript
describe("CartService", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService(); // Fresh instance
  });

  // Tests...
});
```

---

## 9. API Response Rules

### 9.1 Consistent Response Format

```typescript
// ✅ Good - consistent format
// Success
{ success: true, message: "...", data: {...} }

// Error
{ success: false, error: { message: "...", statusCode: 400 } }
```

### 9.2 Use Appropriate Status Codes

| Code | When                          |
| ---- | ----------------------------- |
| 200  | Successful GET, PUT, DELETE   |
| 201  | Successful POST (created)     |
| 400  | Validation error, bad request |
| 404  | Resource not found            |
| 500  | Server error                  |

### 9.3 Always Return JSON

```typescript
// ✅ Good - JSON response
res.status(200).json({ success: true, data: cart });

// ❌ Bad - plain text
res.status(200).send("Success");
```

---

## 10. Git Rules

### 10.1 Commit Messages

Use clear, descriptive commit messages:

```
✅ Good:
- "Add cart service with CRUD operations"
- "Fix validation error for negative prices"
- "Add unit tests for checkout functionality"

❌ Bad:
- "fix"
- "update"
- "changes"
```

### 10.2 Commit Often

- Commit after completing each logical unit of work
- Don't wait until everything is done
- Each commit should be a working state

### 10.3 Don't Commit

- `node_modules/`
- `dist/`
- `logs/`
- `.env` files
- `coverage/`

---

## 11. Security Rules

### 11.1 Validate All Input

```typescript
// ✅ Always validate
if (!productId || typeof productId !== "number") {
  throw new ValidationError("productId must be a number");
}
```

### 11.2 Sanitize Error Messages

```typescript
// ✅ Good - safe error message
throw new NotFoundError("Item not found");

// ❌ Bad - exposes internal details
throw new Error(`SELECT * FROM items WHERE id=${productId} returned null`);
```

### 11.3 Use Environment Variables for Config

```typescript
// ✅ Good - from environment
const PORT = process.env.PORT || 3000;

// ❌ Bad - hardcoded
const PORT = 3000;
const DB_PASSWORD = "secret123"; // Never do this!
```

---

## 12. Performance Rules

### 12.1 Avoid Unnecessary Loops

```typescript
// ✅ Good - single loop
const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

// ❌ Bad - multiple loops
const prices = items.map((item) => item.price * item.quantity);
const total = prices.reduce((sum, price) => sum + price, 0);
```

### 12.2 Use Early Returns

```typescript
// ✅ Good - exit early
if (items.length === 0) {
  return { items: [], total: 0, itemCount: 0 };
}
// Process items...
```

---

## Quick Reference Card

```
┌─────────────────────────────────────────────────────────────┐
│                    QUICK RULES                               │
├─────────────────────────────────────────────────────────────┤
│  ✅ DO                          │  ❌ DON'T                  │
├─────────────────────────────────┼───────────────────────────┤
│  Use TypeScript types           │  Use 'any' type           │
│  Keep controllers thin          │  Put logic in controllers │
│  Throw custom errors            │  Return error objects     │
│  Log with context               │  Log sensitive data       │
│  Validate all input             │  Trust user input         │
│  Write descriptive tests        │  Skip edge cases          │
│  Use consistent response format │  Mix response formats     │
│  Commit after each phase        │  Make huge commits        │
│  Use environment variables      │  Hardcode secrets         │
│  Return early                   │  Deep nest conditions     │
└─────────────────────────────────┴───────────────────────────┘
```

---

## Related Documents

| Document                                 | Description                       |
| ---------------------------------------- | --------------------------------- |
| [requirements.md](./requirements.md)     | Basic project requirements        |
| [prd.md](./prd.md)                       | Product Requirements Document     |
| [architecture.md](./architecture.md)     | System architecture and data flow |
| [data-model.md](./data-model.md)         | Data model specifications         |
| [api-spec.md](./api-spec.md)             | Complete API specification        |
| [error-handling.md](./error-handling.md) | Error handling strategy           |
| [logging.md](./logging.md)               | Logging implementation            |
| [testing.md](./testing.md)               | Testing strategy                  |
| [swagger.md](./swagger.md)               | Swagger setup guide               |
| [tasks.md](./tasks.md)                   | Implementation checklist          |
