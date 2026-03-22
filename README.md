# Securing the Energy API

An Express.js API server with a multi-layered middleware stack for traffic control, IP security, and dual-mode authentication (JWT Bearer Token + Basic Auth).

## Setup

```bash
npm install
npm start        # starts on port 3000
npm run dev      # starts with nodemon (auto-restart)
```

Copy the example environment file:

```bash
cp .env.example .env
```

## Middleware Stack

Applied in this order:

1. **IP Filter** — allows only `127.0.0.1` / `::1`; blocks all others with 403
2. **CORS** — restricts origin to `http://localhost:3000`
3. **Rate Limiter** — 10 requests per 60-second window
4. **Authentication** — per-route (JWT on API, Basic Auth on dashboard)

## Endpoints

| Method | Path              | Auth         | Description                                      |
|--------|-------------------|--------------|--------------------------------------------------|
| POST   | `/api/login`      | None         | Accepts `username` + `password`, returns JWT      |
| GET    | `/api/oil-prices` | Bearer Token | Returns JSON oil price data (requires JWT)        |
| GET    | `/dashboard`      | Basic Auth   | HTML table of oil prices                          |
| GET    | `/logout`         | None         | Clears Basic Auth session                         |

## Testing

```bash
# Step 1 — Get a JWT token
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "oilprices"}'

# Step 2 — Use the token to access oil prices
curl -H "Authorization: Bearer <paste_token_here>" http://localhost:3000/api/oil-prices

# API — no token (returns 401)
curl http://localhost:3000/api/oil-prices

# Dashboard — valid credentials (returns HTML)
curl -u admin:oilprices http://localhost:3000/dashboard

# Dashboard — no credentials (returns 401)
curl http://localhost:3000/dashboard
```

## Credentials

- **Username:** `admin`
- **Password:** `oilprices`
- **JWT Secret:** `energy-api-secret-2026`
