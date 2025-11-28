# Swagger Documentation - Shopping Cart API

## Overview

This document describes how to set up and use Swagger (OpenAPI) documentation for the Shopping Cart API.

---

## Setup

### Install Dependencies

```bash
npm install swagger-ui-express swagger-jsdoc
npm install --save-dev @types/swagger-ui-express @types/swagger-jsdoc
```

### Swagger Configuration

```typescript
// src/config/swagger.ts
import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shopping Cart API",
      version: "1.0.0",
      description: "A simple backend API for managing a shopping cart",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api",
        description: "Development server",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
```

### Register Swagger in Express

```typescript
// src/app.ts
import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const app = express();

// Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// JSON spec endpoint
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});
```

### Access Swagger UI

```
http://localhost:3000/api-docs
```

---

## OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: Shopping Cart API
  version: 1.0.0
  description: A simple backend API for managing a shopping cart

servers:
  - url: http://localhost:3000/api
    description: Development server

paths:
  /cart:
    get:
      summary: Get cart contents
      description: Returns full cart contents with all items and calculated total
      tags:
        - Cart
      responses:
        "200":
          description: Successful response
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CartResponse"

    post:
      summary: Add item to cart
      description: Adds a new item to the cart or increments quantity if item exists
      tags:
        - Cart
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CartItemInput"
      responses:
        "201":
          description: Item added successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CartResponse"
        "400":
          description: Validation error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

    delete:
      summary: Clear cart
      description: Removes all items from the cart
      tags:
        - Cart
      responses:
        "200":
          description: Cart cleared successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CartResponse"

  /cart/{productId}:
    put:
      summary: Update cart item
      description: Updates the quantity or price of an existing item
      tags:
        - Cart
      parameters:
        - name: productId
          in: path
          required: true
          schema:
            type: integer
          description: Product ID to update
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CartItemUpdate"
      responses:
        "200":
          description: Item updated successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CartResponse"
        "400":
          description: Validation error
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"
        "404":
          description: Item not found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

    delete:
      summary: Remove item from cart
      description: Removes a single item from the cart
      tags:
        - Cart
      parameters:
        - name: productId
          in: path
          required: true
          schema:
            type: integer
          description: Product ID to remove
      responses:
        "200":
          description: Item removed successfully
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CartResponse"
        "404":
          description: Item not found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

  /cart/checkout:
    post:
      summary: Checkout
      description: Processes checkout, returns order summary, and clears the cart
      tags:
        - Cart
      responses:
        "200":
          description: Checkout successful
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CheckoutResponse"
        "400":
          description: Cart is empty
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

components:
  schemas:
    CartItem:
      type: object
      properties:
        productId:
          type: integer
          description: Unique product identifier
          example: 1
        name:
          type: string
          description: Product name
          example: "Milk"
        price:
          type: number
          format: float
          description: Unit price
          example: 2.5
        quantity:
          type: integer
          description: Quantity in cart
          example: 2
      required:
        - productId
        - name
        - price
        - quantity

    CartItemInput:
      type: object
      properties:
        productId:
          type: integer
          description: Unique product identifier
          example: 1
        name:
          type: string
          description: Product name
          example: "Milk"
        price:
          type: number
          format: float
          description: Unit price (must be > 0)
          example: 2.5
        quantity:
          type: integer
          description: Quantity to add (must be >= 1)
          example: 2
      required:
        - productId
        - name
        - price
        - quantity

    CartItemUpdate:
      type: object
      properties:
        quantity:
          type: integer
          description: New quantity (must be >= 1)
          example: 5
        price:
          type: number
          format: float
          description: New price (must be > 0)
          example: 3.0

    Cart:
      type: object
      properties:
        items:
          type: array
          items:
            $ref: "#/components/schemas/CartItem"
        total:
          type: number
          format: float
          description: Total price of all items
          example: 6.99
        itemCount:
          type: integer
          description: Total quantity of items
          example: 3

    CartResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        message:
          type: string
          example: "Item added to cart"
        data:
          $ref: "#/components/schemas/Cart"

    CheckoutResponse:
      type: object
      properties:
        success:
          type: boolean
          example: true
        message:
          type: string
          example: "Checkout successful"
        data:
          type: object
          properties:
            orderId:
              type: string
              example: "ORD-1701234567890"
            items:
              type: array
              items:
                $ref: "#/components/schemas/CartItem"
            total:
              type: number
              format: float
              example: 6.99
            itemCount:
              type: integer
              example: 3
            checkoutTime:
              type: string
              format: date-time
              example: "2024-01-15T10:30:00.000Z"

    ErrorResponse:
      type: object
      properties:
        success:
          type: boolean
          example: false
        error:
          type: object
          properties:
            message:
              type: string
              example: "productId is required"
            statusCode:
              type: integer
              example: 400
```

---

## JSDoc Annotations

Add these annotations to your route handlers for automatic Swagger generation:

### GET /cart

```typescript
/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get cart contents
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart contents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */
router.get("/cart", cartController.getCart);
```

### POST /cart

```typescript
/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItemInput'
 *     responses:
 *       201:
 *         description: Item added successfully
 *       400:
 *         description: Validation error
 */
router.post("/cart", cartController.addItem);
```

### PUT /cart/:productId

```typescript
/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: Update cart item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItemUpdate'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Item not found
 */
router.put("/cart/:productId", cartController.updateItem);
```

### DELETE /cart/:productId

```typescript
/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: Item not found
 */
router.delete("/cart/:productId", cartController.removeItem);
```

### DELETE /cart

```typescript
/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear entire cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 */
router.delete("/cart", cartController.clearCart);
```

### POST /cart/checkout

```typescript
/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Checkout successful
 *       400:
 *         description: Cart is empty
 */
router.post("/cart/checkout", cartController.checkout);
```

---

## Schema Definitions in JSDoc

```typescript
/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - name
 *         - price
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: Unique product identifier
 *         name:
 *           type: string
 *           description: Product name
 *         price:
 *           type: number
 *           description: Unit price
 *         quantity:
 *           type: integer
 *           description: Quantity in cart
 */
```

---

## API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /cart | Get cart contents |
| POST | /cart | Add item to cart |
| PUT | /cart/{productId} | Update item |
| DELETE | /cart/{productId} | Remove item |
| DELETE | /cart | Clear cart |
| POST | /cart/checkout | Checkout |

---

## Testing with Swagger UI

1. Start the server: `npm run dev`
2. Open browser: `http://localhost:3000/api-docs`
3. Click on any endpoint to expand
4. Click "Try it out" to test
5. Fill in parameters/body
6. Click "Execute"
7. View response
