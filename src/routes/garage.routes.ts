import { Router } from 'express';
import GarageController from '../controllers/garage.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { GarageService } from '../services/garage.service';

/**
 * @swagger
 * components:
 *   schemas:
 *     GarageDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         spaces:
 *           type: integer
 *       example:
 *         name: My Garage
 *         spaces: 23
 *     Garage:
 *       allOf:
 *         - $ref: '#/components/schemas/GarageDTO'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *             createdAt:
 *               type: string
 *             updatedAt:
 *                type: string
 *             userId:
 *                type: string
 *       example:
 *         id: 1
 *         createdAt: 2023-11-10T14:06:00.221Z
 *         updatedAt: 2023-11-10T14:06:00.221Z
 *         name: My Garage
 *         spaces: 23
 *         userId: 55802f8a-c8e8-4636-87b0-6734bfa94c11
 */
class GarageRoutes {
  private router = Router();
  private controller = new GarageController(new GarageService());

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /garages:
     *   post:
     *     description: Create a new garage
     *     tags: [Garages]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       description: Partial garage entity
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/GarageDTO'
     *     responses:
     *       200:
     *         description: A garage
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Garage'
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
     *                 message: Content can not be empty!
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Invalid auth token
     */
    this.router.post('/', authenticateToken, this.controller.create);

    /**
     * @swagger
     * /garages:
     *   get:
     *     description: Get all garages
     *     tags: [Garages]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of garages
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Garage'
     *             example:
     *               - id: 1
     *                 createdAt: 2023-11-10T14:06:00.221Z
     *                 updatedAt: 2023-11-10T14:06:00.221Z
     *                 name: My Garage
     *                 spaces: 23
     *                 userId: 55802f8a-c8e8-4636-87b0-6734bfa94c11
     *               - id: 2
     *                 createdAt: 2023-11-10T14:06:00.221Z
     *                 updatedAt: 2023-11-10T14:06:00.221Z
     *                 name: Another Garage
     *                 spaces: 23
     *                 userId: 55802f8a-c8e8-4636-87b0-6734bfa94c11
     */
    this.router.get('/', this.controller.findAll);

    /**
     * @swagger
     * /garages/{id}:
     *   get:
     *     description: Get one garage by its ID
     *     tags: [Garages]
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Garage ID
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: A garage
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Garage'
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
     *                 message: ${id} is invalid
     *       404:
     *         description: No garage found for this ID
     *         content:
     *           application/json:
     *             schema:
     *               schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Garage not found
     */
    this.router.get('/:id', this.controller.findOne);

    /**
     * @swagger
     * /garages/{id}:
     *   patch:
     *     description: Edit part of one garage by its ID
     *     tags: [Garages]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Garage ID
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Partial garage entity
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/GarageDTO'
     *     responses:
     *       200:
     *         description: A garage
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Garage updated
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
     *                 message: You must provide a body
     *       404:
     *         description: No garage found for this ID
     *         content:
     *           application/json:
     *             schema:
     *               schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Garage not found
     */
    this.router.patch('/:id', authenticateToken, this.controller.update);

    /**
     * @swagger
     * /garages/{id}:
     *   delete:
     *     description: Delete one garage by its ID
     *     tags: [Garages]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Garage ID
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: Success
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Garage deleted
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
     *                 message: ${id} is invalid
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Invalid auth token
     *       404:
     *         description: No garage found for
     */
    this.router.delete('/:id', authenticateToken, this.controller.delete);
  }

  getRouter() {
    return this.router;
  }
}

export default new GarageRoutes().getRouter();
