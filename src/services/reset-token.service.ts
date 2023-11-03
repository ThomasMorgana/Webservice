import { PrismaClient, ResetToken, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { ResetTokenInvalidError, UserNotFoundError } from '../errors/auth.error';

const prisma = new PrismaClient();

class ResetTokenService {
  async generate(userId: string): Promise<ResetToken> {
    const generatedToken = randomBytes(32).toString('hex');
    const resetToken = await prisma.resetToken.create({
      data: {
        hashedToken: generatedToken,
        user: { connect: { id: userId } },
      },
    });
    return resetToken;
  }

  async getUserFromToken(token: string): Promise<User> {
    const resetToken = await prisma.resetToken.findFirst({
      where: { hashedToken: token, revoked: false },
    });

    if (!resetToken) {
      throw new ResetTokenInvalidError();
    }

    await prisma.resetToken.update({
      where: { id: resetToken.id },
      data: { revoked: true },
    });

    const user = await prisma.user.findUnique({
      where: { id: resetToken.userId },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }
}

export default new ResetTokenService();
