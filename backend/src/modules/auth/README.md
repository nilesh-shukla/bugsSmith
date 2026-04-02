Auth module

Endpoints:

- POST /auth/signup  { name, email, password, role }
- POST /auth/login   { email, password }
- POST /auth/refresh { refreshToken }
- POST /auth/logout  { refreshToken }
- GET  /auth/me      (Authorization: Bearer <accessToken>)

Notes:
- Run `npm install` then `npx prisma generate` and provide a `DATABASE_URL` in .env.
