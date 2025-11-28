import { v4 as uuidv4 } from "uuid";
import {
  Cart,
  CartItem,
  CartResponse,
  CheckoutResponse,
  AddItemInput,
  UpdateItemInput,
} from "../models";
import { ValidationError, NotFoundError, BadRequestError } from "../errors";
import logger from "../config/logger";

/**
 * Cart Service - Contains all business logic for cart operations
 */
class CartService {
  private cart: Cart;

  constructor() {
    this.cart = { items: [] };
  }

  /**
   * Calculate total price of all items in cart
   */
  private calculateTotal(): number {
    const total = this.cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    // Round to 2 decimal places
    return Math.round(total * 100) / 100;
  }

  /**
   * Calculate total item count in cart
   */
  private calculateItemCount(): number {
    return this.cart.items.reduce((count, item) => count + item.quantity, 0);
  }

  /**
   * Find item index by productId
   */
  private findItemIndex(productId: number): number {
    return this.cart.items.findIndex((item) => item.productId === productId);
  }

  /**
   * Validate item input for adding to cart
   */
  private validateAddItemInput(input: AddItemInput): void {
    if (!input.productId || typeof input.productId !== "number") {
      throw new ValidationError("productId is required and must be a number");
    }
    if (!input.name || typeof input.name !== "string" || input.name.trim() === "") {
      throw new ValidationError("name is required and must be a non-empty string");
    }
    if (typeof input.price !== "number" || input.price <= 0) {
      throw new ValidationError("price must be greater than 0");
    }
    if (typeof input.quantity !== "number" || input.quantity < 1 || !Number.isInteger(input.quantity)) {
      throw new ValidationError("quantity must be at least 1 and must be an integer");
    }
  }

  /**
   * Validate update item input
   */
  private validateUpdateInput(input: UpdateItemInput): void {
    if (input.quantity === undefined && input.price === undefined) {
      throw new ValidationError("At least one field (quantity or price) must be provided");
    }
    if (input.quantity !== undefined) {
      if (typeof input.quantity !== "number" || input.quantity < 1 || !Number.isInteger(input.quantity)) {
        throw new ValidationError("quantity must be at least 1 and must be an integer");
      }
    }
    if (input.price !== undefined) {
      if (typeof input.price !== "number" || input.price <= 0) {
        throw new ValidationError("price must be greater than 0");
      }
    }
  }

  /**
   * Get current cart contents with computed properties
   */
  getCart(): CartResponse {
    logger.info("Getting cart contents", { itemCount: this.cart.items.length });
    
    return {
      items: [...this.cart.items],
      total: this.calculateTotal(),
      itemCount: this.calculateItemCount(),
    };
  }

  /**
   * Add item to cart or increment quantity if exists
   */
  addItem(input: AddItemInput): CartResponse {
    logger.info("Adding item to cart", { productId: input.productId, name: input.name });

    // Validate input
    this.validateAddItemInput(input);

    const existingIndex = this.findItemIndex(input.productId);

    if (existingIndex >= 0) {
      // Item exists - increment quantity
      this.cart.items[existingIndex].quantity += input.quantity;
      logger.info("Incremented quantity for existing item", {
        productId: input.productId,
        newQuantity: this.cart.items[existingIndex].quantity,
      });
    } else {
      // New item - add to cart
      const newItem: CartItem = {
        productId: input.productId,
        name: input.name.trim(),
        price: input.price,
        quantity: input.quantity,
      };
      this.cart.items.push(newItem);
      logger.info("Added new item to cart", { productId: input.productId });
    }

    return this.getCart();
  }

  /**
   * Update item quantity or price
   */
  updateItem(productId: number, updates: UpdateItemInput): CartResponse {
    logger.info("Updating cart item", { productId, updates });

    // Validate input
    this.validateUpdateInput(updates);

    const index = this.findItemIndex(productId);

    if (index < 0) {
      throw new NotFoundError(`Item with productId ${productId} not found in cart`);
    }

    // Apply updates
    if (updates.quantity !== undefined) {
      this.cart.items[index].quantity = updates.quantity;
    }
    if (updates.price !== undefined) {
      this.cart.items[index].price = updates.price;
    }

    logger.info("Cart item updated", { productId });

    return this.getCart();
  }

  /**
   * Remove item from cart
   */
  removeItem(productId: number): CartResponse {
    logger.info("Removing item from cart", { productId });

    const index = this.findItemIndex(productId);

    if (index < 0) {
      throw new NotFoundError(`Item with productId ${productId} not found in cart`);
    }

    this.cart.items.splice(index, 1);
    logger.info("Item removed from cart", { productId });

    return this.getCart();
  }

  /**
   * Clear all items from cart
   */
  clearCart(): CartResponse {
    logger.info("Clearing cart", { itemCount: this.cart.items.length });

    this.cart.items = [];

    logger.info("Cart cleared");

    return this.getCart();
  }

  /**
   * Process checkout - returns order summary and clears cart
   */
  checkout(): CheckoutResponse {
    logger.info("Processing checkout", { itemCount: this.cart.items.length });

    if (this.cart.items.length === 0) {
      throw new BadRequestError("Cannot checkout with an empty cart");
    }

    const orderSummary: CheckoutResponse = {
      orderId: `ORD-${Date.now()}-${uuidv4().slice(0, 8)}`,
      items: [...this.cart.items],
      total: this.calculateTotal(),
      itemCount: this.calculateItemCount(),
      checkoutTime: new Date().toISOString(),
    };

    // Clear cart after checkout
    this.cart.items = [];

    logger.info("Checkout completed", {
      orderId: orderSummary.orderId,
      total: orderSummary.total,
    });

    return orderSummary;
  }

  /**
   * Reset cart - for testing purposes
   */
  reset(): void {
    this.cart = { items: [] };
  }
}

// Export singleton instance
export const cartService = new CartService();

// Export class for testing
export { CartService };

