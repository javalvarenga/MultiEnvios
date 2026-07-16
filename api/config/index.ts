export const config = {
  port: Number(process.env.PORT ?? '8000'),
  jwtSecret: process.env.JWT_SECRET ?? 'dev_secret',
};