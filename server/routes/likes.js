/**
 * @swagger
 * tags:
 *   name: Likes
 */

/**
 * @swagger
 * /api/events/{id}/like:
 *   post:
 *     summary: Like an event
 *     tags:
 *       - Likes
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to like
 *         schema:
 *           type: integer
 *     responses:
 *       201:
 *         description: Event liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event liked successfully
 *       403:
 *         description: Admins cannot like events
 *       409:
 *         description: Event already liked
 *       500:
 *         description: Database error
 */

/**
 * @swagger
 * /api/events/{id}/like:
 *   delete:
 *     summary: Unlike an event
 *     tags:
 *       - Likes
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the event to unlike
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Event unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event unliked successfully
 *       404:
 *         description: Like not found
 *       500:
 *         description: Database error
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../db/db-connection");

// Add like record
router.post("/:id/like", authMiddleware, (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  if (req.user.account_type === "admin") {
    return res.status(403).json({ error: "admins can't like events" });
  }

  // Check if already liked
  const checkSql = `SELECT * FROM likes WHERE user_id = ? AND event_id = ?`;
  db.get(checkSql, [userId, eventId], (err, row) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (row) return res.status(409).json({ error: "Already liked" });

    const insertSql = `INSERT INTO likes (user_id, event_id) VALUES (?, ?)`;
    db.run(insertSql, [userId, eventId], function (err) {
      if (err) return res.status(500).json({ error: "BD error" });
      return res.status(201).json({ message: "Event liked successfully" });
    });
  });
});

// Delete like record
router.delete("/:id/like", authMiddleware, (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const deleteSql = `DELETE FROM likes WHERE user_id = ? AND event_id = ?`;
  db.run(deleteSql, [userId, eventId], function (err) {
    if (err) return res.status(500).json({ error: "DB error" });
    if (this.changes === 0)
      return res.status(404).json({ error: "Like not found" });

    return res.status(200).json({ message: "Event unliked successfully" });
  });
});

module.exports = router;
