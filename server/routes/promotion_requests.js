/**
 * @swagger
 * tags:
 *   name: Promotion Requests
 */

/**
 * @swagger
 * /api/promotion-requests/{userId}:
 *   get:
 *     summary: Check if a user has a pending promotion request
 *     description: |
 *       Returns the **latest pending promotion request** for the specified user.
 *
 *       **Access rules:**
 *       - **Admin**: Can check for any user.
 *       - **User**: Can only check their own request.
 *       - Returns **404** if no pending request exists.
 *     tags:
 *       - Promotion Requests
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the user to check.
 *     responses:
 *       200:
 *         description: Latest pending promotion request found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 12
 *                 user_id:
 *                   type: integer
 *                   example: 5
 *                 status:
 *                   type: string
 *                   example: pending
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-08-01T12:34:56Z"
 *                 additional_info:
 *                   type: string
 *                   example: "Reason for promotion..."
 *       403:
 *         description: Forbidden – User is not authorized to view this request.
 *       500:
 *         description: Database error.
 */

/**
 * @swagger
 * /api/promotion-requests:
 *   post:
 *     summary: Submit a promotion request (regular users only)
 *     description: Regular users can request to become organizers. Cannot submit if a pending request already exists.
 *     tags: [Promotion Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - requested_organizer_name
 *               - why_message
 *             properties:
 *               requested_organizer_name:
 *                 type: string
 *               why_message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Promotion request submitted
 *       400:
 *         description: Missing fields or already pending
 *       403:
 *         description: Only regular users can request promotion
 *       500:
 *         description: DB error
 */

/**
 * @swagger
 * /api/promotion-requests:
 *   get:
 *     summary: Get all pending promotion requests (admin only)
 *     description: Admins can view all pending promotion requests
 *     tags: [Promotion Requests]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of pending promotion requests
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user_id:
 *                     type: integer
 *                   request_date:
 *                     type: string
 *                     format: date
 *                   requested_organizer_name:
 *                     type: string
 *                   why_message:
 *                     type: string
 *                   fullname:
 *                     type: string
 *                   profile_pic:
 *                     type: string
 *       403:
 *         description: Only admins can view promotion requests
 *       500:
 *         description: DB error
 */

/**
 * @swagger
 * /api/promotion-requests/{userId}/accept:
 *   patch:
 *     summary: Accept a promotion request (admin only)
 *     description: Admins approve the promotion request and promote user to organizer
 *     tags: [Promotion Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User promoted to organizer
 *       403:
 *         description: Only admins can approve promotion requests
 *       404:
 *         description: Promotion request not found
 *       500:
 *         description: DB error
 */

/**
 * @swagger
 * /api/promotion-requests/{userId}/reject:
 *   patch:
 *     summary: Reject a promotion request (admin only)
 *     description: Admins reject a pending promotion request
 *     tags: [Promotion Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Promotion request rejected
 *       403:
 *         description: Only admins can reject promotion requests
 *       404:
 *         description: Pending promotion request not found
 *       500:
 *         description: DB error
 */

const express = require("express");
const router = express.Router();
const db = require("../db/db-connection");
const authMiddleware = require("../middleware/auth");

// GET /api/promotion-requests/:userId - Check if user has a pending promotion request
router.get("/:userId", authMiddleware, (req, res) => {
  const { userId } = req.params;

  // Only admin or the user himself
  if (req.user.account_type !== "admin" && req.user.id !== parseInt(userId)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const sql = `
    SELECT *
    FROM promotion_requests
    WHERE user_id = ? AND status = 'pending'
    ORDER BY request_date DESC
    LIMIT 1
  `;

  db.get(sql, [userId], (err, row) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(row);
  });
});

// POST /api/promotion-requests – user submits request to become organizer
router.post("/", authMiddleware, (req, res) => {
  const userId = req.user.id;

  if (req.user.account_type !== "regular") {
    return res
      .status(403)
      .json({ error: "Only regular users can request promotion" });
  }

  const { requested_organizer_name, why_message } = req.body;
  if (!requested_organizer_name || !why_message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const checkSql = `SELECT * FROM promotion_requests WHERE user_id = ? AND status = 'pending' LIMIT 1`;
  db.get(checkSql, [userId], (err, row) => {
    if (err) return res.status(500).json({ error: "DB error" });

    if (row) {
      return res
        .status(400)
        .json({ error: "You already have a pending request" });
    }

    const today = new Date().toISOString().split("T")[0];
    const insertSql = `
      INSERT INTO promotion_requests (user_id, status, request_date, requested_organizer_name, why_message)
      VALUES (?, 'pending', ?, ?, ?)
    `;
    db.run(
      insertSql,
      [userId, today, requested_organizer_name, why_message],
      (err) => {
        if (err) return res.status(500).json({ error: "DB error" });
        return res.status(201).json({ message: "Promotion request submitted" });
      }
    );
  });
});

// GET /api/promotion-requests – admin views pending requests
router.get("/", authMiddleware, (req, res) => {
  if (req.user.account_type !== "admin") {
    return res
      .status(403)
      .json({ error: "Only admins can view promotion requests" });
  }

  const sql = `
    SELECT pr.user_id, pr.request_date, pr.requested_organizer_name, pr.why_message, u.fullname, u.profile_pic
    FROM promotion_requests pr
    JOIN users u ON u.id = pr.user_id
    WHERE pr.status = 'pending'
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    return res.json(rows);
  });
});

// PATCH /api/promotion-requests/:userId/accept – approve request
router.patch("/:userId/accept", authMiddleware, (req, res) => {
  if (req.user.account_type !== "admin") {
    return res
      .status(403)
      .json({ error: "Only admins can approve promotion requests" });
  }

  const userId = req.params.userId;

  const getRequestSql = `SELECT * FROM promotion_requests WHERE user_id = ? AND status = 'pending'`;
  db.get(getRequestSql, [userId], (err, request) => {
    if (err) {
      return res.status(500).json({ error: "BD error" });
    }
    if (!request) {
      return res.status(404).json({ error: "Promotion request not found" });
    }

    const updateUserSql = `UPDATE users SET account_type = 'organizer', organizer_name = ? WHERE id = ?`;
    const updateRequestSql = `UPDATE promotion_requests SET status = 'accepted' WHERE user_id = ? AND status = 'pending' `;

    db.run(updateUserSql, [request.requested_organizer_name, userId], (err) => {
      if (err) return res.status(500).json({ error: "DB error" });

      db.run(updateRequestSql, [userId], (err) => {
        if (err) return res.status(500).json({ error: "DB error" });
        return res.status(200).json({ message: "User promoted to organizer" });
      });
    });
  });
});

// PATCH /api/promotion-requests/:userId/reject – reject request
router.patch("/:userId/reject", authMiddleware, (req, res) => {
  if (req.user.account_type !== "admin") {
    return res
      .status(403)
      .json({ error: "Only admins can reject promotion requests" });
  }

  const userId = req.params.userId;

  const sql = `UPDATE promotion_requests SET status = 'rejected' WHERE user_id = ? AND status = 'pending'`;
  db.run(sql, [userId], function (err) {
    if (err) return res.status(500).json({ error: "DB error" });
    if (this.changes === 0)
      return res
        .status(404)
        .json({ error: "Pending promotion request not found" });

    return res.json({ message: "Promotion request rejected" });
  });
});

module.exports = router;
