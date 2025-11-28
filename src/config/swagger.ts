import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Shopping Cart API",
      version: "1.0.0",
      description:
        "A simple backend API for managing a shopping cart with CRUD operations",
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
    components: {
      schemas: {
        CartItem: {
          type: "object",
          required: ["productId", "name", "price", "quantity"],
          properties: {
            productId: {
              type: "integer",
              description: "Unique product identifier",
              example: 1,
            },
            name: {
              type: "string",
              description: "Product name",
              example: "Milk",
            },
            price: {
              type: "number",
              format: "float",
              description: "Unit price",
              example: 2.5,
            },
            quantity: {
              type: "integer",
              description: "Quantity in cart",
              example: 2,
            },
          },
        },
        CartResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Item added to cart",
            },
            data: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/CartItem",
                  },
                },
                total: {
                  type: "number",
                  format: "float",
                  example: 5.0,
                },
                itemCount: {
                  type: "integer",
                  example: 2,
                },
              },
            },
          },
        },
        CheckoutResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true,
            },
            message: {
              type: "string",
              example: "Checkout successful",
            },
            data: {
              type: "object",
              properties: {
                orderId: {
                  type: "string",
                  example: "ORD-1701234567890",
                },
                items: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/CartItem",
                  },
                },
                total: {
                  type: "number",
                  format: "float",
                  example: 6.99,
                },
                itemCount: {
                  type: "integer",
                  example: 3,
                },
                checkoutTime: {
                  type: "string",
                  format: "date-time",
                  example: "2024-01-15T10:30:00.000Z",
                },
              },
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                message: {
                  type: "string",
                  example: "productId is required",
                },
                statusCode: {
                  type: "integer",
                  example: 400,
                },
              },
            },
          },
        },
        AddItemInput: {
          type: "object",
          required: ["productId", "name", "price", "quantity"],
          properties: {
            productId: {
              type: "integer",
              description: "Unique product identifier",
              example: 1,
            },
            name: {
              type: "string",
              description: "Product name",
              example: "Milk",
            },
            price: {
              type: "number",
              format: "float",
              description: "Unit price (must be > 0)",
              example: 2.5,
            },
            quantity: {
              type: "integer",
              description: "Quantity to add (must be >= 1)",
              example: 2,
            },
          },
        },
        UpdateItemInput: {
          type: "object",
          properties: {
            quantity: {
              type: "integer",
              description: "New quantity (must be >= 1)",
              example: 5,
            },
            price: {
              type: "number",
              format: "float",
              description: "New price (must be > 0)",
              example: 3.0,
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);

