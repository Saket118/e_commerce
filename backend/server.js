// ----------------------- IMPORTS ----------------------- //
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

// ----------------------- CONFIG ----------------------- //
dotenv.config();

// Resolve __dirname (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----------------------- DATABASE ----------------------- //
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ----------------------- MULTER SETUP ----------------------- //
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Folder where images will be saved
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ----------------------- ROUTES ----------------------- //

// ✅ Test route
app.get("/", (req, res) => {
  res.send("🚀 Node.js backend connected with MySQL (phpMyAdmin)!");
});

// ✅ Get all users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Add user
app.post("/users", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required" });
  }

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ User added successfully", id: result.insertId });
  });
});

// ✅ Admin login
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const sql = "SELECT * FROM users WHERE email = ? AND password = ? LIMIT 1";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: err.message });

    if (results.length === 0) {
      return res.status(401).json({ success: false, message: "❌ Invalid email or password" });
    }

    const user = results[0];
    res.json({
      success: true,
      message: "✅ Login successful",
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});

// ✅ Add Product (with image upload)
app.post("/products", upload.single("image"), (req, res) => {
  const { name, price, quantity, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !price || !quantity || !image) {
    return res.status(400).json({ error: "All fields (including image) are required." });
  }

  const sql =
    "INSERT INTO products (name, price, quantity, description, image) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [name, price, quantity, description, image], (err, result) => {
    if (err) {
      console.error("❌ Error inserting product:", err);
      return res.status(500).json({ error: err.message });
    }

    res.json({
      message: "✅ Product added successfully!",
      productId: result.insertId,
      data: { name, price, quantity, description, image },
    });
  });
});

// ✅ Get all products
app.get("/products", (req, res) => {
  const sql = "SELECT * FROM products ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) {
      console.error("❌ Error fetching products:", err);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// ----------------------- START SERVER ----------------------- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
