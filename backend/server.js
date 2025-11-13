import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// __dirname setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:4200", // 👈 Angular frontend
  credentials: true,              // allow sending cookies
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Session setup
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // true if HTTPS
      maxAge: 1000 * 60 * 30, // 30 min
    },
  })
);

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
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ----------------------- ROUTES ----------------------- //

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Node.js backend connected with MySQL!");
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
  const { name, email, password, phoneNo, gender } = req.body;
  if (!name || !email || !password || !phoneNo || !gender)
    return res.status(400).json({ error: "All fields are required" });

  const sql =
    "INSERT INTO users (name, email, password, phoneNo, gender, status) VALUES (?, ?, ?, ?, ?, 'active')";
  db.query(sql, [name, email, password, phoneNo, gender], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ User added successfully", id: result.insertId });
  });
});

// ✅ Login with session
app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ success: false, message: "Email and password required" });

  const sql = `
    SELECT id, name, email, status, designation 
    FROM users 
    WHERE email = ? AND password = ? 
    LIMIT 1
  `;
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    if (results.length === 0)
      return res.status(401).json({ success: false, message: "Invalid email or password" });

    const user = results[0];

    // 🛑 Check status
    if (user.status !== "active") {
      return res.status(403).json({ success: false, message: "Account inactive" });
    }

    // ✅ Store in session
    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      designation: user.designation || "User",
      status: user.status,
    };

    console.log("✅ Session Created:", req.session.user);

    res.json({
      success: true,
      message: "Login successful",
      user: req.session.user,
    });
  });
});

// ✅ Profile (session check)
app.get("/admin/profile", (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.status(401).json({ loggedIn: false, message: "Not logged in" });
  }
});

// ✅ Logout
app.post("/admin/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out successfully" });
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

// ✅ Add Product (with image upload)
app.post("/products", upload.single("image"), (req, res) => {
  const { name, price, quantity, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;

  if (!name || !price || !quantity || !image) {
    return res
      .status(400)
      .json({ error: "All fields (including image) are required." });
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




// 🚀 Start server
app.listen(5000, () => console.log("✅ Server running on http://localhost:5000"));
