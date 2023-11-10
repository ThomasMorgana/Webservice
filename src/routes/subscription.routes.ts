import { Router } from 'express';
import SubscriptionController from '../controllers/subscription.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

/**
 * @swagger
 * components:
 *   schemas:
 *     SubscriptionDTO:
 *       type: object
 *       properties:
 *         active:
 *           type: boolean
 *       example:
 *         active: true
 *
 *     Subscription:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         active:
 *           type: boolean
 *         createdAt:
 *           type: string
 *         updatedAt:
 *           type: string
 *       example:
 *         id: 55802f8a-c8e8-4636-87b0-6734bfa94c11
 *         userId: 55802f8a-c8e8-4636-87b0-6734bfa94c11
 *         active: true
 *         createdAt: 2023-11-10T14:06:00.221Z
 *         updatedAt: 2023-11-10T14:06:00.221Z
 *
 *     Subscriptions:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Subscription'
 *       examples:
 *         - id: 55802f8a-c8e8-4636-87b0-6734bfa94c11
 *           userId: 55802f8a-c8e8-4636-87b0-6734bfa94c11
 *           active: true
 *           createdAt: 2023-11-10T14:06:00.221Z
 *           updatedAt: 2023-11-10T14:06:00.221Z
 *         - id: 45802f8a-c8e8-4636-87b0-6734bfa94c11
 *           userId: 55802f8a-c8e8-4636-87b0-6734bfa94c11
 *           active: true
 *           createdAt: 2023-11-10T14:06:00.221Z
 *           updatedAt: 2023-11-10T14:06:00.221Z
 */
class SubscriptionRoutes {
  private router = Router();
  private controller = new SubscriptionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /subscriptions:
     *   post:
     *     description: Create a new subscription
     *     tags: [Subscriptions]
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: User ID is required in the request body
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubscriptionDTO'
     *     responses:
     *       201:
     *         description: A new subscription created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Subscription'
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Content can not be empty or userId is missing
     */
    this.router.post('/', this.controller.create);

    this.router.post('/stripe-hook', this.controller.handleStripeHook);

    /**
     * @swagger
     * /subscriptions:
     *   get:
     *     description: Get all subscriptions
     *     tags: [Subscriptions]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of subscriptions
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Subscriptions'
     */
    this.router.get('/', this.controller.findAll);

    /**
     * @swagger
     * /subscriptions/{id}:
     *   get:
     *     description: Get a subscription by its ID
     *     tags: [Subscriptions]
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Subscription ID
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A subscription
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Subscription'
     *       404:
     *         description: Subscription not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Subscription not found
     */
    this.router.get('/:id', this.controller.findOne);

    /**
     * @swagger
     * /subscriptions/{id}:
     *   patch:
     *     description: Update a subscription by its ID
     *     tags: [Subscriptions]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Subscription ID
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       description: Partial subscription entity
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/SubscriptionDTO'
     *     responses:
     *       200:
     *         description: A subscription
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Subscription'
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: You must provide a valid body
     *       404:
     *         description: Subscription not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Subscription not found
     */
    this.router.patch('/:id', authenticateToken, this.controller.update);

    /**
     * @swagger
     * /subscriptions/{id}:
     *   delete:
     *     description: Delete a subscription by its ID
     *     tags: [Subscriptions]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Subscription ID
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: Subscription deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Subscription with id=${id} deleted
     *       404:
     *         description: Subscription not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Subscription not found
     */
    this.router.delete('/:id', authenticateToken, this.controller.delete);
  }

  getRouter() {
    return this.router;
  }
}

export default new SubscriptionRoutes().getRouter();
