// Import modules
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Create an Express app
const app = express();

// Middleware
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse raw JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse form-data / x-www-form-urlencoded

// MySQL connection setup
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL Database");
  }
});

// ----------------------- ROUTES ----------------------- //

// Test route
app.get("/", (req, res) => {
  res.send("Node.js backend connected with phpMyAdmin database!");
});

// Get all users
app.get("/users", (req, res) => {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add a user (plain-text password)
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

// Admin login
app.post("/admin/login", (req, res) => {
  console.log("POST /admin/login called"); // Debug
  console.log("Request body:", req.body);   // Debug

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

    // Login successful
    res.json({
      success: true,
      message: "✅ Login successful",
      user: { id: user.id, name: user.name, email: user.email } // Optional: send user info
    });
  });
});

// ----------------------- START SERVER ----------------------- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
