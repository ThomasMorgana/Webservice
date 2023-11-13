import { Router } from 'express';
import UserController from '../controllers/user.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import UserService from '../services/user.service';

/**
 * @swagger
 * components:
 *  schemas:
 *    UserAccountDTO:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        password:
 *          type: string
 *      example:
 *          email: test@mail.com
 *          password: password
 *    UserDTO:
 *      allOf:
 *        - $ref: '#/components/schemas/UserAccountDTO'
 *        - type: object
 *          properties:
 *            active:
 *              type: boolean
 *            role:
 *              type: string
 *              enum: [USER, MANAGER, ADMIN]
 *          example:
 *            email: test@mail.com
 *            password: password
 *            active: true
 *            role: USER
 *    User:
 *      allOf:
 *        - $ref: '#/components/schemas/UserDTO'
 *        - type: object
 *          properties:
 *            id:
 *              type: string
 *            createdAt:
 *              type: string
 *            updatedAt:
 *              type: string
 *          example:
 *            email: test@mail.com
 *            password: password
 *            active: true
 *            role: USER
 *            createdAt: 2023-11-10T14:06:00.221Z
 *            updatedAt: 2023-11-10T14:06:00.221Z
 */
class UserRoutes {
  private router = Router();
  private controller = new UserController(new UserService());

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /users/activate:
     *   get:
     *     description: Activate a user account using the activation token
     *     tags: [Users]
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         in: query
     *         description: Activation token
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User account activated successfully
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
     *                 message: Please provide the activation token as a parameter
     */
    this.router.get('/activate', this.controller.activateAccount);

    /**
     * @swagger
     * /users:
     *   post:
     *     description: Create a new admin account
     *     tags: [Users]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       description: User account details
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserAccountDTO'
     *     responses:
     *       201:
     *         description: User account created successfully
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
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
     *                 message: Content cannot be empty!
     */
    this.router.post('/', authenticateToken, this.controller.createAdmin);

    /**
     * @swagger
     * /users:
     *   get:
     *     description: Get all users
     *     tags: [Users]
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: A list of users
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Users'
     */
    this.router.get('/', this.controller.findAll);

    /**
     * @swagger
     * /users/{id}:
     *   get:
     *     description: Get a user by its ID
     *     tags: [Users]
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         in: path
     *         description: User ID
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: A user
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: User not found
     */
    this.router.get('/:id', this.controller.findOne);

    /**
     * @swagger
     * /users/{id}:
     *   patch:
     *     description: Update a user by its ID
     *     tags: [Users]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: User ID
     *         required: true
     *         schema:
     *           type: string
     *     requestBody:
     *       description: Partial user entity
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserDTO'
     *     responses:
     *       200:
     *         description: A user
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
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
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: User not found
     */
    this.router.patch('/:id', authenticateToken, this.controller.update);

    /**
     * @swagger
     * /users/{id}:
     *   delete:
     *     description: Delete a user by its ID
     *     tags: [Users]
     *     produces:
     *       - application/json
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - name: id
     *         in: path
     *         description: User ID
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: User deleted successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: User deleted
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 message:
     *                   type: string
     *               example:
     *                 message: User not found
     */
    this.router.delete('/:id', authenticateToken, this.controller.delete);
  }

  getRouter() {
    return this.router;
  }
}

export default new UserRoutes().getRouter();
