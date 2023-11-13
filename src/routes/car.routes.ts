import { Router } from 'express';
import CarController from '../controllers/car.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import CarService from '../services/car.service';
import { enableCache } from '../middlewares/cache.middleware';

/**
 * @swagger
 * components:
 *   schemas:
 *     CarDTO:
 *       type: object
 *       properties:
 *         model:
 *           type: string
 *         brand:
 *           type: string
 *         year:
 *           type: string
 *         userId:
 *           type: integer
 *         garageId:
 *           type: integer
 *       example:
 *         model: 307RS
 *         brand: Peugeot
 *         year: 2022
 *         userId: 55802f8a-c8e8-4636-87b0-6734bfa94c11
 *         garageId: 2
 *     Car:
 *       allOf:
 *         - $ref: '#/components/schemas/CarDTO'
 *         - type: object
 *           properties:
 *             id:
 *               type: integer
 *             createdAt:
 *               type: string
 *             updatedAt:
 *               type: string
 *       example:
 *         id: 1
 *         createdAt: 2023-11-10T14:06:00.221Z
 *         updatedAt: 2023-11-10T14:06:00.221Z
 *         model: 307RS
 *         brand: Peugeot
 *         year: 2022
 *         userId: 55802f8a-c8e8-4636-87b0-6734bfa94c11
 *         garageId: 2
 *     Cars:
 *       type: array
 *       items:
 *         $ref:'#/components/schemas/car'
 *       examples:
 *         - id: 1
 *           createdAt: 2023-11-10T14:06:00.221Z
 *           updatedAt: 2023-11-10T14:06:00.221Z
 *           model: 307RS
 *           brand: Peugeot
 *           year: 2022
 *           userId: 55802f83-c8e8-4636-87b0-6734bfa94c11
 *           garageId: 2
 *         - id: 2
 *           createdAt: 2023-11-10T14:06:00.221Z
 *           updatedAt: 2023-11-10T14:06:00.221Z
 *           model: 307RT
 *           brand: Peugeot
 *           year: 2023
 *           userId: 55802f8a-c8e8-4636-87b0-6734bfa94c11
 *           garageId: 3
 *
 */
class CarRoutes {
  private router = Router();
  private controller = new CarController(new CarService());

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /cars:
     *   post:
     *     description: Create a new car
     *     tags: [Cars]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       description: Partial car entity
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CarDTO'
     *     responses:
     *       200:
     *         description: A car
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Car'
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
     * /cars:
     *   get:
     *     description: Get all cars
     *     tags: [Cars]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of cars
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Cars'
     */
    this.router.get('/', enableCache, this.controller.findAll);

    /**
     * @swagger
     * /cars/{id}:
     *   get:
     *     description: Get one car by its ID
     *     tags: [Cars]
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Car ID
     *         required: true
     *         schema:
     *           type: integer
     *     responses:
     *       200:
     *         description: A car
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Car'
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
     *         description: No car found for this ID
     *         content:
     *           application/json:
     *             schema:
     *               schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Car not found
     */
    this.router.get('/:id', this.controller.findOne);

    /**
     * @swagger
     * /cars/{id}:
     *   patch:
     *     description: Edit part of one car by its ID
     *     tags: [Cars]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Car ID
     *         required: true
     *         schema:
     *           type: integer
     *     requestBody:
     *       description: Partial car entity
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/CarDTO'
     *     responses:
     *       200:
     *         description: A car
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Car deleted
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
     *         description: No car found for this ID
     *         content:
     *           application/json:
     *             schema:
     *               schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Car not found
     */
    this.router.patch('/:id', authenticateToken, this.controller.update);

    /**
     * @swagger
     * /cars/{id}:
     *   delete:
     *     description: Delete one car by its ID
     *     tags: [Cars]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: Car ID
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
     *                 message: Car deleted
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
     *         description: No car found for this ID
     *         content:
     *           application/json:
     *             schema:
     *               schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: Car not found
     */
    this.router.delete('/:id', authenticateToken, this.controller.delete);
  }

  getRouter() {
    return this.router;
  }
}

export default new CarRoutes().getRouter();
