// ----------------------- IMPORTS ----------------------- //
import express from "express";
import mysql from "mysql2";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
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
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
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
  const { name, email, password,phoneNo,gender } = req.body;

  if (!name || !email || !password || !phoneNo || !gender) {
    return res
      .status(400)
      .json({ error: "Name, email, and password are required" });
  }

  const sql = "INSERT INTO users (name, email, password,phoneNo,gender) VALUES (?, ?, ?,?,?)";
  db.query(sql, [name, email, password,phoneNo,gender], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ User added successfully", id: result.insertId });
  });
});

app.post("/admin/login", (req, res) => {
  const { email, password } = req.body;

  // 🧩 Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required",
    });
  }

  // 🧠 Query user from database
  const sql = `
    SELECT id, name, email, status 
    FROM users 
    WHERE email = ? AND password = ? 
    LIMIT 1
  `;

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error("❌ Login Query Error:", err);
      return res.status(500).json({
        success: false,
        message: "Database error during login",
      });
    }

    if (results.length === 0) {
      return res.status(401).json({
        success: false,
        message: "❌ Invalid email or password",
      });
    }

    const user = results[0];

    // ✅ Successful login
    return res.status(200).json({
      success: true,
      message: "✅ Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        status: user.status,
      },
    });
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

// ----------------------- CART API ----------------------- //

// ✅ Add to Cart
app.post("/cart", (req, res) => {
  const { user_id, product_id, name, price, quantity, image } = req.body;

  if (!user_id || !product_id || !name || !price) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  const checkQuery =
    "SELECT * FROM cart WHERE user_id = ? AND product_id = ? LIMIT 1";

  db.query(checkQuery, [user_id, product_id], (err, result) => {
    if (err) {
      console.error("❌ Error checking cart:", err);
      return res
        .status(500)
        .json({ success: false, message: "Database error" });
    }

    if (result.length > 0) {
      // If product already in cart, update quantity
      const updateQuery =
        "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?";
      db.query(updateQuery, [quantity || 1, user_id, product_id], (err) => {
        if (err) {
          console.error("❌ Error updating cart:", err);
          return res
            .status(500)
            .json({ success: false, message: "Database error" });
        }
        return res.json({ success: true, message: "Cart updated" });
      });
    } else {
      // Insert new item
      const insertQuery = `
        INSERT INTO cart (user_id, product_id, name, price, quantity, image)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      db.query(
        insertQuery,
        [user_id, product_id, name, price, quantity || 1, image || ""],
        (err, result) => {
          if (err) {
            console.error("❌ MySQL Insert Error:", err);
            return res
              .status(500)
              .json({ success: false, message: "Database error" });
          }
          res.json({
            success: true,
            message: "Item added to cart",
            data: result,
          });
        }
      );
    }
  });
});

// ✅ Get Cart Items for a Specific User
app.get("/cart", (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res
      .status(400)
      .json({ success: false, message: "user_id is required" });
  }

  const sql = "SELECT * FROM cart WHERE user_id = ?";
  db.query(sql, [userId], (err, rows) => {
    if (err) {
      console.error("❌ Error fetching cart:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error fetching cart" });
    }
    res.json({ success: true, data: rows });
  });
});

// ✅ Delete item from Cart
app.delete("/cart/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM cart WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error deleting item:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error deleting item" });
    }
    res.json({ success: true, message: "🗑️ Item deleted successfully" });
  });
});

// ✅ Clear all cart items for a specific user
app.delete("/cart", (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "user_id is required" });
  }

  db.query("DELETE FROM cart WHERE user_id = ?", [user_id], (err, result) => {
    if (err) {
      console.error("❌ Error clearing cart:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error clearing cart" });
    }
    res.json({ success: true, message: "🧹 Cart cleared successfully" });
  });
});







// ----------------------- START SERVER ----------------------- //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
