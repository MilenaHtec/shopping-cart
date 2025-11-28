# Shopping Cart API

A simple backend REST API for managing a shopping cart built with Node.js, Express, and TypeScript.

## Features

- Add, update, and remove shopping cart items
- Retrieve current cart contents
- Calculate total price
- Checkout functionality
- In-memory database storage

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Testing:** Jest
- **Logging:** Winston
- **Documentation:** Swagger (OpenAPI)

## Quick Start

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Run tests
npm test

# Build for production
npm run build
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cart | Get cart contents |
| POST | /api/cart | Add item to cart |
| PUT | /api/cart/:productId | Update item |
| DELETE | /api/cart/:productId | Remove item |
| DELETE | /api/cart | Clear cart |
| POST | /api/cart/checkout | Checkout |

## Documentation

- **Swagger UI:** http://localhost:3000/api-docs

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
