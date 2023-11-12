import { PrismaClient, ResetToken, User } from '@prisma/client';
import { randomBytes } from 'crypto';
import { ResetTokenInvalidError } from '../errors/auth.error';
import { EntityNotFoundError } from '../errors/base.error';

export default class ResetTokenService {
  private repository: PrismaClient = new PrismaClient();

  async generate(userId: string): Promise<ResetToken> {
    const generatedToken = randomBytes(32).toString('hex');
    const resetToken = await this.repository.resetToken.create({
      data: {
        hashedToken: generatedToken,
        user: { connect: { id: userId } },
      },
    });
    return resetToken;
  }

  async getUserFromToken(token: string): Promise<User> {
    const resetToken = await this.repository.resetToken.findFirst({
      where: { hashedToken: token, revoked: false },
    });

    if (!resetToken) {
      throw new ResetTokenInvalidError();
    }

    await this.repository.resetToken.update({
      where: { id: resetToken.id },
      data: { revoked: true },
    });

    const user = await this.repository.user.findUnique({
      where: { id: resetToken.userId },
    });

    if (!user) {
      throw new EntityNotFoundError('User', resetToken.userId);
    }

    return user;
  }
}
