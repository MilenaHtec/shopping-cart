import { Router } from "express";
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  checkout,
} from "../controllers";

const router = Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get cart contents
 *     description: Returns full cart contents with all items and calculated total
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart contents retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */
router.get("/", getCart);

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add item to cart
 *     description: Adds a new item to the cart or increments quantity if item exists
 *     tags: [Cart]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddItemInput'
 *     responses:
 *       201:
 *         description: Item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", addItem);

/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: Update cart item
 *     description: Updates the quantity or price of an existing item
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateItemInput'
 *     responses:
 *       200:
 *         description: Item updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:productId", updateItem);

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove item from cart
 *     description: Removes a single item from the cart
 *     tags: [Cart]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID to remove
 *     responses:
 *       200:
 *         description: Item removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 *       404:
 *         description: Item not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:productId", removeItem);

/**
 * @swagger
 * /cart:
 *   delete:
 *     summary: Clear entire cart
 *     description: Removes all items from the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartResponse'
 */
router.delete("/", clearCart);

/**
 * @swagger
 * /cart/checkout:
 *   post:
 *     summary: Checkout
 *     description: Processes checkout, returns order summary, and clears the cart
 *     tags: [Cart]
 *     responses:
 *       200:
 *         description: Checkout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CheckoutResponse'
 *       400:
 *         description: Cart is empty
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/checkout", checkout);

export default router;

