import bcryptjs from 'bcryptjs';

const SALT_ROUNDS = 12;

export async function hashPassword(plainPassword: string): Promise<string> {
  return bcryptjs.hash(plainPassword, SALT_ROUNDS);
}

export async function comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcryptjs.compare(plainPassword, hashedPassword);
}
