import { Role } from '.prisma/client';
import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().length(6),
});

export const UserSchema = AuthSchema.extend({
  active: z.boolean(),
  role: z.nativeEnum(Role),
});

export const GarageDTOSchema = z.object({
  name: z.string(),
  userId: z.string(),
  spaces: z.number(),
});

export const CarSchema = z.object({
  model: z.string(),
  brand: z.string(),
  year: z.string(),
  userId: z.string().optional(),
  garageId: z.number().optional(),
});

export const SubscriptionSchema = z.object({
  active: z.boolean(),
  userId: z.string(),
});
