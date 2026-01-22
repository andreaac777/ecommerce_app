import express from "express";
import path from "path";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { functions, inngest } from "./config/inngest.js";

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import adminRoutes from "./routes/admin.routes.js";

const app = express();

const __dirname = path.resolve();

app.use(express.json());

app.post("/api/webhooks/clerk", async (req, res) => {
  const event = req.body;

  console.log("Webhook received:", event.type);

  try {
    await inngest.send({
      name: `clerk.${event.type}`,
      data: event.data,
    });
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Error sending event to Inngest:", error);
    res.status(500).json({ error: "Inngest error" });
  }
});

app.use("/api/inngest", serve({client:inngest, functions}));

app.use(clerkMiddleware());

app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success" });
});

// Make app ready for deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    });
}

const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log(`Server is up and running on port ${ENV.PORT}`);
    });
};

startServer();
