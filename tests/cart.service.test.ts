import { CartService } from "../src/services/cart.service";
import { ValidationError, NotFoundError, BadRequestError } from "../src/errors";

describe("CartService", () => {
  let cartService: CartService;

  beforeEach(() => {
    cartService = new CartService();
  });

  // ==================== ADD ITEM TESTS ====================

  describe("addItem", () => {
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

    test("should trim whitespace from name", () => {
      const item = { productId: 1, name: "  Milk  ", price: 2.5, quantity: 2 };

      const result = cartService.addItem(item);

      expect(result.items[0].name).toBe("Milk");
    });
  });

  // ==================== UPDATE ITEM TESTS ====================

  describe("updateItem", () => {
    beforeEach(() => {
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
      }).toThrow(NotFoundError);
      expect(() => {
        cartService.updateItem(999, { quantity: 5 });
      }).toThrow("Item with productId 999 not found in cart");
    });
  });

  // ==================== REMOVE ITEM TESTS ====================

  describe("removeItem", () => {
    beforeEach(() => {
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
      }).toThrow(NotFoundError);
      expect(() => {
        cartService.removeItem(999);
      }).toThrow("Item with productId 999 not found in cart");
    });
  });

  // ==================== CLEAR CART TESTS ====================

  describe("clearCart", () => {
    beforeEach(() => {
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

  // ==================== GET CART TESTS ====================

  describe("getCart", () => {
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

  // ==================== CHECKOUT TESTS ====================

  describe("checkout", () => {
    beforeEach(() => {
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

    test("should throw BadRequestError when cart is empty", () => {
      cartService.clearCart();

      expect(() => {
        cartService.checkout();
      }).toThrow(BadRequestError);
      expect(() => {
        cartService.checkout();
      }).toThrow("Cannot checkout with an empty cart");
    });
  });

  // ==================== VALIDATION TESTS ====================

  describe("Validation", () => {
    test("should throw ValidationError for missing productId", () => {
      expect(() => {
        cartService.addItem({
          name: "Milk",
          price: 2.5,
          quantity: 2,
        } as any);
      }).toThrow(ValidationError);
    });

    test("should throw ValidationError for missing name", () => {
      expect(() => {
        cartService.addItem({
          productId: 1,
          price: 2.5,
          quantity: 2,
        } as any);
      }).toThrow(ValidationError);
    });

    test("should throw ValidationError for empty name", () => {
      expect(() => {
        cartService.addItem({
          productId: 1,
          name: "   ",
          price: 2.5,
          quantity: 2,
        });
      }).toThrow(ValidationError);
    });

    test("should throw ValidationError for price <= 0", () => {
      expect(() => {
        cartService.addItem({
          productId: 1,
          name: "Milk",
          price: 0,
          quantity: 2,
        });
      }).toThrow(ValidationError);
      expect(() => {
        cartService.addItem({
          productId: 1,
          name: "Milk",
          price: -1,
          quantity: 2,
        });
      }).toThrow(ValidationError);
    });

    test("should throw ValidationError for quantity < 1", () => {
      expect(() => {
        cartService.addItem({
          productId: 1,
          name: "Milk",
          price: 2.5,
          quantity: 0,
        });
      }).toThrow(ValidationError);
    });

    test("should throw ValidationError for non-integer quantity", () => {
      expect(() => {
        cartService.addItem({
          productId: 1,
          name: "Milk",
          price: 2.5,
          quantity: 1.5,
        });
      }).toThrow(ValidationError);
    });

    test("should throw ValidationError for update with no fields", () => {
      cartService.addItem({
        productId: 1,
        name: "Milk",
        price: 2.5,
        quantity: 2,
      });

      expect(() => {
        cartService.updateItem(1, {});
      }).toThrow(ValidationError);
      expect(() => {
        cartService.updateItem(1, {});
      }).toThrow("At least one field (quantity or price) must be provided");
    });
  });
});

