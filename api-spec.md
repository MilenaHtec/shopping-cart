# API Specification - Shopping Cart API

## Base URL

```
http://localhost:3000/api
```

## Content Type

All requests and responses use `application/json`.

---

## Endpoints Overview

| Method | Endpoint           | Description                |
| ------ | ------------------ | -------------------------- |
| GET    | `/cart`            | Get cart contents          |
| POST   | `/cart`            | Add item to cart           |
| PUT    | `/cart/:productId` | Update item quantity/price |
| DELETE | `/cart/:productId` | Remove single item         |
| DELETE | `/cart`            | Clear entire cart          |
| POST   | `/cart/checkout`   | Checkout and clear cart    |

---

## GET /cart

Returns full cart contents with all items and calculated total.

### Request

```http
GET /api/cart
```

No request body required.

### Response 200 OK

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "productId": 1,
        "name": "Milk",
        "price": 2.5,
        "quantity": 2
      },
      {
        "productId": 2,
        "name": "Bread",
        "price": 1.99,
        "quantity": 1
      }
    ],
    "total": 6.99,
    "itemCount": 3
  }
}
```

### Response 200 OK (Empty Cart)

```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 0,
    "itemCount": 0
  }
}
```

---

## POST /cart

Adds a new item to the cart. If the item with the same `productId` already exists, the quantity will be incremented.

### Request

```http
POST /api/cart
Content-Type: application/json
```

### Request Body

```json
{
  "productId": 1,
  "name": "Milk",
  "price": 2.5,
  "quantity": 2
}
```

### Request Body Fields

| Field     | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| productId | number | Yes      | Unique product identifier      |
| name      | string | Yes      | Product display name           |
| price     | number | Yes      | Unit price (must be > 0)       |
| quantity  | number | Yes      | Quantity to add (must be >= 1) |

### Response 201 Created

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "items": [
      {
        "productId": 1,
        "name": "Milk",
        "price": 2.5,
        "quantity": 2
      }
    ],
    "total": 5.0,
    "itemCount": 2
  }
}
```

### Response 400 Bad Request

Missing or invalid fields.

```json
{
  "success": false,
  "error": {
    "message": "Validation failed: productId is required",
    "statusCode": 400
  }
}
```

### Validation Errors

| Error                          | Cause                     |
| ------------------------------ | ------------------------- |
| `productId is required`        | Missing productId field   |
| `name is required`             | Missing name field        |
| `price must be greater than 0` | Price is 0 or negative    |
| `quantity must be at least 1`  | Quantity is 0 or negative |

---

## PUT /cart/:productId

Updates the quantity or price of an existing item in the cart.

### Request

```http
PUT /api/cart/1
Content-Type: application/json
```

### URL Parameters

| Parameter | Type   | Description                 |
| --------- | ------ | --------------------------- |
| productId | number | ID of the product to update |

### Request Body

```json
{
  "quantity": 5
}
```

Or update price:

```json
{
  "price": 3.0
}
```

Or update both:

```json
{
  "quantity": 5,
  "price": 3.0
}
```

### Request Body Fields

| Field    | Type   | Required | Description                  |
| -------- | ------ | -------- | ---------------------------- |
| quantity | number | No       | New quantity (must be >= 1)  |
| price    | number | No       | New unit price (must be > 0) |

**Note:** At least one field (quantity or price) must be provided.

### Response 200 OK

```json
{
  "success": true,
  "message": "Item updated",
  "data": {
    "items": [
      {
        "productId": 1,
        "name": "Milk",
        "price": 3.0,
        "quantity": 5
      }
    ],
    "total": 15.0,
    "itemCount": 5
  }
}
```

### Response 404 Not Found

```json
{
  "success": false,
  "error": {
    "message": "Item with productId 1 not found in cart",
    "statusCode": 404
  }
}
```

### Response 400 Bad Request

```json
{
  "success": false,
  "error": {
    "message": "At least one field (quantity or price) must be provided",
    "statusCode": 400
  }
}
```

---

## DELETE /cart/:productId

Removes a single item from the cart.

### Request

```http
DELETE /api/cart/1
```

### URL Parameters

| Parameter | Type   | Description                 |
| --------- | ------ | --------------------------- |
| productId | number | ID of the product to remove |

### Response 200 OK

```json
{
  "success": true,
  "message": "Item removed from cart",
  "data": {
    "items": [],
    "total": 0,
    "itemCount": 0
  }
}
```

### Response 404 Not Found

```json
{
  "success": false,
  "error": {
    "message": "Item with productId 1 not found in cart",
    "statusCode": 404
  }
}
```

---

## DELETE /cart

Clears the entire cart, removing all items.

### Request

```http
DELETE /api/cart
```

No request body required.

### Response 200 OK

```json
{
  "success": true,
  "message": "Cart cleared",
  "data": {
    "items": [],
    "total": 0,
    "itemCount": 0
  }
}
```

---

## POST /cart/checkout

Processes the checkout: returns cart summary with final total, then clears the cart.

### Request

```http
POST /api/cart/checkout
```

No request body required.

### Response 200 OK

```json
{
  "success": true,
  "message": "Checkout successful",
  "data": {
    "orderId": "ORD-1701234567890",
    "items": [
      {
        "productId": 1,
        "name": "Milk",
        "price": 2.5,
        "quantity": 2
      },
      {
        "productId": 2,
        "name": "Bread",
        "price": 1.99,
        "quantity": 1
      }
    ],
    "total": 6.99,
    "itemCount": 3,
    "checkoutTime": "2024-01-15T10:30:00.000Z"
  }
}
```

### Response 400 Bad Request (Empty Cart)

```json
{
  "success": false,
  "error": {
    "message": "Cannot checkout with an empty cart",
    "statusCode": 400
  }
}
```

---

## Error Response Format

All error responses follow this standard format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### HTTP Status Codes

| Code | Status                | Description                      |
| ---- | --------------------- | -------------------------------- |
| 200  | OK                    | Successful GET, PUT, DELETE      |
| 201  | Created               | Successful POST (item added)     |
| 400  | Bad Request           | Validation error, missing fields |
| 404  | Not Found             | Item not found in cart           |
| 500  | Internal Server Error | Unexpected server error          |

---

## Request/Response Examples

### Example: Complete Shopping Flow

**1. Add first item:**

```http
POST /api/cart
{
  "productId": 1,
  "name": "Milk",
  "price": 2.50,
  "quantity": 2
}
→ 201 Created
```

**2. Add second item:**

```http
POST /api/cart
{
  "productId": 2,
  "name": "Bread",
  "price": 1.99,
  "quantity": 1
}
→ 201 Created
```

**3. Update quantity:**

```http
PUT /api/cart/1
{
  "quantity": 4
}
→ 200 OK
```

**4. Check cart:**

```http
GET /api/cart
→ 200 OK (total: 11.99)
```

**5. Remove item:**

```http
DELETE /api/cart/2
→ 200 OK
```

**6. Checkout:**

```http
POST /api/cart/checkout
→ 200 OK (returns order summary, clears cart)
```

---

## Headers

### Request Headers

| Header       | Value            | Required           |
| ------------ | ---------------- | ------------------ |
| Content-Type | application/json | Yes (for POST/PUT) |

### Response Headers

| Header          | Value               |
| --------------- | ------------------- |
| Content-Type    | application/json    |
| X-Response-Time | Response time in ms |
