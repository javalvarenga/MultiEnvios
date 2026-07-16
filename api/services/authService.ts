import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { userRepository } from '../repositories/userRepository.js';
import type { User } from '../models/types.js';

export interface AuthResult {
  token: string;
  user: Omit<User, 'password'>;
}

export function login(email: string, password: string): AuthResult | null {
  const user = userRepository.findByEmail(email);
  if (!user || user.password !== password) return null;

  const token = jwt.sign({ sub: user.id }, config.jwtSecret, {
    expiresIn: '1h',
  });
  const { password: _password, ...safe } = user;
  return { token, user: safe };
}

export function verify(token: string): string | null {
  try {
    const payload = jwt.verify(token, config.jwtSecret) as { sub: string };
    return payload.sub;
  } catch {
    return null;
  }
}
