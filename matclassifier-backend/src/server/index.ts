import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from './initDb';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add CORS configuration before routes
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.AMPLIFY_URL,
  'https://*.amplifyapp.com',
  'https://main.d2jjktrxvp3w1j.amplifyapp.com',
  'https://matclassifier-prod.eba-j7psmy8d.eu-north-1.elasticbeanstalk.com'
].filter(Boolean);

console.log('CORS Configuration:', {
  allowedOrigins,
  frontendUrl: process.env.FRONTEND_URL,
  amplifyUrl: process.env.AMPLIFY_URL
});

app.use(cors({
  origin: (origin, callback) => {
    console.log('CORS Request Origin:', origin);
    if (!origin || allowedOrigins.some(allowed => origin.match(new RegExp(allowed.replace('*', '.*'))))) {
      console.log('CORS Allowed for origin:', origin);
      callback(null, true);
    } else {
      console.log('CORS Blocked for origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
  exposedHeaders: ['Content-Length', 'Content-Type']
}));

// Add request logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    url: req.url,
    origin: req.headers.origin,
    headers: req.headers,
    host: req.headers.host
  });
  next();
});

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    // Initialize the database before setting up routes
    await initializeDatabase();
    
    const server = await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      res.status(status).json({ message });
      throw err;
    });

    // Remove or comment out this section
    // if (app.get("env") === "development") {
    //   await setupVite(app, server);
    // } else {
    //   serveStatic(app);
    // }

    // Use port from environment variable or default to 3000
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      log(`serving on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
