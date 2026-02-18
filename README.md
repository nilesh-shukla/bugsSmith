# BugsSmith

Project notes and instructions.

## Render deployment

Add the following environment variables in the Render Web Service settings (replace example values):

- `DATABASE_URL` = postgres://<db_user>:<db_pass>@<host>:5432/<db_name>
- `JWT_SECRET` = <your_jwt_secret>
- `FRONTEND_URLS` = https://bugs-smith.vercel.app,https://bugssmith.onrender.com
- `VITE_API_URL` = https://bugssmith.onrender.com
- `SENDGRID_API_KEY` = <your_sendgrid_api_key> (optional if using SMTP)
- `SENDGRID_FROM` = no-reply@yourdomain.com (optional)

Render Build & Start commands:

- Build Command:

```
npm install && cd frontend && npm install && npm run build
```

- Start Command (service root where `server.js` lives):

```
cd bugsSmith-B && npm start
```

Notes:
- The backend uses `FRONTEND_URLS` (comma-separated) to allow CORS from multiple frontends.
- The frontend reads API URL from `VITE_API_URL` at build-time.
- If your frontend is deployed on Render too, include its URL in `FRONTEND_URLS`.
