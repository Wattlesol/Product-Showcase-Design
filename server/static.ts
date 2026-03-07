import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  // In production, the bundled server is at dist/index.cjs
  // Static files are at dist/public
  const distPath = path.join(__dirname, "public");
  
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve static files first
  app.use(express.static(distPath));

  // Catch-all route for SPA - Express 5 requires named wildcards
  app.get("/{*path}", (req, res) => {
    // Skip API routes
    if (req.path.startsWith("/api")) {
      return;
    }
    res.sendFile(path.join(distPath, "index.html"));
  });
}
