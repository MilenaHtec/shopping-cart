# Implementation Tasks - Shopping Cart API

## Overview

This document contains a detailed checklist of all tasks required to implement the Shopping Cart API. Tasks are organized into phases, and each phase should be committed and pushed upon completion.

**Tech Stack:** Node.js + Express + TypeScript

---

## Phase 1: Project Setup

### 1.1 Initialize Project

- [ ] Create `package.json` with `npm init -y`
- [ ] Install production dependencies:
  - [ ] `express` - Web framework
  - [ ] `cors` - Cross-origin resource sharing
  - [ ] `winston` - Logging library
  - [ ] `swagger-ui-express` - Swagger UI
  - [ ] `swagger-jsdoc` - Swagger JSDoc
  - [ ] `uuid` - Generate unique IDs
- [ ] Install dev dependencies:
  - [ ] `typescript` - TypeScript compiler
  - [ ] `ts-node` - Run TypeScript directly
  - [ ] `nodemon` - Auto-restart on changes
  - [ ] `@types/express` - Express types
  - [ ] `@types/cors` - CORS types
  - [ ] `@types/swagger-ui-express` - Swagger types
  - [ ] `@types/swagger-jsdoc` - Swagger JSDoc types
  - [ ] `@types/uuid` - UUID types
  - [ ] `jest` - Testing framework
  - [ ] `ts-jest` - Jest TypeScript support
  - [ ] `@types/jest` - Jest types

### 1.2 Configure TypeScript

- [ ] Create `tsconfig.json` with appropriate settings
- [ ] Configure `outDir` to `dist/`
- [ ] Enable strict mode
- [ ] Set module resolution

### 1.3 Configure Scripts

- [ ] Add `dev` script (nodemon + ts-node)
- [ ] Add `build` script (tsc)
- [ ] Add `start` script (node dist/server.js)
- [ ] Add `test` script (jest)
- [ ] Add `test:coverage` script (jest --coverage)

### 1.4 Create Folder Structure

- [ ] Create `src/` directory
- [ ] Create `src/config/` - Configuration files
- [ ] Create `src/controllers/` - Route handlers
- [ ] Create `src/services/` - Business logic
- [ ] Create `src/middleware/` - Express middleware
- [ ] Create `src/models/` - TypeScript interfaces
- [ ] Create `src/routes/` - Route definitions
- [ ] Create `src/errors/` - Custom error classes
- [ ] Create `src/utils/` - Utility functions
- [ ] Create `tests/` - Test files
- [ ] Create `logs/` - Log files directory

### 1.5 Create .gitignore

- [ ] Add `node_modules/`
- [ ] Add `dist/`
- [ ] Add `logs/`
- [ ] Add `.env`
- [ ] Add `coverage/`

**📌 COMMIT: "Phase 1: Project setup and configuration"**

---

## Phase 2: Core Models and Errors

### 2.1 Create Data Models

- [ ] Create `src/models/cart.model.ts`
- [ ] Define `CartItem` interface
  - [ ] productId: number
  - [ ] name: string
  - [ ] price: number
  - [ ] quantity: number
- [ ] Define `Cart` interface
  - [ ] items: CartItem[]
- [ ] Define `CartResponse` interface (with total, itemCount)
- [ ] Define `CheckoutResponse` interface (with orderId, checkoutTime)
- [ ] Define `ApiResponse<T>` generic interface

### 2.2 Create Custom Error Classes

- [ ] Create `src/errors/AppError.ts`
- [ ] Implement base `AppError` class
  - [ ] message: string
  - [ ] statusCode: number
  - [ ] isOperational: boolean
- [ ] Create `ValidationError` class (400)
- [ ] Create `NotFoundError` class (404)
- [ ] Create `BadRequestError` class (400)

**📌 COMMIT: "Phase 2: Data models and custom error classes"**

---

## Phase 3: Configuration

### 3.1 Logger Configuration

- [ ] Create `src/config/logger.ts`
- [ ] Configure Winston logger
- [ ] Set up console transport (colorized)
- [ ] Set up file transport for errors (`logs/error.log`)
- [ ] Set up file transport for all logs (`logs/combined.log`)
- [ ] Configure log format (timestamp, JSON)
- [ ] Export logger instance

### 3.2 Swagger Configuration

- [ ] Create `src/config/swagger.ts`
- [ ] Configure swagger-jsdoc options
- [ ] Define API info (title, version, description)
- [ ] Define server URL
- [ ] Define component schemas
- [ ] Export swaggerSpec

**📌 COMMIT: "Phase 3: Logger and Swagger configuration"**

---

## Phase 4: Middleware

### 4.1 Request Logger Middleware

- [ ] Create `src/middleware/requestLogger.ts`
- [ ] Log incoming requests (method, path, body)
- [ ] Log response status and duration
- [ ] Use Winston logger

### 4.2 Error Handler Middleware

- [ ] Create `src/middleware/errorHandler.ts`
- [ ] Catch all errors
- [ ] Determine status code from AppError
- [ ] Log error details
- [ ] Return standardized error response
- [ ] Handle unexpected errors (500)

### 4.3 Async Handler Utility

- [ ] Create `src/utils/asyncHandler.ts`
- [ ] Wrap async functions to catch errors
- [ ] Forward errors to next()

**📌 COMMIT: "Phase 4: Middleware implementation"**

---

## Phase 5: Cart Service (Business Logic)

### 5.1 Create Cart Service

- [ ] Create `src/services/cart.service.ts`
- [ ] Initialize in-memory cart storage
- [ ] Implement private helper methods:
  - [ ] `calculateTotal()` - Sum of (price × quantity)
  - [ ] `calculateItemCount()` - Sum of quantities
  - [ ] `findItemIndex()` - Find item by productId

### 5.2 Implement Service Methods

- [ ] `getCart()` - Return cart with computed properties
- [ ] `addItem(item)` - Add new or increment existing
- [ ] `updateItem(productId, updates)` - Update quantity/price
- [ ] `removeItem(productId)` - Remove item from cart
- [ ] `clearCart()` - Remove all items
- [ ] `checkout()` - Generate order and clear cart

### 5.3 Add Validation

- [ ] Validate productId (required, positive integer)
- [ ] Validate name (required, non-empty)
- [ ] Validate price (required, > 0)
- [ ] Validate quantity (required, >= 1)
- [ ] Throw ValidationError for invalid input
- [ ] Throw NotFoundError when item doesn't exist
- [ ] Throw BadRequestError for empty cart checkout

### 5.4 Add Logging

- [ ] Log "Adding item to cart"
- [ ] Log "Item added to cart"
- [ ] Log "Updating cart item"
- [ ] Log "Removing item from cart"
- [ ] Log "Clearing cart"
- [ ] Log "Processing checkout"

**📌 COMMIT: "Phase 5: Cart service with business logic"**

---

## Phase 6: Cart Controller

### 6.1 Create Cart Controller

- [ ] Create `src/controllers/cart.controller.ts`
- [ ] Import CartService
- [ ] Import asyncHandler

### 6.2 Implement Controller Methods

- [ ] `getCart` - GET /cart
  - [ ] Call cartService.getCart()
  - [ ] Return 200 with cart data
- [ ] `addItem` - POST /cart
  - [ ] Extract body (productId, name, price, quantity)
  - [ ] Call cartService.addItem()
  - [ ] Return 201 with success message and cart
- [ ] `updateItem` - PUT /cart/:productId
  - [ ] Extract productId from params
  - [ ] Extract updates from body
  - [ ] Call cartService.updateItem()
  - [ ] Return 200 with success message and cart
- [ ] `removeItem` - DELETE /cart/:productId
  - [ ] Extract productId from params
  - [ ] Call cartService.removeItem()
  - [ ] Return 200 with success message and cart
- [ ] `clearCart` - DELETE /cart
  - [ ] Call cartService.clearCart()
  - [ ] Return 200 with success message
- [ ] `checkout` - POST /cart/checkout
  - [ ] Call cartService.checkout()
  - [ ] Return 200 with order summary

**📌 COMMIT: "Phase 6: Cart controller implementation"**

---

## Phase 7: Routes

### 7.1 Create Cart Routes

- [ ] Create `src/routes/cart.routes.ts`
- [ ] Import express Router
- [ ] Import cartController

### 7.2 Define Routes

- [ ] GET `/` → cartController.getCart
- [ ] POST `/` → cartController.addItem
- [ ] PUT `/:productId` → cartController.updateItem
- [ ] DELETE `/:productId` → cartController.removeItem
- [ ] DELETE `/` → cartController.clearCart
- [ ] POST `/checkout` → cartController.checkout

### 7.3 Add Swagger JSDoc Comments

- [ ] Document GET /cart
- [ ] Document POST /cart
- [ ] Document PUT /cart/:productId
- [ ] Document DELETE /cart/:productId
- [ ] Document DELETE /cart
- [ ] Document POST /cart/checkout

**📌 COMMIT: "Phase 7: Route definitions with Swagger docs"**

---

## Phase 8: Express App Setup

### 8.1 Create App

- [ ] Create `src/app.ts`
- [ ] Import express
- [ ] Import cors
- [ ] Import swagger-ui-express
- [ ] Import swaggerSpec
- [ ] Import routes
- [ ] Import middleware

### 8.2 Configure Middleware

- [ ] Use `express.json()` for parsing JSON
- [ ] Use `cors()` for CORS support
- [ ] Use requestLogger middleware

### 8.3 Configure Routes

- [ ] Mount cart routes at `/api/cart`
- [ ] Mount Swagger UI at `/api-docs`
- [ ] Add `/api-docs.json` endpoint

### 8.4 Configure Error Handling

- [ ] Use errorHandler middleware (last)

### 8.5 Create Server Entry Point

- [ ] Create `src/server.ts`
- [ ] Import app
- [ ] Define PORT (3000 or from env)
- [ ] Start server with `app.listen()`
- [ ] Log "Server started" message
- [ ] Log Swagger UI URL

**📌 COMMIT: "Phase 8: Express app and server setup"**

---

## Phase 9: Testing

### 9.1 Configure Jest

- [ ] Create `jest.config.js`
- [ ] Set preset to `ts-jest`
- [ ] Set testEnvironment to `node`
- [ ] Configure coverage settings

### 9.2 Write Cart Service Tests

- [ ] Create `tests/cart.service.test.ts`
- [ ] Test `addItem`:
  - [ ] Add to empty cart
  - [ ] Add existing item (increment)
  - [ ] Multiple different items
  - [ ] Calculate correct total
- [ ] Test `updateItem`:
  - [ ] Update quantity
  - [ ] Update price
  - [ ] Update both
  - [ ] Not found error
- [ ] Test `removeItem`:
  - [ ] Remove item
  - [ ] Recalculate total
  - [ ] Not found error
- [ ] Test `clearCart`:
  - [ ] Clear all items
  - [ ] Reset total to zero
- [ ] Test `getCart`:
  - [ ] Empty cart
  - [ ] With items
  - [ ] Correct total and itemCount
- [ ] Test `checkout`:
  - [ ] Success with order summary
  - [ ] Cart cleared after checkout
  - [ ] Empty cart error
- [ ] Test validation:
  - [ ] Missing productId
  - [ ] Missing name
  - [ ] Invalid price
  - [ ] Invalid quantity

### 9.3 Run Tests and Check Coverage

- [ ] Run `npm test`
- [ ] Run `npm run test:coverage`
- [ ] Verify > 80% coverage

**📌 COMMIT: "Phase 9: Unit tests for cart service"**

---

## Phase 10: Final Touches

### 10.1 Update README

- [ ] Add project description
- [ ] Add installation instructions
- [ ] Add available scripts
- [ ] Add API endpoints table
- [ ] Add Swagger UI link
- [ ] Add tech stack info

### 10.2 Test Manually

- [ ] Start server with `npm run dev`
- [ ] Open Swagger UI at `http://localhost:3000/api-docs`
- [ ] Test GET /cart (empty)
- [ ] Test POST /cart (add item)
- [ ] Test POST /cart (add another item)
- [ ] Test GET /cart (with items)
- [ ] Test PUT /cart/:productId
- [ ] Test DELETE /cart/:productId
- [ ] Test POST /cart/checkout
- [ ] Test DELETE /cart
- [ ] Test error cases (400, 404)

### 10.3 Code Review

- [ ] Check all files for TypeScript errors
- [ ] Verify logging works correctly
- [ ] Verify error handling works correctly
- [ ] Check code formatting

**📌 COMMIT: "Phase 10: README and final touches"**

---

## Summary

| Phase | Description | Est. Time |
|-------|-------------|-----------|
| 1 | Project Setup | 15 min |
| 2 | Models and Errors | 10 min |
| 3 | Configuration | 10 min |
| 4 | Middleware | 15 min |
| 5 | Cart Service | 30 min |
| 6 | Cart Controller | 15 min |
| 7 | Routes | 10 min |
| 8 | Express App | 15 min |
| 9 | Testing | 30 min |
| 10 | Final Touches | 15 min |
| **Total** | | **~2.5 hours** |

---

## Commit History (Expected)

```
1. "Phase 1: Project setup and configuration"
2. "Phase 2: Data models and custom error classes"
3. "Phase 3: Logger and Swagger configuration"
4. "Phase 4: Middleware implementation"
5. "Phase 5: Cart service with business logic"
6. "Phase 6: Cart controller implementation"
7. "Phase 7: Route definitions with Swagger docs"
8. "Phase 8: Express app and server setup"
9. "Phase 9: Unit tests for cart service"
10. "Phase 10: README and final touches"
```

---

## Quick Reference

### Start Development

```bash
npm run dev
```

### Run Tests

```bash
npm test
npm run test:coverage
```

### Build for Production

```bash
npm run build
npm start
```

### Access Swagger

```
http://localhost:3000/api-docs
```
