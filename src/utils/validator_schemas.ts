import { Role } from '.prisma/client';
import { z } from 'zod';

export const AuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type AuthDTO = z.infer<typeof AuthSchema>;

export const UserSchema = AuthSchema.extend({
  active: z.boolean(),
  role: z.nativeEnum(Role),
});

export const PartialUserSchema = UserSchema.partial();

export type UserDTO = z.infer<typeof UserSchema>;
export type UserUpdateDTO = z.infer<typeof PartialUserSchema>;

export const GarageSchema = z.object({
  name: z.string(),
  spaces: z.number(),
  userId: z.string().optional(),
});

export const PartialGarageSchema = GarageSchema.partial();

export type GarageDTO = z.infer<typeof GarageSchema>;
export type GarageUpdateDTO = z.infer<typeof PartialGarageSchema>;

export const CarSchema = z.object({
  model: z.string(),
  brand: z.string(),
  year: z.string(),
  userId: z.string().optional(),
  garageId: z.number().optional(),
});

export const PartialCarSchema = CarSchema.partial();

export type CarDTO = z.infer<typeof CarSchema>;
export type CarUptadeDTO = z.infer<typeof PartialCarSchema>;

export const SubscriptionSchema = z.object({
  active: z.boolean(),
  userId: z.string(),
});

export const PartialSubscriptionSchema = SubscriptionSchema.partial();

export type SubscriptionDTO = z.infer<typeof SubscriptionSchema>;
export type SubscriptionUpdateDTO = z.infer<typeof PartialSubscriptionSchema>;
