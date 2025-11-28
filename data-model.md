# Data Models - Shopping Cart API

## Overview

This document defines the data structures used in the Shopping Cart API. All data is stored as in-memory JavaScript objects for simplicity and fast access.

---

## Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ENTITY RELATIONSHIP                                   │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌───────────────────────┐          1:N          ┌───────────────────────┐
    │                       │ ◄─────────────────────│                       │
    │         CART          │                       │       CART ITEM       │
    │                       │ ─────────────────────►│                       │
    └───────────────────────┘      contains         └───────────────────────┘
              │                                                │
              │                                                │
              ▼                                                ▼
    ┌───────────────────────┐                      ┌───────────────────────┐
    │  - items: CartItem[]  │                      │  - productId: number  │
    │                       │                      │  - name: string       │
    │                       │                      │  - price: number      │
    │                       │                      │  - quantity: number   │
    └───────────────────────┘                      └───────────────────────┘
```

---

## Models

### CartItem

Represents a single product in the shopping cart.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CART ITEM                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┬──────────┬───────────────────────────────────────────┐    │
│   │   Field     │   Type   │   Description                             │    │
│   ├─────────────┼──────────┼───────────────────────────────────────────┤    │
│   │ productId   │ number   │ Unique identifier for the product         │    │
│   │ name        │ string   │ Display name of the product               │    │
│   │ price       │ number   │ Unit price (in decimal, e.g., 29.99)      │    │
│   │ quantity    │ number   │ Number of units in cart (min: 1)          │    │
│   └─────────────┴──────────┴───────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Schema Definition

```javascript
CartItem = {
  productId: number, // Required, unique within cart
  name: string, // Required, non-empty
  price: number, // Required, must be > 0
  quantity: number, // Required, must be >= 1
};
```

#### TypeScript Interface

```typescript
interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}
```

#### Example

```json
{
  "productId": 101,
  "name": "Wireless Mouse",
  "price": 29.99,
  "quantity": 2
}
```

---

### Cart

Represents the shopping cart container that holds all cart items.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 CART                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────┬──────────────┬───────────────────────────────────────┐    │
│   │   Field     │   Type       │   Description                         │    │
│   ├─────────────┼──────────────┼───────────────────────────────────────┤    │
│   │ items       │ CartItem[]   │ Array of cart items                   │    │
│   └─────────────┴──────────────┴───────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Schema Definition

```javascript
Cart = {
  items: CartItem[]    // Array of CartItem objects
}
```

#### TypeScript Interface

```typescript
interface Cart {
  items: CartItem[];
}
```

#### Example

```json
{
  "items": [
    {
      "productId": 101,
      "name": "Wireless Mouse",
      "price": 29.99,
      "quantity": 2
    },
    {
      "productId": 205,
      "name": "USB-C Cable",
      "price": 12.5,
      "quantity": 3
    }
  ]
}
```

---

## Computed Properties

These values are calculated on-the-fly and returned in API responses:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         COMPUTED PROPERTIES                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────┬──────────┬────────────────────────────────────────┐  │
│   │   Property       │   Type   │   Calculation                          │  │
│   ├──────────────────┼──────────┼────────────────────────────────────────┤  │
│   │ total            │ number   │ SUM(item.price * item.quantity)        │  │
│   │ itemCount        │ number   │ SUM(item.quantity)                     │  │
│   │ uniqueItems      │ number   │ items.length                           │  │
│   └──────────────────┴──────────┴────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Calculation Logic

```javascript
// Total price calculation
const total = cart.items.reduce(
  (sum, item) => sum + item.price * item.quantity,
  0
);

// Total item count
const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);

// Unique products count
const uniqueItems = cart.items.length;
```

---

## Validation Rules

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          VALIDATION RULES                                    │
└─────────────────────────────────────────────────────────────────────────────┘

   CartItem Validation:
   ┌─────────────────────────────────────────────────────────────────────────┐
   │                                                                          │
   │   productId                                                              │
   │   ├── Required: ✓                                                        │
   │   ├── Type: number                                                       │
   │   └── Constraint: Must be a positive integer                             │
   │                                                                          │
   │   name                                                                   │
   │   ├── Required: ✓                                                        │
   │   ├── Type: string                                                       │
   │   ├── Min Length: 1                                                      │
   │   └── Max Length: 255                                                    │
   │                                                                          │
   │   price                                                                  │
   │   ├── Required: ✓                                                        │
   │   ├── Type: number                                                       │
   │   ├── Constraint: Must be > 0                                            │
   │   └── Format: Decimal (2 places max)                                     │
   │                                                                          │
   │   quantity                                                               │
   │   ├── Required: ✓                                                        │
   │   ├── Type: number                                                       │
   │   ├── Constraint: Must be >= 1                                           │
   │   └── Format: Integer                                                    │
   │                                                                          │
   └─────────────────────────────────────────────────────────────────────────┘
```

---

## In-Memory Storage Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        IN-MEMORY STORAGE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   // Single cart instance stored in memory                                   │
│                                                                              │
│   const cart = {                                                             │
│     items: []     ◄─── Array that holds all CartItem objects                 │
│   };                                                                         │
│                                                                              │
│   ┌───────────────────────────────────────────────────────────────────┐     │
│   │                     MEMORY LAYOUT                                  │     │
│   ├───────────────────────────────────────────────────────────────────┤     │
│   │                                                                    │     │
│   │   cart.items[0] ──► { productId: 101, name: "Mouse", ... }        │     │
│   │   cart.items[1] ──► { productId: 205, name: "Cable", ... }        │     │
│   │   cart.items[2] ──► { productId: 310, name: "Keyboard", ... }     │     │
│   │        ...                                                         │     │
│   │   cart.items[n] ──► { productId: xxx, name: "...", ... }          │     │
│   │                                                                    │     │
│   └───────────────────────────────────────────────────────────────────┘     │
│                                                                              │
│   Note: Data is lost when server restarts (non-persistent)                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Operations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA OPERATIONS                                      │
└─────────────────────────────────────────────────────────────────────────────┘

   ┌─────────────────┐
   │   ADD ITEM      │
   └────────┬────────┘
            │
            ▼
   ┌────────────────────────────────────────────────────────────────┐
   │  1. Check if productId exists in cart.items                    │
   │  2. If EXISTS → Update quantity (quantity += newQuantity)      │
   │  3. If NOT EXISTS → Push new CartItem to cart.items            │
   └────────────────────────────────────────────────────────────────┘

   ┌─────────────────┐
   │  UPDATE ITEM    │
   └────────┬────────┘
            │
            ▼
   ┌────────────────────────────────────────────────────────────────┐
   │  1. Find item by productId                                     │
   │  2. If FOUND → Update quantity to new value                    │
   │  3. If NOT FOUND → Return 404 error                            │
   └────────────────────────────────────────────────────────────────┘

   ┌─────────────────┐
   │  REMOVE ITEM    │
   └────────┬────────┘
            │
            ▼
   ┌────────────────────────────────────────────────────────────────┐
   │  1. Filter out item with matching productId                    │
   │  2. cart.items = cart.items.filter(i => i.productId !== id)    │
   └────────────────────────────────────────────────────────────────┘

   ┌─────────────────┐
   │  CLEAR CART     │
   └────────┬────────┘
            │
            ▼
   ┌────────────────────────────────────────────────────────────────┐
   │  1. Reset items array: cart.items = []                         │
   └────────────────────────────────────────────────────────────────┘

   ┌─────────────────┐
   │   GET CART      │
   └────────┬────────┘
            │
            ▼
   ┌────────────────────────────────────────────────────────────────┐
   │  1. Return cart.items                                          │
   │  2. Calculate and include total & itemCount                    │
   └────────────────────────────────────────────────────────────────┘
```

---

## API Response Format

When returning cart data, the API includes computed properties:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       API RESPONSE STRUCTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   {                                                                          │
│     "success": true,                                                         │
│     "data": {                                                                │
│       "items": [                     ◄── Array of CartItem                   │
│         {                                                                    │
│           "productId": 101,                                                  │
│           "name": "Wireless Mouse",                                          │
│           "price": 29.99,                                                    │
│           "quantity": 2                                                      │
│         },                                                                   │
│         {                                                                    │
│           "productId": 205,                                                  │
│           "name": "USB-C Cable",                                             │
│           "price": 12.50,                                                    │
│           "quantity": 3                                                      │
│         }                                                                    │
│       ],                                                                     │
│       "total": 97.48,                ◄── Computed: (29.99*2) + (12.50*3)     │
│       "itemCount": 5                 ◄── Computed: 2 + 3                     │
│     }                                                                        │
│   }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Complete TypeScript Types

```typescript
/**
 * Represents a single item in the shopping cart
 */
interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

/**
 * Represents the shopping cart
 */
interface Cart {
  items: CartItem[];
}

/**
 * Cart response with computed properties
 */
interface CartResponse {
  items: CartItem[];
  total: number;
  itemCount: number;
}

/**
 * API Response wrapper
 */
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    statusCode: number;
  };
}
```

---

## Sample Data

```json
{
  "items": [
    {
      "productId": 101,
      "name": "Wireless Mouse",
      "price": 29.99,
      "quantity": 2
    },
    {
      "productId": 205,
      "name": "USB-C Cable",
      "price": 12.5,
      "quantity": 3
    },
    {
      "productId": 310,
      "name": "Mechanical Keyboard",
      "price": 89.99,
      "quantity": 1
    },
    {
      "productId": 412,
      "name": "Monitor Stand",
      "price": 45.0,
      "quantity": 1
    }
  ]
}
```

**Computed Values:**

- **Total:** (29.99 × 2) + (12.50 × 3) + (89.99 × 1) + (45.00 × 1) = **$232.47**
- **Item Count:** 2 + 3 + 1 + 1 = **7 items**
- **Unique Items:** **4 products**
