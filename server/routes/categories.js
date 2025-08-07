/**
 * @swagger
 * tags:
 *   name: Categories
 */

/** 
* @swagger
* paths:
*   /api/categories:
*     get:
*       tags:
*         - Categories
*       summary: Get all categories
*       description: Returns a list of all categories available.
*       responses:
*         200:
*           description: A list of categories
*           content:
*             application/json:
*               schema:
*                 type: array
*                 items:
*                   type: object
*                   properties:
*                     id:
*                       type: integer
*                     category_name:
*                       type: string
*                     date_created:
*                       type: string
*                       format: date

*     post:
*       tags:
*         - Categories
*       summary: Create a new category (Admin only)
*       description: Adds a new category. Only accessible to users with admin privileges.
*       security:
*         - cookieAuth: []
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               required:
*                 - category_name
*               properties:
*                 category_name:
*                   type: string
*                   example: art
*       responses:
*         201:
*           description: Category created
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   message:
*                     type: string
*                     example: Category created
*                   id:
*                     type: integer
*                   category_name:
*                     type: string
*                   date_created:
*                     type: string
*                     format: date
*         400:
*           description: Invalid input or category already exists
*         403:
*           description: Forbidden – only admins can create categories
*         409:
*           description: Conflict – category already exists
*         500:
*           description: Server error
*/

const express = require("express");
const db = require("../db/db-connection.js");
const authMiddleware = require("../middleware/auth.js");

const router = express.Router();

// GET /api/categories – Get all categories
router.get("/", authMiddleware, (req, res) => {
  let query = "SELECT id, category_name FROM categories";
  if (req.user.account_type === "admin") {
    query = "SELECT * FROM categories";
  }

  db.all(query, (err, rows) => {
    if (err) {
      console.error("Error fetching categories:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.status(200).json(rows);
  });
});

// POST /api/categories - Create category– Admin only 
router.post("/", authMiddleware, (req, res) => {
  const { category_name } = req.body;
  const user = req.user;

  if (user.account_type !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" });
  }

  if (!category_name) {
    return res.status(400).json({ error: "category_name is required" });
  }

  const date_created = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'

  const query =
    "INSERT INTO categories (category_name, date_created) VALUES (?, ?)";

  db.run(query, [category_name.toLowerCase().trim(), date_created], function (err) {
    if (err) {
      if (err.message.includes("UNIQUE")) {
        return res.status(409).json({ error: "Category already exists" });
      }
      console.error("Error inserting category:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.status(201).json({
      message: "Category created",
      id: this.lastID,
      category_name,
      date_created,
    });
  });
});

module.exports = router;
