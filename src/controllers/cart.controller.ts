import { Request, Response } from "express";
import { cartService } from "../services";
import asyncHandler from "../utils/asyncHandler";

/**
 * GET /cart
 * Get cart contents
 */
export const getCart = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cart = cartService.getCart();

  res.status(200).json({
    success: true,
    data: cart,
  });
});

/**
 * POST /cart
 * Add item to cart
 */
export const addItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { productId, name, price, quantity } = req.body;
  
  const cart = cartService.addItem({ productId, name, price, quantity });

  res.status(201).json({
    success: true,
    message: "Item added to cart",
    data: cart,
  });
});

/**
 * PUT /cart/:productId
 * Update item quantity or price
 */
export const updateItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.productId, 10);
  const { quantity, price } = req.body;

  const cart = cartService.updateItem(productId, { quantity, price });

  res.status(200).json({
    success: true,
    message: "Item updated",
    data: cart,
  });
});

/**
 * DELETE /cart/:productId
 * Remove item from cart
 */
export const removeItem = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const productId = parseInt(req.params.productId, 10);

  const cart = cartService.removeItem(productId);

  res.status(200).json({
    success: true,
    message: "Item removed from cart",
    data: cart,
  });
});

/**
 * DELETE /cart
 * Clear entire cart
 */
export const clearCart = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const cart = cartService.clearCart();

  res.status(200).json({
    success: true,
    message: "Cart cleared",
    data: cart,
  });
});

/**
 * POST /cart/checkout
 * Process checkout
 */
export const checkout = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const orderSummary = cartService.checkout();

  res.status(200).json({
    success: true,
    message: "Checkout successful",
    data: orderSummary,
  });
});

