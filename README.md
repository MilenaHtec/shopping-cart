# 🛒 Shopping Cart API

A simple, robust backend REST API for managing a shopping cart built with **Node.js**, **Express**, and **TypeScript**.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Express](https://img.shields.io/badge/Express-5.x-lightgrey)
![Tests](https://img.shields.io/badge/Tests-33%20passed-success)
![Coverage](https://img.shields.io/badge/Coverage-96%25-brightgreen)

---

## ✨ Features

- ✅ **CRUD Operations** - Add, update, remove cart items
- ✅ **Auto Calculation** - Total price calculated automatically
- ✅ **Checkout** - Generate order summary with unique Order ID
- ✅ **In-Memory Storage** - Fast, simple data storage
- ✅ **Error Handling** - Comprehensive validation and error responses
- ✅ **Logging** - Winston logger for all activities
- ✅ **API Documentation** - Interactive Swagger UI
- ✅ **Unit Tests** - 33 tests with 96%+ coverage

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/MilenaHtec/shopping-cart.git
cd shopping-cart

# Install dependencies
npm install
```

### Run the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

### Run Tests

```bash
npm test                 # Run all tests
npm run test:coverage    # Run with coverage report
```

---

## 📖 API Documentation

### Swagger UI

Interactive documentation available at:

```
http://localhost:3001/api-docs
```

### Base URL

```
http://localhost:3001/api
```

---

## 🔗 API Endpoints

| Method   | Endpoint           | Description                |
| -------- | ------------------ | -------------------------- |
| `GET`    | `/cart`            | Get cart contents          |
| `POST`   | `/cart`            | Add item to cart           |
| `PUT`    | `/cart/:productId` | Update item quantity/price |
| `DELETE` | `/cart/:productId` | Remove single item         |
| `DELETE` | `/cart`            | Clear entire cart          |
| `POST`   | `/cart/checkout`   | Process checkout           |

---

## 📝 Usage Examples

### Add Item to Cart

```bash
curl -X POST http://localhost:3001/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "name": "Milk",
    "price": 2.50,
    "quantity": 2
  }'
```

**Response (201 Created):**

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
    "total": 5,
    "itemCount": 2
  }
}
```

### Get Cart Contents

```bash
curl http://localhost:3001/api/cart
```

### Update Item Quantity

```bash
curl -X PUT http://localhost:3001/api/cart/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

### Remove Item

```bash
curl -X DELETE http://localhost:3001/api/cart/1
```

### Checkout

```bash
curl -X POST http://localhost:3001/api/cart/checkout
```

**Response:**

```json
{
  "success": true,
  "message": "Checkout successful",
  "data": {
    "orderId": "ORD-1764326145014-itaoo6dl",
    "items": [...],
    "total": 25.50,
    "itemCount": 8,
    "checkoutTime": "2025-11-28T10:35:45.014Z"
  }
}
```

---

## 📁 Project Structure

```
shopping-cart/
├── src/
│   ├── config/          # Logger & Swagger configuration
│   ├── controllers/     # Request handlers
│   ├── errors/          # Custom error classes
│   ├── middleware/      # Express middleware
│   ├── models/          # TypeScript interfaces
│   ├── routes/          # Route definitions
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── tests/               # Unit tests
├── logs/                # Log files
├── package.json
├── tsconfig.json
└── jest.config.js
```

---

## 🛠 Tech Stack

| Component     | Technology        |
| ------------- | ----------------- |
| Runtime       | Node.js           |
| Framework     | Express.js        |
| Language      | TypeScript        |
| Testing       | Jest              |
| Logging       | Winston           |
| Documentation | Swagger (OpenAPI) |
| Database      | In-Memory         |

---

## 📋 Available Scripts

| Script                  | Description                    |
| ----------------------- | ------------------------------ |
| `npm run dev`           | Start development server       |
| `npm run build`         | Build TypeScript to JavaScript |
| `npm start`             | Start production server        |
| `npm test`              | Run unit tests                 |
| `npm run test:coverage` | Run tests with coverage        |

---

## ⚠️ Error Handling

### Response Format

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

### HTTP Status Codes

| Code  | Description                    |
| ----- | ------------------------------ |
| `200` | Success                        |
| `201` | Created                        |
| `400` | Bad Request / Validation Error |
| `404` | Not Found                      |
| `500` | Internal Server Error          |

---

## ✅ Test Results

```
Test Suites: 1 passed, 1 total
Tests:       33 passed, 33 total
Coverage:    96.84%
```

### Test Categories

- Add item (5 tests)
- Update item (4 tests)
- Remove item (4 tests)
- Clear cart (4 tests)
- Get cart (4 tests)
- Checkout (5 tests)
- Validation (7 tests)

---

## 📚 Documentation

| Document                                 | Description                   |
| ---------------------------------------- | ----------------------------- |
| [requirements.md](./requirements.md)     | Project requirements          |
| [prd.md](./prd.md)                       | Product Requirements Document |
| [architecture.md](./architecture.md)     | System architecture           |
| [data-model.md](./data-model.md)         | Data models                   |
| [api-spec.md](./api-spec.md)             | API specification             |
| [error-handling.md](./error-handling.md) | Error handling                |
| [logging.md](./logging.md)               | Logging strategy              |
| [testing.md](./testing.md)               | Testing strategy              |
| [swagger.md](./swagger.md)               | Swagger setup                 |
| [tasks.md](./tasks.md)                   | Implementation tasks          |
| [rules.md](./rules.md)                   | Development rules             |

---

## 🔧 Health Check

```bash
curl http://localhost:3001/health
```

```json
{
  "status": "ok",
  "timestamp": "2025-11-28T10:35:45.014Z"
}
```

---

## 📄 License

ISC

---

## 👩‍💻 Author

Made with ❤️ by Milena

---

## 🌟 Repository

https://github.com/MilenaHtec/shopping-cart
