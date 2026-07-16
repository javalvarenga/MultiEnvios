import { User } from '../models/types.js';

const users: User[] = [
  {
    id: 'u1',
    email: 'demo@multienvios.gt',
    password: 'demo123',
    name: 'Demo',
    balance: 500,
  },
];

export const userRepository = {
  findByEmail(email: string): User | undefined {
    return users.find((u) => u.email === email);
  },
  findById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  },
  updateBalance(id: string, delta: number): void {
    const user = users.find((u) => u.id === id);
    if (user) user.balance += delta;
  },
};
