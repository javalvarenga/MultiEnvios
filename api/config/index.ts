const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  console.warn(
    '⚠️  JWT_SECRET is not defined in environment variables. ' +
      'Set it in .env (see .env.example). Using insecure default.',
  );
}

export const config = {
  port: Number(process.env.PORT ?? '8000'),
  jwtSecret: jwtSecret ?? 'dev_secret',
};