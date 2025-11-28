# Shopping Cart API - Architecture & Data Flow

## Overview

This document describes the architecture and data flow for a simple backend API for managing a shopping cart. The system supports CRUD operations, total calculation, checkout, and full cart lifecycle management.

---

## System Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SHOPPING CART API                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────────────────────┐  │
│   │   Logging    │    │    Error     │    │      Validation              │  │
│   │  Middleware  │    │   Handler    │    │      Middleware              │  │
│   └──────────────┘    └──────────────┘    └──────────────────────────────┘  │
│                                                                              │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                         CONTROLLERS                                   │  │
│   │    CartController: Routes HTTP requests to appropriate services       │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                          SERVICES                                     │  │
│   │    CartService: Business logic for cart operations                    │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                      IN-MEMORY DATABASE                               │  │
│   │    Stores: Cart Items, Quantities, Product Info, Prices               │  │
│   └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram (DFD)

### LEVEL 0 - Context Diagram

The highest-level view showing the system as a single process with external entities.

```
┌─────────────────┐                                           ┌─────────────────────┐
│                 │                                           │                     │
│      USER       │                                           │    IN-MEMORY        │
│  (Postman/FE)   │                                           │    DATABASE         │
│                 │                                           │                     │
└────────┬────────┘                                           └──────────▲──────────┘
         │                                                               │
         │  HTTP Request                                                 │
         │  (POST, GET, PUT, DELETE)                                     │
         │                                                               │
         ▼                                                               │
┌────────────────────────────────────────────────────────────────────────┴────────┐
│                                                                                  │
│                           SHOPPING CART API                                      │
│                                                                                  │
│     • Receives HTTP requests from users                                          │
│     • Validates input data                                                       │
│     • Processes business logic                                                   │
│     • Reads/Writes to in-memory database                                         │
│     • Returns HTTP responses                                                     │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────┬────────┘
         ▲                                                               │
         │                                                               │
         │  HTTP Response                                                │
         │  (JSON payload)                                    Data Access│
         │                                                               │
┌────────┴────────┐                                           ┌──────────▼──────────┐
│                 │                                           │                     │
│      USER       │                                           │    Cart Storage     │
│                 │                                           │    (Items, Qty,     │
│                 │                                           │     Prices)         │
└─────────────────┘                                           └─────────────────────┘
```

---

### LEVEL 1 - Detailed Data Flow

Detailed breakdown showing data flow between API routes, services, and database.

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LEVEL 1 DFD                                         │
└─────────────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────┐
                    │              USER                    │
                    └─────────────────┬───────────────────┘
                                      │
            ┌─────────────────────────┼─────────────────────────┐
            │                         │                         │
            ▼                         ▼                         ▼
    ┌───────────────┐        ┌───────────────┐        ┌───────────────┐
    │  POST /cart   │        │  GET /cart    │        │ DELETE /cart  │
    │  PUT /cart    │        │               │        │               │
    └───────┬───────┘        └───────┬───────┘        └───────┬───────┘
            │                         │                         │
            └─────────────────────────┼─────────────────────────┘
                                      │
                                      ▼
                        ┌─────────────────────────┐
                        │    LOGGING MIDDLEWARE   │
                        │  (Log: time, method,    │
                        │   route, request data)  │
                        └────────────┬────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │   VALIDATION MIDDLEWARE │
                        │  (Validate request body │
                        │   and parameters)       │
                        └────────────┬────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │    CART CONTROLLER      │
                        │  (Route to service)     │
                        └────────────┬────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │     CART SERVICE        │
                        │  (Business Logic)       │
                        │  • Add/Update/Remove    │
                        │  • Calculate Total      │
                        │  • Clear Cart           │
                        └────────────┬────────────┘
                                     │
                                     ▼
                        ┌─────────────────────────┐
                        │   IN-MEMORY DATABASE    │
                        │  ┌───────────────────┐  │
                        │  │ Cart Items Array  │  │
                        │  │ ─────────────────│  │
                        │  │ id, productId,   │  │
                        │  │ name, price, qty │  │
                        │  └───────────────────┘  │
                        └─────────────────────────┘
```

---

## API Endpoints Flow

### 1. Add Item to Cart

```
    ┌──────────┐
    │   USER   │
    └────┬─────┘
         │
         │  POST /cart/items
         │  {
         │    "productId": "123",
         │    "name": "Laptop",
         │    "price": 999.99,
         │    "quantity": 1
         │  }
         ▼
    ┌─────────────────────┐
    │   LOGGING           │ ──► Log: "POST /cart/items at 2024-01-15 10:30:00"
    │   MIDDLEWARE        │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │   VALIDATION        │ ──► Check: productId, price > 0, quantity > 0
    │   MIDDLEWARE        │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │   CART CONTROLLER   │
    │   addItem()         │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │   CART SERVICE      │
    │   ┌───────────────┐ │
    │   │ Check if item │ │
    │   │ exists in cart│ │
    │   └───────┬───────┘ │
    │           │         │
    │     ┌─────┴─────┐   │
    │     ▼           ▼   │
    │  [EXISTS]   [NEW]   │
    │     │           │   │
    │  Update      Add    │
    │  quantity    item   │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │   IN-MEMORY DB      │
    │   cart[] updated    │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │   RESPONSE          │
    │   200 OK            │
    │   { cart, total }   │
    └─────────────────────┘
```

---

### 2. Update Item Quantity

```
    USER
      │
      │  PUT /cart/items/:productId
      │  { "quantity": 3 }
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Logger    │ ──► │  Validator  │ ──► │ Controller  │ ──► │   Service   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                          ┌─────────────────────────────────────────┘
                          │
                          ▼
                    ┌───────────┐
                    │ Find Item │
                    └─────┬─────┘
                          │
              ┌───────────┴───────────┐
              ▼                       ▼
        [FOUND]                  [NOT FOUND]
              │                       │
              ▼                       ▼
      Update quantity           Return 404
      in DB                     "Item not found"
              │
              ▼
      Return updated cart
      with new total
```

---

### 3. Remove Item from Cart

```
    USER
      │
      │  DELETE /cart/items/:productId
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Logger    │ ──► │ Controller  │ ──► │   Service   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                    ┌────────────────────┐
                                    │  Filter out item   │
                                    │  from cart array   │
                                    └──────────┬─────────┘
                                               │
                                               ▼
                                    ┌────────────────────┐
                                    │  Recalculate       │
                                    │  total price       │
                                    └──────────┬─────────┘
                                               │
                                               ▼
                                    ┌────────────────────┐
                                    │  Return 200 OK     │
                                    │  { cart, total }   │
                                    └────────────────────┘
```

---

### 4. Get Cart Contents

```
    USER
      │
      │  GET /cart
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Logger    │ ──► │ Controller  │ ──► │   Service   │ ──► │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                                                                    │ Read all items
                                                                    ▼
                                                           ┌───────────────┐
                                                           │ Calculate     │
                                                           │ total price   │
                                                           └───────┬───────┘
                                                                   │
                                                                   ▼
                                                           ┌───────────────┐
                                                           │ Response:     │
                                                           │ {             │
                                                           │   items: [],  │
                                                           │   total: 0.00,│
                                                           │   count: 0    │
                                                           │ }             │
                                                           └───────────────┘
```

---

### 5. Clear Cart

```
    USER
      │
      │  DELETE /cart
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Logger    │ ──► │ Controller  │ ──► │   Service   │ ──► │  Database   │
└─────────────┘     └─────────────┘     └─────────────┘     └──────┬──────┘
                                                                    │
                                                                    │ cart = []
                                                                    ▼
                                                           ┌───────────────┐
                                                           │ Response:     │
                                                           │ 200 OK        │
                                                           │ "Cart cleared"│
                                                           └───────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ERROR HANDLING FLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

    Any API Request
          │
          ▼
    ┌───────────┐
    │Controller │
    └─────┬─────┘
          │
          ▼
    ┌───────────┐
    │  Service  │
    └─────┬─────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
[SUCCESS]    [ERROR]
    │           │
    │           ▼
    │    ┌─────────────────────┐
    │    │  throw new Error()  │
    │    │  - ValidationError  │
    │    │  - NotFoundError    │
    │    │  - BadRequestError  │
    │    └──────────┬──────────┘
    │               │
    │               ▼
    │    ┌─────────────────────┐
    │    │  GLOBAL ERROR       │
    │    │  HANDLER            │
    │    │  (Middleware)       │
    │    └──────────┬──────────┘
    │               │
    │               ▼
    │    ┌─────────────────────┐
    │    │  Log Error          │
    │    │  Format Response    │
    │    └──────────┬──────────┘
    │               │
    ▼               ▼
┌───────────────────────────────┐
│         RESPONSE              │
├───────────────────────────────┤
│ Success:                      │
│ {                             │
│   "success": true,            │
│   "data": { ... }             │
│ }                             │
├───────────────────────────────┤
│ Error:                        │
│ {                             │
│   "success": false,           │
│   "error": {                  │
│     "message": "...",         │
│     "statusCode": 400/404/500 │
│   }                           │
│ }                             │
└───────────────────────────────┘
```

---

## Error Types

| Error Type | Status Code | Description |
|------------|-------------|-------------|
| `ValidationError` | 400 | Invalid input data |
| `NotFoundError` | 404 | Item not found in cart |
| `BadRequestError` | 400 | Malformed request |
| `InternalError` | 500 | Unexpected server error |

---

## Logging Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LOGGING FLOW                                       │
└─────────────────────────────────────────────────────────────────────────────┘

    Incoming Request
          │
          ▼
    ┌─────────────────────────────────────────┐
    │         LOGGING MIDDLEWARE               │
    │                                          │
    │  Log Entry:                              │
    │  ┌────────────────────────────────────┐  │
    │  │ timestamp: 2024-01-15T10:30:00Z    │  │
    │  │ method: POST                        │  │
    │  │ route: /cart/items                  │  │
    │  │ body: { productId: "123", ... }     │  │
    │  │ ip: 192.168.1.1                     │  │
    │  └────────────────────────────────────┘  │
    └─────────────────────┬───────────────────┘
                          │
                          ▼
                    ┌───────────┐
                    │Controller │
                    └─────┬─────┘
                          │
                          ▼
                    ┌───────────┐
                    │  Service  │──────► Log: "Item added to cart: {productId}"
                    └─────┬─────┘
                          │
                          ▼
                    ┌───────────┐
                    │ Database  │──────► Log: "DB operation: INSERT/UPDATE"
                    └─────┬─────┘
                          │
                          ▼
    ┌─────────────────────────────────────────┐
    │         RESPONSE LOGGING                 │
    │                                          │
    │  Log Exit:                               │
    │  ┌────────────────────────────────────┐  │
    │  │ timestamp: 2024-01-15T10:30:01Z    │  │
    │  │ statusCode: 200                     │  │
    │  │ responseTime: 45ms                  │  │
    │  └────────────────────────────────────┘  │
    └─────────────────────────────────────────┘
```

---

## Log Levels

| Level | Usage |
|-------|-------|
| `INFO` | Normal operations (requests, responses) |
| `DEBUG` | Detailed debugging information |
| `WARN` | Warning conditions |
| `ERROR` | Error conditions |

---

## Data Model

```
┌─────────────────────────────────────────────────────────────────┐
│                      IN-MEMORY DATABASE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   Cart Item Schema:                                              │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  {                                                       │   │
│   │    id: string,          // Unique identifier             │   │
│   │    productId: string,   // Product reference             │   │
│   │    name: string,        // Product name                  │   │
│   │    price: number,       // Unit price                    │   │
│   │    quantity: number,    // Quantity in cart              │   │
│   │    createdAt: Date,     // When added                    │   │
│   │    updatedAt: Date      // Last modified                 │   │
│   │  }                                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│   Cart Structure:                                                │
│   ┌─────────────────────────────────────────────────────────┐   │
│   │  {                                                       │   │
│   │    items: CartItem[],   // Array of cart items          │   │
│   │    total: number,       // Calculated total price        │   │
│   │    itemCount: number    // Total number of items         │   │
│   │  }                                                       │   │
│   └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/cart/items` | Add item to cart |
| `GET` | `/cart` | Get cart contents |
| `PUT` | `/cart/items/:productId` | Update item quantity |
| `DELETE` | `/cart/items/:productId` | Remove item from cart |
| `DELETE` | `/cart` | Clear entire cart |

---

## Technology Stack

```
┌─────────────────────────────────────────────┐
│              TECH STACK                      │
├─────────────────────────────────────────────┤
│                                              │
│   Runtime:        Node.js                    │
│   Framework:      Express.js                 │
│   Language:       TypeScript/JavaScript      │
│   Database:       In-Memory (Array/Map)      │
│   Testing:        Jest                       │
│   Logging:        Winston / Morgan           │
│   Validation:     Joi / Express-validator    │
│                                              │
└─────────────────────────────────────────────┘
```

---

## Request/Response Examples

### Add Item Request
```json
POST /cart/items
{
  "productId": "PROD-001",
  "name": "Wireless Mouse",
  "price": 29.99,
  "quantity": 2
}
```

### Success Response
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "item-uuid-123",
        "productId": "PROD-001",
        "name": "Wireless Mouse",
        "price": 29.99,
        "quantity": 2
      }
    ],
    "total": 59.98,
    "itemCount": 2
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "message": "Item not found in cart",
    "statusCode": 404
  }
}
```

---

## Related Documents

| Document | Description |
|----------|-------------|
| [requirements.md](./requirements.md) | Basic project requirements |
| [prd.md](./prd.md) | Product Requirements Document |
| [data-model.md](./data-model.md) | Detailed data model specifications |
| [api-spec.md](./api-spec.md) | Complete API specification |
| [error-handling.md](./error-handling.md) | Error handling strategy |
| [logging.md](./logging.md) | Logging implementation |
| [testing.md](./testing.md) | Testing strategy |
| [swagger.md](./swagger.md) | Swagger setup guide |
| [tasks.md](./tasks.md) | Implementation checklist |
| [rules.md](./rules.md) | Development best practices |
