# Product Requirements Document (PRD)

## Shopping Cart API

**Version:** 1.0.0  
**Date:** November 2024  
**Status:** Ready for Implementation

---

## 1. Executive Summary

This document outlines the requirements for building a backend REST API for managing a shopping cart. The API will enable users to perform CRUD operations on cart items, calculate totals, and process checkout. This is a foundational e-commerce component designed with simplicity, maintainability, and testability in mind.

---

## 2. Project Overview

### 2.1 Purpose

Build a simple, robust backend API that handles the complete lifecycle of a shopping cart:

- Adding products to cart
- Updating quantities and prices
- Removing products
- Clearing the entire cart
- Processing checkout with order summary

### 2.2 Goals

| Goal            | Description                                                    |
| --------------- | -------------------------------------------------------------- |
| Functional      | Implement all CRUD operations for shopping cart management     |
| Reliability     | Handle errors gracefully with meaningful error messages        |
| Maintainability | Clean, well-structured code with proper separation of concerns |
| Observability   | Log all major activities for debugging and monitoring          |
| Quality         | Verify functionality through comprehensive unit tests          |

### 2.3 Target Users

- Frontend applications (React, Vue, Angular, etc.)
- Mobile applications
- API testing tools (Postman, Insomnia)
- Other backend services

---

## 3. Technical Stack

| Component     | Technology            | Purpose                                           |
| ------------- | --------------------- | ------------------------------------------------- |
| Runtime       | Node.js               | Server-side JavaScript execution                  |
| Framework     | Express.js            | Web framework for routing and middleware          |
| Language      | TypeScript            | Type safety and better developer experience       |
| Database      | In-Memory (Array/Map) | Simple data storage without external dependencies |
| Testing       | Jest                  | Unit testing framework                            |
| Logging       | Winston               | Structured logging                                |
| Documentation | Swagger (OpenAPI)     | Interactive API documentation                     |

---

## 4. Functional Requirements

### 4.1 Core Features

#### FR-01: Add Item to Cart

- **Description:** User can add a product to the shopping cart
- **Behavior:**
  - If product doesn't exist in cart → add new item
  - If product already exists → increment quantity
- **Input:** productId, name, price, quantity
- **Output:** Updated cart with total

#### FR-02: Update Cart Item

- **Description:** User can update quantity or price of an existing item
- **Behavior:** Find item by productId and update specified fields
- **Input:** productId (URL param), quantity and/or price (body)
- **Output:** Updated cart with recalculated total
- **Error:** 404 if item not found

#### FR-03: Remove Item from Cart

- **Description:** User can remove a specific item from the cart
- **Behavior:** Remove item matching the productId
- **Input:** productId (URL param)
- **Output:** Updated cart with recalculated total
- **Error:** 404 if item not found

#### FR-04: Get Cart Contents

- **Description:** User can retrieve current cart contents
- **Behavior:** Return all items with calculated total and item count
- **Input:** None
- **Output:** Cart items, total price, total item count

#### FR-05: Clear Cart

- **Description:** User can remove all items from the cart
- **Behavior:** Empty the cart completely
- **Input:** None
- **Output:** Empty cart with zero total

#### FR-06: Checkout

- **Description:** Process checkout and generate order summary
- **Behavior:**
  - Calculate final total
  - Generate order ID
  - Return order summary
  - Clear cart after checkout
- **Input:** None
- **Output:** Order ID, items, total, checkout timestamp
- **Error:** 400 if cart is empty

### 4.2 Feature Summary Table

| Feature     | Endpoint         | Method | Success | Error Codes |
| ----------- | ---------------- | ------ | ------- | ----------- |
| Add item    | /cart            | POST   | 201     | 400         |
| Update item | /cart/:productId | PUT    | 200     | 400, 404    |
| Remove item | /cart/:productId | DELETE | 200     | 404         |
| Get cart    | /cart            | GET    | 200     | -           |
| Clear cart  | /cart            | DELETE | 200     | -           |
| Checkout    | /cart/checkout   | POST   | 200     | 400         |

---

## 5. Non-Functional Requirements

### 5.1 Logging (NFR-01)

**Requirement:** Log all major activities

| Activity            | Log Level | Example                                |
| ------------------- | --------- | -------------------------------------- |
| Server startup      | INFO      | "Server started on port 3000"          |
| Incoming requests   | INFO      | "POST /api/cart"                       |
| Business operations | INFO      | "Item added to cart: productId=1"      |
| Validation errors   | WARN      | "Validation failed: price must be > 0" |
| Not found errors    | WARN      | "Item not found: productId=999"        |
| Server errors       | ERROR     | "Internal server error"                |

**Implementation:** Winston logger with console and file transports.

### 5.2 Error Handling (NFR-02)

**Requirement:** Implement comprehensive error handling

| Error Type      | Status Code | When                    |
| --------------- | ----------- | ----------------------- |
| ValidationError | 400         | Invalid input data      |
| NotFoundError   | 404         | Item not in cart        |
| BadRequestError | 400         | Empty cart checkout     |
| InternalError   | 500         | Unexpected server error |

**Implementation:** Global Express error handler middleware with custom error classes.

### 5.3 Testing (NFR-03)

**Requirement:** Implement unit tests for cart operations

| Test Category | Coverage                                |
| ------------- | --------------------------------------- |
| Add item      | New item, existing item, multiple items |
| Update item   | Quantity, price, both, not found        |
| Remove item   | Success, not found                      |
| Clear cart    | With items, already empty               |
| Get cart      | Empty, with items, total calculation    |
| Checkout      | Success, empty cart error               |
| Validation    | Missing fields, invalid values          |

**Target:** > 80% code coverage

---

## 6. Data Models

### 6.1 CartItem

```typescript
interface CartItem {
  productId: number; // Unique product identifier
  name: string; // Product display name
  price: number; // Unit price (must be > 0)
  quantity: number; // Quantity in cart (must be >= 1)
}
```

### 6.2 Cart

```typescript
interface Cart {
  items: CartItem[]; // Array of cart items
}
```

### 6.3 Computed Properties (returned in API responses)

| Property  | Type   | Calculation                     |
| --------- | ------ | ------------------------------- |
| total     | number | SUM(item.price × item.quantity) |
| itemCount | number | SUM(item.quantity)              |

---

## 7. API Specification

### 7.1 Base URL

```
http://localhost:3000/api
```

### 7.2 Endpoints

| Method | Endpoint         | Description                |
| ------ | ---------------- | -------------------------- |
| GET    | /cart            | Get cart contents          |
| POST   | /cart            | Add item to cart           |
| PUT    | /cart/:productId | Update item quantity/price |
| DELETE | /cart/:productId | Remove single item         |
| DELETE | /cart            | Clear entire cart          |
| POST   | /cart/checkout   | Process checkout           |

### 7.3 Standard Response Format

**Success:**

```json
{
  "success": true,
  "message": "Operation description",
  "data": { ... }
}
```

**Error:**

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

---

## 8. System Architecture

### 8.1 Components

```
┌─────────────────────────────────────────────────────┐
│                 SHOPPING CART API                    │
├─────────────────────────────────────────────────────┤
│  Middleware Layer                                    │
│  ├── Logging Middleware (Winston)                   │
│  ├── Validation Middleware                          │
│  └── Error Handler Middleware                       │
├─────────────────────────────────────────────────────┤
│  Controller Layer                                    │
│  └── CartController (route handlers)                │
├─────────────────────────────────────────────────────┤
│  Service Layer                                       │
│  └── CartService (business logic)                   │
├─────────────────────────────────────────────────────┤
│  Data Layer                                          │
│  └── In-Memory Storage (JavaScript Array)           │
└─────────────────────────────────────────────────────┘
```

### 8.2 Request Flow

```
User Request → Logging → Validation → Controller → Service → Database
                                                        ↓
User Response ← Error Handler ← Controller ← Service ←──┘
```

---

## 9. Validation Rules

### 9.1 Add Item (POST /cart)

| Field     | Type   | Required | Validation               |
| --------- | ------ | -------- | ------------------------ |
| productId | number | Yes      | Must be positive integer |
| name      | string | Yes      | Non-empty string         |
| price     | number | Yes      | Must be > 0              |
| quantity  | number | Yes      | Must be >= 1             |

### 9.2 Update Item (PUT /cart/:productId)

| Field    | Type   | Required | Validation               |
| -------- | ------ | -------- | ------------------------ |
| quantity | number | No       | Must be >= 1 if provided |
| price    | number | No       | Must be > 0 if provided  |

**Note:** At least one field must be provided.

---

## 10. Technical Constraints

| Constraint  | Description                                   |
| ----------- | --------------------------------------------- |
| Database    | In-memory storage only (no external database) |
| Persistence | Data is lost when server restarts             |
| Single cart | One global cart (no user sessions)            |
| Concurrency | Single-threaded Node.js execution             |

---

## 11. Out of Scope

The following features are explicitly **NOT** included in this version:

- User authentication and authorization
- Multiple carts per user
- Session management
- Persistent database storage
- Product catalog management
- Inventory tracking
- Payment processing
- Order history
- Shipping calculations
- Tax calculations
- Discounts and coupons

---

## 12. Success Criteria

| Criteria                 | Measurement                                |
| ------------------------ | ------------------------------------------ |
| All endpoints functional | 6/6 endpoints working correctly            |
| Error handling           | All error cases return proper status codes |
| Logging                  | All major activities logged                |
| Test coverage            | > 80% code coverage                        |
| Documentation            | Swagger UI accessible and complete         |

---

## 13. Project Structure

```
shopping-cart/
├── src/
│   ├── app.ts                 # Express app setup
│   ├── server.ts              # Server entry point
│   ├── config/
│   │   ├── swagger.ts         # Swagger configuration
│   │   └── logger.ts          # Winston configuration
│   ├── controllers/
│   │   └── cart.controller.ts # Route handlers
│   ├── services/
│   │   └── cart.service.ts    # Business logic
│   ├── middleware/
│   │   ├── errorHandler.ts    # Global error handler
│   │   ├── requestLogger.ts   # Request logging
│   │   └── validation.ts      # Input validation
│   ├── models/
│   │   └── cart.model.ts      # Data models/interfaces
│   ├── errors/
│   │   └── AppError.ts        # Custom error classes
│   ├── routes/
│   │   └── cart.routes.ts     # Route definitions
│   └── utils/
│       └── asyncHandler.ts    # Async wrapper utility
├── tests/
│   └── cart.service.test.ts   # Unit tests
├── logs/                      # Log files
├── package.json
├── tsconfig.json
└── jest.config.js
```

---

## 14. Related Documentation

| Document                                 | Purpose                                    |
| ---------------------------------------- | ------------------------------------------ |
| [requirements.md](./requirements.md)     | Basic project requirements                 |
| [architecture.md](./architecture.md)     | System architecture and data flow diagrams |
| [data-model.md](./data-model.md)         | Detailed data model specifications         |
| [api-spec.md](./api-spec.md)             | Complete API specification                 |
| [error-handling.md](./error-handling.md) | Error handling strategy                    |
| [logging.md](./logging.md)               | Logging implementation plan                |
| [testing.md](./testing.md)               | Testing strategy and test cases            |
| [swagger.md](./swagger.md)               | Swagger/OpenAPI setup guide                |

---

## 15. Revision History

| Version | Date     | Author | Changes         |
| ------- | -------- | ------ | --------------- |
| 1.0.0   | Nov 2024 | -      | Initial version |
