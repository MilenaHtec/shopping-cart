# Testing Plan - Shopping Cart API

## Overview

This document defines the testing strategy for the Shopping Cart API. We will implement unit tests to verify the functionality of all cart operations.

**Requirement:** Implement unit tests for the cart operations.

---

## Testing Framework

We will use **Jest** as the testing framework for Node.js/TypeScript.

```bash
npm install --save-dev jest ts-jest @types/jest
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov"],
};
```

---

## Test Structure

```
src/
├── services/
│   ├── cart.service.ts
│   └── cart.service.test.ts    ← Unit tests
├── controllers/
│   ├── cart.controller.ts
│   └── cart.controller.test.ts ← Unit tests
└── __tests__/
    └── integration/
        └── cart.api.test.ts    ← Integration tests (optional)
```

---

## Unit Tests for Cart Operations

### Test Categories

| Category    | Description              | Priority |
| ----------- | ------------------------ | -------- |
| Add item    | Adding items to cart     | High     |
| Update item | Updating quantity/price  | High     |
| Remove item | Removing items from cart | High     |
| Clear cart  | Clearing entire cart     | High     |
| Get cart    | Retrieving cart contents | High     |
| Checkout    | Processing checkout      | High     |
| Validation  | Input validation         | Medium   |
| Edge cases  | Empty cart, invalid data | Medium   |

---

## Cart Service Unit Tests

### 1. Add Item Tests

```typescript
describe("CartService - addItem", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  test("should add a new item to empty cart", () => {
    const item = { productId: 1, name: "Milk", price: 2.5, quantity: 2 };

    const result = cartService.addItem(item);

    expect(result.items).toHaveLength(1);
    expect(result.items[0]).toEqual(item);
  });

  test("should increment quantity when adding existing item", () => {
    const item = { productId: 1, name: "Milk", price: 2.5, quantity: 2 };

    cartService.addItem(item);
    cartService.addItem({ ...item, quantity: 3 });

    const cart = cartService.getCart();
    expect(cart.items).toHaveLength(1);
    expect(cart.items[0].quantity).toBe(5);
  });

  test("should calculate correct total after adding item", () => {
    const item = { productId: 1, name: "Milk", price: 2.5, quantity: 2 };

    const result = cartService.addItem(item);

    expect(result.total).toBe(5.0);
  });

  test("should add multiple different items", () => {
    const item1 = { productId: 1, name: "Milk", price: 2.5, quantity: 2 };
    const item2 = { productId: 2, name: "Bread", price: 1.99, quantity: 1 };

    cartService.addItem(item1);
    cartService.addItem(item2);

    const cart = cartService.getCart();
    expect(cart.items).toHaveLength(2);
    expect(cart.total).toBe(6.99);
  });
});
```

---

### 2. Update Item Tests

```typescript
describe("CartService - updateItem", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
    cartService.addItem({
      productId: 1,
      name: "Milk",
      price: 2.5,
      quantity: 2,
    });
  });

  test("should update item quantity", () => {
    const result = cartService.updateItem(1, { quantity: 5 });

    expect(result.items[0].quantity).toBe(5);
    expect(result.total).toBe(12.5);
  });

  test("should update item price", () => {
    const result = cartService.updateItem(1, { price: 3.0 });

    expect(result.items[0].price).toBe(3.0);
    expect(result.total).toBe(6.0);
  });

  test("should update both quantity and price", () => {
    const result = cartService.updateItem(1, { quantity: 3, price: 3.0 });

    expect(result.items[0].quantity).toBe(3);
    expect(result.items[0].price).toBe(3.0);
    expect(result.total).toBe(9.0);
  });

  test("should throw NotFoundError for non-existent item", () => {
    expect(() => {
      cartService.updateItem(999, { quantity: 5 });
    }).toThrow("Item with productId 999 not found in cart");
  });
});
```

---

### 3. Remove Item Tests

```typescript
describe("CartService - removeItem", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
    cartService.addItem({
      productId: 1,
      name: "Milk",
      price: 2.5,
      quantity: 2,
    });
    cartService.addItem({
      productId: 2,
      name: "Bread",
      price: 1.99,
      quantity: 1,
    });
  });

  test("should remove item from cart", () => {
    const result = cartService.removeItem(1);

    expect(result.items).toHaveLength(1);
    expect(result.items[0].productId).toBe(2);
  });

  test("should recalculate total after removing item", () => {
    const result = cartService.removeItem(1);

    expect(result.total).toBe(1.99);
  });

  test("should return empty cart when removing last item", () => {
    cartService.removeItem(1);
    const result = cartService.removeItem(2);

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  test("should throw NotFoundError for non-existent item", () => {
    expect(() => {
      cartService.removeItem(999);
    }).toThrow("Item with productId 999 not found in cart");
  });
});
```

---

### 4. Clear Cart Tests

```typescript
describe("CartService - clearCart", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
    cartService.addItem({
      productId: 1,
      name: "Milk",
      price: 2.5,
      quantity: 2,
    });
    cartService.addItem({
      productId: 2,
      name: "Bread",
      price: 1.99,
      quantity: 1,
    });
  });

  test("should clear all items from cart", () => {
    const result = cartService.clearCart();

    expect(result.items).toHaveLength(0);
  });

  test("should reset total to zero", () => {
    const result = cartService.clearCart();

    expect(result.total).toBe(0);
  });

  test("should reset itemCount to zero", () => {
    const result = cartService.clearCart();

    expect(result.itemCount).toBe(0);
  });

  test("should work on already empty cart", () => {
    cartService.clearCart();
    const result = cartService.clearCart();

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
```

---

### 5. Get Cart Tests

```typescript
describe("CartService - getCart", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  test("should return empty cart initially", () => {
    const result = cartService.getCart();

    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
    expect(result.itemCount).toBe(0);
  });

  test("should return all items in cart", () => {
    cartService.addItem({
      productId: 1,
      name: "Milk",
      price: 2.5,
      quantity: 2,
    });
    cartService.addItem({
      productId: 2,
      name: "Bread",
      price: 1.99,
      quantity: 1,
    });

    const result = cartService.getCart();

    expect(result.items).toHaveLength(2);
  });

  test("should calculate correct total", () => {
    cartService.addItem({
      productId: 1,
      name: "Milk",
      price: 2.5,
      quantity: 2,
    });
    cartService.addItem({
      productId: 2,
      name: "Bread",
      price: 1.99,
      quantity: 3,
    });

    const result = cartService.getCart();

    expect(result.total).toBe(10.97); // (2.5*2) + (1.99*3)
  });

  test("should calculate correct itemCount", () => {
    cartService.addItem({
      productId: 1,
      name: "Milk",
      price: 2.5,
      quantity: 2,
    });
    cartService.addItem({
      productId: 2,
      name: "Bread",
      price: 1.99,
      quantity: 3,
    });

    const result = cartService.getCart();

    expect(result.itemCount).toBe(5); // 2 + 3
  });
});
```

---

### 6. Checkout Tests

```typescript
describe("CartService - checkout", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
    cartService.addItem({
      productId: 1,
      name: "Milk",
      price: 2.5,
      quantity: 2,
    });
    cartService.addItem({
      productId: 2,
      name: "Bread",
      price: 1.99,
      quantity: 1,
    });
  });

  test("should return order summary with all items", () => {
    const result = cartService.checkout();

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(6.99);
  });

  test("should generate orderId", () => {
    const result = cartService.checkout();

    expect(result.orderId).toBeDefined();
    expect(result.orderId).toMatch(/^ORD-/);
  });

  test("should include checkoutTime", () => {
    const result = cartService.checkout();

    expect(result.checkoutTime).toBeDefined();
  });

  test("should clear cart after checkout", () => {
    cartService.checkout();
    const cart = cartService.getCart();

    expect(cart.items).toHaveLength(0);
    expect(cart.total).toBe(0);
  });

  test("should throw error when cart is empty", () => {
    cartService.clearCart();

    expect(() => {
      cartService.checkout();
    }).toThrow("Cannot checkout with an empty cart");
  });
});
```

---

## Validation Tests

```typescript
describe("CartService - Validation", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  test("should throw error for missing productId", () => {
    expect(() => {
      cartService.addItem({ name: "Milk", price: 2.5, quantity: 2 } as any);
    }).toThrow("productId is required");
  });

  test("should throw error for missing name", () => {
    expect(() => {
      cartService.addItem({ productId: 1, price: 2.5, quantity: 2 } as any);
    }).toThrow("name is required");
  });

  test("should throw error for price <= 0", () => {
    expect(() => {
      cartService.addItem({
        productId: 1,
        name: "Milk",
        price: 0,
        quantity: 2,
      });
    }).toThrow("price must be greater than 0");
  });

  test("should throw error for quantity < 1", () => {
    expect(() => {
      cartService.addItem({
        productId: 1,
        name: "Milk",
        price: 2.5,
        quantity: 0,
      });
    }).toThrow("quantity must be at least 1");
  });
});
```

---

## Running Tests

### NPM Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run specific test file
npm test cart.service.test.ts
```

---

## Test Coverage Goals

| Metric     | Target |
| ---------- | ------ |
| Statements | > 80%  |
| Branches   | > 80%  |
| Functions  | > 80%  |
| Lines      | > 80%  |

---

## Test Checklist

### Cart Operations

- [x] Add item to empty cart
- [x] Add item to cart with existing items
- [x] Add existing item (increment quantity)
- [x] Update item quantity
- [x] Update item price
- [x] Update item - not found error
- [x] Remove item from cart
- [x] Remove item - not found error
- [x] Clear cart
- [x] Clear already empty cart
- [x] Get cart contents
- [x] Get empty cart
- [x] Checkout with items
- [x] Checkout empty cart error

### Calculations

- [x] Total price calculation
- [x] Item count calculation
- [x] Total after add
- [x] Total after update
- [x] Total after remove
- [x] Total after clear

### Validation

- [x] Missing productId
- [x] Missing name
- [x] Invalid price (0 or negative)
- [x] Invalid quantity (0 or negative)

---

## Best Practices

1. **Test one thing per test** - Each test should verify a single behavior
2. **Use descriptive names** - Test names should describe what is being tested
3. **Arrange-Act-Assert** - Structure tests clearly with setup, execution, and verification
4. **Use beforeEach** - Reset state before each test
5. **Test edge cases** - Empty cart, invalid input, boundary values
6. **Keep tests independent** - Tests should not depend on each other
