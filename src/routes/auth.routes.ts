import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1YmI5ZWFjLWRhOWMtNGI0Ni04MWMyLTExMzgyYjU3ZjMxNSIsImlhdCI6MTY5OTY0NjIyMiwiZXhwIjoxNjk5NjQ2NTIyfQ._jfobRs1prGVZpcRBF5l3NGKH9_pqPuQG2Y2FAyUlQ0
 *
 * security:
 *   - bearerAuth: []
 */
class AuthRoutes {
  private router = Router();
  private controller = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * @swagger
     * /auth/login:
     *   post:
     *     description: Login a user
     *     tags: [Authentication]
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: User credentials
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserAccountDTO'
     *     responses:
     *       200:
     *         description: User logged in successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *                 token:
     *                   type: string
     *                 refreshToken:
     *                   type: string
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: Password and email must be present and not empty
     *       404:
     *         description: User not found
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: Those credentials don't match any users
     */
    this.router.post('/login', this.controller.login);

    /**
     * @swagger
     * /auth/register:
     *   post:
     *     description: Register a new user
     *     tags: [Authentication]
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: User credentials
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/UserAccountDTO'
     *     responses:
     *       200:
     *         description: User registered successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 user:
     *                   $ref: '#/components/schemas/User'
     *                 token:
     *                   type: string
     *                 refreshToken:
     *                   type: string
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: Password and email must be present and not empty
     */
    this.router.post('/register', this.controller.register);

    /**
     * @swagger
     * /auth/refresh-token:
     *   post:
     *     description: Refresh the access token using a refresh token
     *     tags: [Authentication]
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: Refresh token
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               refreshToken:
     *                 type: string
     *             example:
     *               refreshToken: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1YmI5ZWFjLWRhOWMtNGI0Ni04MWMyLTExMzgyYjU3ZjMxNSIsImlhdCI6MTY5OTY0NjIyMiwiZXhwIjoxNzMxMjAzODIyfQ.72juWGWdM2DjBzA9UwMOOIkCbtT2cuUI-TyZhdH_bcc
     *     responses:
     *       200:
     *         description: Access token refreshed successfully
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 accessToken:
     *                   type: string
     *                 refreshToken:
     *                   type: string
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: Please send the refreshToken in the body
     *       401:
     *         description: Unauthorized
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: Invalid auth token
     */
    this.router.post('/refresh-token', this.controller.generateRefreshToken);

    /**
     * @swagger
     * /auth/reset-token:
     *   post:
     *     description: Generate a reset token for a user
     *     tags: [Authentication]
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: User email
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               email:
     *                 type: string
     *             example:
     *               email: user@example.com
     *     responses:
     *       200:
     *         description: Reset token generated successfully
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: Please send the user email in the body
     */
    this.router.post('/reset-token', this.controller.generateResetToken);

    /**
     * @swagger
     * /auth/reset-password:
     *   post:
     *     description: Reset user password using a reset token
     *     tags: [Authentication]
     *     produces:
     *       - application/json
     *     requestBody:
     *       description: Reset token and new password
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               token:
     *                 type: string
     *               password:
     *                 type: string
     *             example:
     *               token: your_reset_token_here
     *               password: new_password123
     *     responses:
     *       200:
     *         description: Password reset successful
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/User'
     *       400:
     *         description: Bad request
     *         content:
     *           application/json:
     *             schema:
     *               type: string
     *               example: Please send the token and the password
     */
    this.router.post('/reset-password', this.controller.resetPassword);
  }

  getRouter() {
    return this.router;
  }
}

export default new AuthRoutes().getRouter();
