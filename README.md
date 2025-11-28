# Shopping Cart API

A simple backend REST API for managing a shopping cart built with Node.js, Express, and TypeScript.

## Features

- ✅ Add, update, and remove shopping cart items
- ✅ Retrieve current cart contents
- ✅ Calculate total price automatically
- ✅ Checkout functionality with order summary
- ✅ In-memory database storage
- ✅ Comprehensive error handling
- ✅ Request/Response logging
- ✅ Swagger API documentation
- ✅ Unit tests with 96%+ coverage

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | TypeScript |
| Testing | Jest |
| Logging | Winston |
| Documentation | Swagger (OpenAPI) |

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/MilenaHtec/shopping-cart.git
cd shopping-cart

# Install dependencies
npm install
```

### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production mode
npm run build
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/cart` | Get cart contents |
| POST | `/api/cart` | Add item to cart |
| PUT | `/api/cart/:productId` | Update item quantity/price |
| DELETE | `/api/cart/:productId` | Remove single item |
| DELETE | `/api/cart` | Clear entire cart |
| POST | `/api/cart/checkout` | Process checkout |

## API Usage Examples

### Add Item to Cart

```bash
curl -X POST http://localhost:3000/api/cart \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "name": "Milk",
    "price": 2.50,
    "quantity": 2
  }'
```

### Get Cart Contents

```bash
curl http://localhost:3000/api/cart
```

### Update Item

```bash
curl -X PUT http://localhost:3000/api/cart/1 \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

### Remove Item

```bash
curl -X DELETE http://localhost:3000/api/cart/1
```

### Checkout

```bash
curl -X POST http://localhost:3000/api/cart/checkout
```

## Documentation

### Swagger UI

Interactive API documentation is available at:

```
http://localhost:3000/api-docs
```

### Health Check

```
http://localhost:3000/health
```

## Project Structure

```
shopping-cart/
├── src/
│   ├── config/          # Configuration (logger, swagger)
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

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build TypeScript to JavaScript |
| `npm start` | Start production server |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "items": [...],
    "total": 5.00,
    "itemCount": 2
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "productId is required",
    "statusCode": 400
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request / Validation Error |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Related Documents

| Document | Description |
|----------|-------------|
| [requirements.md](./requirements.md) | Basic project requirements |
| [prd.md](./prd.md) | Product Requirements Document |
| [architecture.md](./architecture.md) | System architecture and data flow |
| [data-model.md](./data-model.md) | Data model specifications |
| [api-spec.md](./api-spec.md) | Complete API specification |
| [error-handling.md](./error-handling.md) | Error handling strategy |
| [logging.md](./logging.md) | Logging implementation |
| [testing.md](./testing.md) | Testing strategy |
| [swagger.md](./swagger.md) | Swagger setup guide |
| [tasks.md](./tasks.md) | Implementation checklist |
| [rules.md](./rules.md) | Development best practices |

## License

ISC
