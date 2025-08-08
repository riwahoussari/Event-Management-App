/**
 * @swagger
 * tags:
 *   name: Users
 */

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user's profile
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user to retrieve
 *     description: |
 *       **Access Control Rules:**
 *
 *       - 🔒 **User (self):** Can view all their own data.
 *       - 🛡️ **Admin:** Can view all data of any user except other admins.
 *       - 🚫 **No user (including admin)** can view another admin’s profile.
 *       - ❌ **No user (including admin)** can view password hashes.
 *       - 👤 **Regular User → Organizer:** Can view limited organizer fields:
 *         - `id`, `account_type`, `account_status`, `phone_number`, `organizer_name`, `profile_pic`
 *       - 🎤 **Organizer → User:** Can view full user profile **only if** the user has registered for at least one of their events.
 *
 *       Access is denied in all other cases.
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 fullname:
 *                   type: string
 *                 email:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 birthday:
 *                   type: string
 *                 account_type:
 *                   type: string
 *                 account_status:
 *                   type: string
 *                 phone_number:
 *                   type: string
 *                 profile_pic:
 *                   type: string
 *                 organizer_name:
 *                   type: string
 *                 promotion_date:
 *                   type: string
 *                 date_joined:
 *                   type: string
 *       403:
 *         description: Access denied
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Admin retrieves a list of users
 *     description: >
 *       **Access:** Admin only.
 *       Retrieve a list of users (excluding admins) with advanced filtering, searching, sorting, and pagination.
 *       - `role` is required and must be either 'regular' or 'organizer'.
 *       - Sorting is applied first, then filtering, then pagination.
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [regular, organizer]
 *         required: true
 *         description: Role of users to retrieve.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by fullname, email, or phone number (partial match).
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [male, female]
 *         description: Filter users by gender.
 *       - in: query
 *         name: min_age
 *         schema:
 *           type: integer
 *         description: Minimum age to filter.
 *       - in: query
 *         name: max_age
 *         schema:
 *           type: integer
 *         description: Maximum age to filter.
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [date_joined_most_recent, date_joined_oldest, alphabetical_a_z, alphabetical_z_a, age_oldest, age_yougest]
 *         description: Sorting option. Default is date_joined_most_recent.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Maximum number of results to return.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip for pagination.
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   fullname:
 *                     type: string
 *                   email:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   birthday:
 *                     type: string
 *                     format: date
 *                   account_type:
 *                     type: string
 *                   account_status:
 *                     type: string
 *                   phone_number:
 *                     type: string
 *                   profile_pic:
 *                     type: string
 *                   organizer_name:
 *                     type: string
 *                   promotion_date:
 *                     type: string
 *                     format: date
 *                   date_joined:
 *                     type: string
 *                     format: date
 *       400:
 *         description: Missing required role field
 *       403:
 *         description: Unauthorized – admin access required
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/users/{id}/suspend:
 *   patch:
 *     summary: Suspend a user account (admin only)
 *     description: Sets the user's account_status to "suspended". Only accessible by admin users.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to suspend
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User suspended
 *         content:
 *           application/json:
 *             example:
 *               message: "User suspended."
 *       403:
 *         description: Forbidden - only admins can suspend users
 *         content:
 *           application/json:
 *             example:
 *               error: "Forbidden."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             example:
 *               error: "DB error"
 */

/**
 * @swagger
 * /api/users/{id}/activate:
 *   patch:
 *     summary: Activate a user account (admin only)
 *     description: Sets the user's account_status to "active". Only accessible by admin users.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user to activate
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User account activated
 *         content:
 *           application/json:
 *             example:
 *               message: "User account activated."
 *       403:
 *         description: Forbidden - only admins can activate users
 *         content:
 *           application/json:
 *             example:
 *               error: "Forbidden."
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             example:
 *               error: "DB error"
 */

/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Update user profile (self only)
 *     description: Allows users to update their own phone number, birthday, profile picture, and gender.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the user (must match the authenticated user)
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       description: Fields to update
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone_number:
 *                 type: string
 *               birthday:
 *                 type: string
 *                 format: date
 *               profile_pic:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female]
 *           example:
 *             phone_number: "+1234567890"
 *             birthday: "1990-01-01"
 *             profile_pic: "https://example.com/img.png"
 *             gender: "male"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: "Profile updated successfully"
 *       400:
 *         description: No valid fields provided or invalid data
 *         content:
 *           application/json:
 *             example:
 *               error: "No valid fields provided for update"
 *       403:
 *         description: Forbidden - cannot update other users' profiles
 *         content:
 *           application/json:
 *             example:
 *               error: "You can only update your own profile"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               error: "User not found"
 *       500:
 *         description: Database error
 *         content:
 *           application/json:
 *             example:
 *               error: "Database error"
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../db/db-connection");

// GET /api/users/:id - View user profile
router.get("/:id", authMiddleware, (req, res) => {
  const requester = req.user;
  const targetUserId = parseInt(req.params.id);

  const getUserSql = `SELECT * FROM users WHERE id = ?`;
  db.get(getUserSql, [targetUserId], (err, targetUser) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    // No one can access any admin's profile except the admin himself
    if (targetUser.account_type === "admin" && requester.id !== targetUser.id) {
      return res.status(403).json({ error: "Access denied" });
    }

    const isSelf = requester.id === targetUserId;
    const isAdmin = requester.account_type === "admin";
    const isOrganizer = requester.account_type === "organizer";
    const isRegular = requester.account_type === "regular";
    const isTargetOrganizer = targetUser.account_type === "organizer";

    // If it's the user himself or an admin, return full info (excluding password)
    if (isSelf || isAdmin) {
      const { password_hash, ...safeUser } = targetUser;
      return res.status(200).json(safeUser);
    }

    // If a regular user is requesting a limited view of an organizer
    if (isRegular && isTargetOrganizer) {
      const {
        id,
        account_type,
        account_status,
        phone_number,
        organizer_name,
        profile_pic,
      } = targetUser;

      return res.status(200).json({
        id,
        account_type,
        account_status,
        phone_number,
        organizer_name,
        profile_pic,
      });
    }

    // If an organizer is requesting info about a regular user
    if (isOrganizer && targetUser.account_type === "regular") {
      // Check if target user is registered for one of organizer's events
      const checkSql = `
        SELECT * FROM registrations r
        JOIN events e ON e.id = r.event_id
        WHERE r.user_id = ? AND e.organizer_id = ?
        LIMIT 1
      `;
      db.get(checkSql, [targetUserId, requester.id], (err, match) => {
        if (err) return res.status(500).json({ error: "DB error" });
        if (!match) return res.status(403).json({ error: "Access denied" });

        const { password_hash, ...safeUser } = targetUser;
        return res.status(200).json(safeUser);
      });
    } else {
      return res.status(403).json({ error: "Access denied" });
    }
  });
});

// GET /api/users – Admin-only
router.get("/", authMiddleware, (req, res) => {
  if (req.user.account_type !== "admin") {
    return res.status(403).json({ error: "Only admins can access this route" });
  }

  const {
    role, // 'regular' or 'organizer'
    search, // keyword for fullname/email/phone_number
    gender, // 'male' or 'female'
    min_age, // e.g. 18
    max_age, // e.g. 30
    sort_by, // 'date_joined' | 'alphabetical' | 'age'
    limit = 20,
    offset = 0,
  } = req.query;

  if (!role) {
    return res
      .status(400)
      .json({ error: "role (regular/organizer) field is required" });
  }

  const values = [];
  const filters = ["account_type != 'admin'"];

  // Filtering
  if (role && (role === "regular" || role === "organizer")) {
    filters.push("account_type = ?");
    values.push(role);
  }

  if (gender && (gender === "male" || gender === "female")) {
    filters.push("gender = ?");
    values.push(gender);
  }

  if (min_age) {
    filters.push(`birthday <= date('now', '-${parseInt(min_age)} years')`);
  }

  if (max_age) {
    filters.push(`birthday >= date('now', '-${parseInt(max_age)} years')`);
  }

  if (search) {
    filters.push(`(fullname LIKE ? OR email LIKE ? OR phone_number LIKE ?)`);
    const s = `%${search}%`;
    values.push(s, s, s);
  }

  // Sorting default = date_joined_most_recent
  let orderBy = "date_joined DESC";
  if (sort_by === "date_joined_most_recent") {
    orderBy = "date_joined DESC";
  } else if (sort_by === "date_joined_oldest") {
    orderBy = "date_joined ASC";
  } else if (sort_by === "alphabetical_a_z") {
    orderBy = "fullname COLLATE NOCASE ASC";
  } else if (sort_by === "alphabetical_z_a") {
    orderBy = "fullname COLLATE NOCASE DESC";
  } else if (sort_by === "age_oldest") {
    orderBy = "birthday ASC"; // older people have earlier birthdays
  } else if (sort_by === "age_yougest") {
    orderBy = "birthday DESC";
  }

  const whereClause = filters.length ? `WHERE ${filters.join(" AND ")}` : "";

  const sql = `
    SELECT id, fullname, email, gender, birthday, account_type, account_status,
           phone_number, profile_pic, organizer_name, promotion_date, date_joined
    FROM users
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  values.push(Number(limit), Number(offset));

  db.all(sql, values, (err, rows) => {
    if (err) return res.status(500).json({ error: "DB error" });
    res.status(200).json(rows);
  });
});

// PATCH /api/users/:id/suspend Suspend user - admin only
router.patch("/:id/suspend", authMiddleware, (req, res) => {
  if (req.user.account_type !== "admin") {
    return res.status(403).json({ error: "Forbidden." });
  }

  const userId = Number(req.params.id);
  const sql = `UPDATE users SET account_status = 'suspended' WHERE id = ?`;

  db.run(sql, [userId], function (err) {
    if (err) return res.status(500).json({ error: "DB error" });
    if (this.changes === 0)
      return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ message: "User suspended." });
  });
});

// PATCH /api/users/:id/activate Activate user - admin only
router.patch("/:id/activate", authMiddleware, (req, res) => {
  if (req.user.account_type !== "admin") {
    return res.status(403).json({ error: "Forbidden." });
  }

  const userId = Number(req.params.id);
  const sql = `UPDATE users SET account_status = 'active' WHERE id = ?`;

  db.run(sql, [userId], function (err) {
    if (err) return res.status(500).json({ error: "DB error" });
    if (this.changes === 0)
      return res.status(404).json({ error: "User not found" });

    return res.status(200).json({ message: "User account activated." });
  });
});

// PATCH /api/users/:id Update user profile - only the user himself
router.patch("/:id", authMiddleware, (req, res) => {
  const userId = Number(req.params.id);

  // Only the user themselves can update their profile
  if (req.user.id !== userId) {
    return res
      .status(403)
      .json({ error: "You can only update your own profile" });
  }

  const { phone_number, birthday, profile_pic, gender } = req.body;

  const updates = [];
  const values = [];

  if (phone_number !== undefined) {
    updates.push("phone_number = ?");
    values.push(phone_number);
  }

  if (birthday !== undefined) {
    updates.push("birthday = ?");
    values.push(birthday);
  }

  if (profile_pic !== undefined) {
    updates.push("profile_pic = ?");
    values.push(profile_pic);
  }

  if (gender === "male" || gender === "female") {
    updates.push("gender = ?");
    values.push(gender);
  }

  if (updates.length === 0) {
    return res
      .status(400)
      .json({ error: "No valid fields provided for update" });
  }

  const sql = `
    UPDATE users
    SET ${updates.join(", ")}
    WHERE id = ?
  `;
  values.push(userId);

  db.run(sql, values, function (err) {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Profile updated successfully" });
  });
});

module.exports = router;
