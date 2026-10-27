# SwiftLink

A URL shortener with React, Node.js, MongoDB, Redis, token-bucket rate limiting and click analytics. Links are created after signing in; destinations use `/r/<code>`. The dashboard shows 30-day clicks, devices and referrer hostnames. It stores no IP addresses in click records. Each redirect writes analytics synchronously: correctness is prioritized over maximum throughput; benchmark before claiming high-traffic capacity or a percentage speedup.

## Run with Docker

1. Install Docker Desktop and start it.
2. Copy `.env.example` to `.env`. Replace SESSION_SECRET with a random value of at least 32 characters. Set BASE_URL to the public HTTPS origin when deploying. Configure `TRUST_PROXY=1` only if the app is behind exactly one trusted reverse proxy.
3. Run `docker compose up --build -d` and open http://localhost:3000.
4. Create an account, create a link and open it in a separate tab. Refresh the dashboard to see its click.

Docker volumes persist MongoDB and Redis data. Keep port 3000 behind a TLS-terminating reverse proxy in production and set BASE_URL correctly. Back up the MongoDB volume; Redis contains sessions and a disposable link cache. The development compose file binds port 3000 to all interfaces, so restrict network access appropriately.

## Development

Start MongoDB and Redis separately, set `MONGO_URI`, `REDIS_URL`, `SESSION_SECRET`, `BASE_URL=http://localhost:3000`, and `NODE_ENV=development`. Run `npm install`, `npm --prefix server install`, `npm --prefix client install`, then `npm run dev`. Open http://localhost:5173. Vite proxies API requests; generated links use BASE_URL and point to the server. For a production bundle: `npm run build` and `npm --prefix server start`.

## Limitations and deployment

This source needs running MongoDB and Redis; no managed services are configured. Deployment and browser testing require an environment with Docker, registry access and a public host. Google Fonts are optional; system fallbacks are supplied. Authentication uses server-side Redis sessions and email/password; password recovery and email verification are not implemented. The dashboard displays the most recent 100 links. Analytics are aggregate counts, not unique visitors, and bots are included. A deletion can race with an in-flight redirect, and analytics writes are synchronous; these need further work for strict consistency and high scale. Cache is valid for 60 seconds and is invalidated on deletion. A dedicated publicly reachable deployment is necessary for recipients to use links. Before public use, implement abuse reporting, malware/phishing checks, data retention and privacy policies appropriate to your jurisdiction. No performance benchmark has been run, so the 60% résumé claim is not verified.
