import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Set payload limit to support base64 custom profile pictures / items
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  const dataDir = path.join(process.cwd(), "data");
  const dataFilePath = path.join(dataDir, "portfolio.json");

  // Load Firebase Config dynamically
  let db: any = null;
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    try {
      const configRaw = fs.readFileSync(firebaseConfigPath, "utf8");
      const config = JSON.parse(configRaw);
      
      const { initializeApp } = await import("firebase/app");
      const { initializeFirestore, getFirestore } = await import("firebase/firestore");
      
      const fbApp = initializeApp({
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId,
        appId: config.appId
      });
      
      if (config.firestoreDatabaseId) {
        db = initializeFirestore(fbApp, {}, config.firestoreDatabaseId);
      } else {
        db = getFirestore(fbApp);
      }
      console.log("Firebase Firestore connected successfully with project:", config.projectId);
    } catch (e) {
      console.error("Failed to initialize Firebase:", e);
    }
  }

  // API Route - Get Portfolio
  app.get("/api/portfolio", async (req, res) => {
    try {
      // 1. Try to fetch from Firestore first
      if (db) {
        try {
          const { doc, getDoc } = await import("firebase/firestore");
          const docRef = doc(db, "portfolios", "data");
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Loaded portfolio from Firestore cloud database");
            return res.json({ status: "success", data });
          }
        } catch (dbError) {
          console.error("Firestore read error, falling back to local file:", dbError);
        }
      }

      // 2. Fallback to local file cache
      if (fs.existsSync(dataFilePath)) {
        const fileContent = fs.readFileSync(dataFilePath, "utf8");
        const parsed = JSON.parse(fileContent);
        console.log("Loaded portfolio from local disk file fallback");
        return res.json({ status: "success", data: parsed });
      }
      return res.json({ status: "default" });
    } catch (error) {
      console.error("Error reading portfolio data:", error);
      return res.status(500).json({ error: "Failed to read portfolio data" });
    }
  });

  // API Route - Save Portfolio
  app.post("/api/portfolio", async (req, res) => {
    try {
      const { profile, videos, graphics } = req.body;
      const payload = { profile, videos, graphics, lastUpdated: new Date().toISOString() };

      // 1. Save to local fallback file cache first
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(dataFilePath, JSON.stringify(payload, null, 2), "utf8");

      // 2. Save to Firestore cloud database
      if (db) {
        try {
          const { doc, setDoc } = await import("firebase/firestore");
          const docRef = doc(db, "portfolios", "data");
          await setDoc(docRef, payload);
          console.log("Saved and synced portfolio to Firestore cloud database");
        } catch (dbError) {
          console.error("Firestore save error, saved locally only:", dbError);
        }
      }

      return res.json({ status: "success" });
    } catch (error) {
      console.error("Error saving portfolio data:", error);
      return res.status(500).json({ error: "Failed to save portfolio data" });
    }
  });

  // API Route - Administrator Access Login
  app.post("/api/admin/login", (req, res) => {
    try {
      const { passcode } = req.body;
      const expectedPasscode = process.env.PORTFOLIO_PASSCODE || "787";
      
      if (passcode && passcode.toString().trim() === expectedPasscode.toString().trim()) {
        console.log("Admin logged in successfully");
        return res.json({ status: "success", token: "portfolio-admin-authenticated-token" });
      }
      console.warn("Unauthorized admin login attempt");
      return res.status(401).json({ status: "error", message: "Incorrect passcode. Please try again." });
    } catch (error) {
      console.error("Admin login error:", error);
      return res.status(500).json({ error: "Server error during authentication" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
