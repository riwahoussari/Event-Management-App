/**
 * @swagger
 * tags:
 *   name: Auth
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - fullname
 *               - gender
 *             properties:
 *               email:
 *                 type: string
 *                 example: name@domain.com
 *               password:
 *                 type: string
 *                 example: my strong password
 *               fullname:
 *                 type: string
 *                 example: John Doe
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *                 example: male
 *               phone_number:
 *                 type: string
 *                 example: +961 71 123 123
 *                 description: must be a valid international phone number
 *               birthday:
 *                 type: string
 *                 format: "YYYY-MM-DD"
 *                 example: 2000-01-01
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       409:
 *         description: Email already exists
 *
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: name@domain.com
 *               password:
 *                 type: string
 *                 example: my strong password
 *
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Invalid email or password
 *
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     description: Logs out the user by clearing the authentication cookie. Client must send request with credentials (cookies) included.
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       400:
 *         description: No token cookie found
 */

/**
 * @swagger
 * /api/auth/validate-user:
 *   get:
 *     summary: Checks user authorization (JWT)
 *     tags: [Auth]
 *     description: Validates JWT token from cookies. Client must send request with credentials (cookies) included.
 *     responses:
 *       200:
 *         description: Valid token. Authorized User
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 user: 
 *                   type: object
 *                   properties: 
 *                     id: 
 *                       type: integer
 *                     account_type:
 *                       type: string
 *       401:
 *         description: Missing token. Unauthorized
 *       403:
 *         description: Invalid token. Forbidden
 */

const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/db-connection");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/auth");

const router = express.Router();
const SALT_ROUNDS = 10;

// REGISTER
router.post("/register", async (req, res) => {
  const { fullname, email, password, gender, phone_number, birthday } =
    req.body;

  // check required fields
  if (!fullname) {
    return res.status(400).json({ error: "Missing required Full Name field." });
  }
  if (!email) {
    return res.status(400).json({ error: "Missing required Email field." });
  }
  if (!password) {
    return res.status(400).json({ error: "Missing required Password field." });
  }
  if (!gender) {
    return res.status(400).json({ error: "Missing required Gender field." });
  }

  // create new user
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const today = new Date().toISOString().split("T")[0];

    const stmt = `
      INSERT INTO users (
        fullname, email, password_hash, gender, phone_number, birthday, 
        account_type, account_status, date_joined
      ) VALUES (?, ?, ?, ?, ?, ?, 'regular', 'active', ?)
    `;

    db.run(
      stmt,
      [
        fullname,
        email,
        hashedPassword,
        gender,
        phone_number || null,
        birthday || null,
        today,
      ],
      (err) => {
        if (err) {
          if (err.message.includes("UNIQUE constraint failed")) {
            return res.status(409).json({ error: "Email already exists." });
          }
          console.error(err);
          return res.status(500).json({ error: "Internal server error." });
        }

        // return token and data
        const payload = {
          id: this.lastID,
          account_type: "regular",
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });

        // Set token in HttpOnly cookie
        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // only send over HTTPS in prod
          sameSite: "lax",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });

        return res
          .status(201)
          .json({ user: payload, message: "User created successfully" });
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Error creating user." });
  }
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // check required fields
  if (!email || !password)
    return res.status(400).json({ error: "Email and Password are required." });

  // find user by email
  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error." });

    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });

    // validate password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match)
      return res.status(401).json({ error: "Invalid email or password." });

    // return token and data
    const payload = {
      id: user.id,
      account_type: user.account_type,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    // Set token in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only send over HTTPS in prod
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ user: payload, message: "Login successful" });
  });
});

// LOGOUT
router.post("/logout", (req, res) => {
  const token = req.cookies.token; // requires cookie-parser middleware

  if (!token) {
    return res
      .status(400)
      .json({ error: "No token found. Already logged out?" });
  }

  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
});

// VALIDATE USER
router.get("/validate-user", authenticateToken, (req, res) => {
  // req.user is set by authenticateToken middleware ({id, account_type})
  // if failed authentication middleware already returned an error
  res.status(200).json({ user: req.user });
});

module.exports = router;
