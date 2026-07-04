import express from "express";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { doubleCsrf } from "csrf-csrf";
import { env } from "./lib/env";
// AUDIT FIX: imported from non-existent "./routes". The API router is built by
// `buildApiRouter` in "./features".
import { buildApiRouter } from "./features";
import { errorHandler, notFoundHandler } from "./shared/utils/errorHandler";

export const app = express();

// FIX: Two proxy hops in production: CapRover reverse proxy (HTTPS termination)
// → nginx web container → API container.  "trust proxy: 1" only trusted ONE
// hop, so Express never saw X-Forwarded-Proto: https and did not set the
// Secure flag on the __Host-psifi.x-csrf-token cookie.  Without that flag
// the browser rejects __Host- cookies → every upload / mutation returns 403.
// nginx.conf now explicitly sets "X-Forwarded-Proto: https" so trusting all
// proxy headers here is safe.
app.set("trust proxy", true);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "same-site" },
    // AUDIT FIX (v13): Tight CSP in production; disabled in dev for HMR.
    contentSecurityPolicy:
      env.NODE_ENV === "production"
        ? {
            directives: {
              defaultSrc: ["'self'"],
              imgSrc: ["'self'", "data:", "https:"],
              scriptSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              fontSrc: ["'self'", "data:", "https:"],
              connectSrc: ["'self'", ...env.CORS_ORIGINS],
              frameAncestors: ["'none'"],
              objectSrc: ["'none'"],
              baseUri: ["'self'"],
              formAction: ["'self'"],
            },
          }
        : false,
  })
);

const ALLOWED_ORIGIN_PATTERNS = [
  /^https?:\/\/localhost(:\d+)?$/,
  /^https?:\/\/127\.0\.0\.1(:\d+)?$/,
  /\.replit\.dev$/,
  /\.replit\.app$/,
];

app.use(
  cors({
    origin: (origin, callback) => {
      // React Native has no origin header — allow it
      if (!origin) return callback(null, true);
      // Allow if it matches env list
      if ((env.CORS_ORIGINS as string[]).includes(origin)) return callback(null, true);
      // Allow any Replit / localhost domain
      if (ALLOWED_ORIGIN_PATTERNS.some((p) => p.test(origin))) return callback(null, true);
      callback(new Error(`CORS: origin '${origin}' not allowed`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser(env.CSRF_SECRET));

// ---- Rate limiting ----
const authLimiter = rateLimit({
  windowMs: 60_000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// Lenient limiter for public read-only auth endpoints (e.g. /api/auth/team-leaders)
// that the UI polls on mount. These don't touch sensitive auth operations so
// the strict 10/min auth limit is not needed here.
const authReadLimiter = rateLimit({
  windowMs: 60_000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

const apiLimiter = rateLimit({
  windowMs: 60_000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

// Public read-only endpoints get the lenient limiter BEFORE the strict authLimiter
app.use("/api/auth/team-leaders", authReadLimiter);
app.use("/api/auth/approval-status", authReadLimiter);
app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

// ---- CSRF (cookie + header double-submit) ----
// FIX: Stop using the __Host- cookie prefix in production.
// __Host- requires the Set-Cookie to arrive over a secure connection AS SEEN
// BY THE BROWSER.  In our CapRover setup the TLS is terminated at the
// CapRover reverse proxy; by the time the response reaches the browser the
// Set-Cookie was already written by the API behind two HTTP hops, so browsers
// treated the __Host- cookie as invalid and discarded it — making every
// subsequent POST return 403 (CSRF validation failure).
// Using a plain "psifi.x-csrf-token" name with Secure + SameSite=Lax gives
// identical security without the strict origin-binding that __Host- enforces.
const { doubleCsrfProtection, generateToken } = doubleCsrf({
  getSecret: () => env.CSRF_SECRET,
  cookieName: "psifi.x-csrf-token",
  cookieOptions: {
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    httpOnly: true,
    path: "/",
  },
  size: 64,
  getTokenFromRequest: (req) => req.headers["x-csrf-token"] as string | undefined,
});

app.get("/api/csrf-token", (req, res) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  // Always issue a fresh token here. `csrf-csrf` validates an existing CSRF
  // cookie by default; after an OAuth redirect, server restart, secret change,
  // or stale browser cookie that validation can throw EBADCSRFTOKEN and make
  // the token-issuing endpoint itself return 403. This route's only job is to
  // replace that cookie/token pair with a valid one.
  const token = generateToken(req, res, true, false);
  res.json({ csrfToken: token });
});

/*
 * FIX: CSRF bypass protection
 * Mobile clients use Bearer token WITHOUT an auth cookie.
 * Web clients always have the auth cookie, so they MUST pass CSRF validation.
 * Checking both conditions prevents a browser from spoofing a mobile client
 * by simply adding an Authorization header.
 */
// Routes that must NEVER be touched by the CSRF middleware. The token-issuing
// endpoint cannot itself require a valid token, and the OAuth callbacks are
// top-level browser redirects from a third party — they will never carry our
// x-csrf-token header.
const CSRF_EXEMPT_PATHS = new Set<string>([
  "/api/heartbeat",
  "/api/csrf-token",
  "/api/auth/google/callback",
  "/api/auth/facebook/callback",
]);

app.use((req, res, next) => {
  if (CSRF_EXEMPT_PATHS.has(req.path)) return next();

  const hasCookie = !!(
    req.cookies?.["session"] || req.cookies?.["__Host-session"]
  );
  const hasBearer = req.headers.authorization?.startsWith("Bearer ");
  const isMobileClient =
    String(req.headers["x-client-platform"] ?? "").toLowerCase() === "mobile";

  // Mobile client: Bearer token present AND no session cookie
  if (hasBearer && !hasCookie) return next();

  // Mobile public auth calls (login/register/password/verification) do not
  // have a browser cookie or CSRF cookie. If a session cookie exists, still
  // require CSRF so web sessions cannot be protected by a spoofed header.
  if (isMobileClient && !hasCookie && req.path.startsWith("/api/auth/")) {
    return next();
  }

  // Safe methods don't need CSRF protection
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  // All other requests (especially web clients) must pass CSRF
  return doubleCsrfProtection(req, res, next);
});

app.use("/api", buildApiRouter());

// AUDIT FIX (v8): every upload landed in apps/api/public/uploads and the API
// returned `/uploads/<file>.webp` as the URL, but nothing served that path —
// so every uploaded image (avatars, project covers, resale photos) 404'd in
// the browser. Serve the directory statically.
// FIX: import the shared uploadsDir from upload.service so write path and
// static-serve path stay in sync (and honour UPLOAD_DIR env on CapRover).
import { uploadsDir } from "./features/upload/upload.service";
app.use(
  "/uploads",
  express.static(uploadsDir, {
    fallthrough: false,
    maxAge: "30d",
    setHeaders: (res) => {
      // Allow cross-origin <img> embedding (helmet default is "same-site").
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    },
  }),
);

// 404 for unmatched routes, then centralized error handler.
app.use(notFoundHandler);
app.use(errorHandler);

// AUDIT FIX: index.ts imports the app as a default export, but app.ts only
// exposed a named export, so the server entrypoint failed to start.
export default app;
