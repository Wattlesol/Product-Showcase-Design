import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  console.log(`[STATIC] Serving files from: ${distPath}`);

  // Serve static files first
  app.use(express.static(distPath));

  // Fall through to index.html for SPA client-side routing (wouter)
  // This must be a GET handler to not interfere with other HTTP methods
  app.get("*", (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return next();
    }
    console.log(`[STATIC] SPA fallback for: ${req.path}`);
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
