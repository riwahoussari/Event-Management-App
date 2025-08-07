/**
 * @swagger
 *  /api/events/{id}/register:
 *    post:
 *      tags:
 *        - Registrations
 *      summary: Register user for an event
 *      security:
 *        - cookieAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: integer
 *          description: ID of the event to register for
 *      responses:
 *        201:
 *          description: Registered successfully
 *        400:
 *          description: Registration deadline passed or event is full/inactive
 *        403:
 *          description: Admins and organizers can't register
 *        404:
 *          description: Event not found
 *        409:
 *          description: Already registered
 */

/**
 * @swagger
 *   /api/events/{id}/register:
 *   delete:
 *     tags:
 *       - Registrations
 *     summary: Cancel registration for an event (user only)
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the event to cancel registration from
 *     responses:
 *       200:
 *         description: Registration cancelled
 *       404:
 *         description: Registration not found
*/

/** 
 * @swagger
 *   /api/events/{id}/registrations:
 *     get:
 *       tags:
 *         - Registrations
 *       summary: View all registered users for an event (organizer & admin only)
 *       security:
 *         - cookieAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Event ID
 *       responses:
 *         200:
 *           description: List of registered users
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: integer
 *                     registration_date:
 *                       type: string
 *                       format: date
 *                     status:
 *                       type: string
 *                     attendance:
 *                       type: string
 *                     fullname:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phone_number:
 *                       type: string
 *                     profile_pic:
 *                       type: string
 *         403:
 *           description: Access denied
 *         404:
 *           description: Event not found
*/

/**
 * @swagger
 *   /api/events/{id}/register:
 *     patch:
 *       tags:
 *         - Registrations
 *       summary: Deny registration or mark attendance (organizer only)
 *       security:
 *         - cookieAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: Event ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: integer
 *                   description: ID of the user whose registration is being updated
 *                 status:
 *                   type: string
 *                   enum: [active, cancelled, denied]
 *                   example: denied
 *                   description: New registration status
 *                 attendance:
 *                   type: string
 *                   example: false
 *                   enum: [true, false]
 *                   description: Attendance status
 *       responses:
 *         200:
 *           description: Registration updated
 *         400:
 *           description: No valid fields to update
 *         403:
 *           description: Unauthorized or not the event owner
 *         404:
 *           description: Event or registration not found
 *   
 */

const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db/db-connection");
const authMiddleware = require("../middleware/auth");

// Register user for event
router.post("/:id/register", authMiddleware, (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  if (req.user.account_type === "admin") {
    return res.status(403).json({ error: "admins can't register for events" });
  }

  // Check if already registered
  const checkSql = `SELECT * FROM registrations WHERE user_id = ? AND event_id = ?`;
  db.get(checkSql, [userId, eventId], (err, row) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (row) return res.status(409).json({ error: "Already registered" });

    // Check ownership - status - capacity - deadline
    const eventSql = `SELECT * FROM events WHERE id = ?`;
    db.get(eventSql, [eventId], (err, event) => {
      if (err || !event)
        return res.status(404).json({ error: "Event not found" });

      if (event.status !== "active" || event.suspended === "true") {
        return res.status(400).json({ error: "event is inactive" });
      }

      if (userId === event.organizer_id) {
        return res
          .status(403)
          .json({ error: "Organizers can't register for their own events" });
      }

      const today = new Date().toISOString().split("T")[0];
      if (today > event.registration_deadline_date)
        return res
          .status(400)
          .json({ error: "Registration deadline has passed" });

      const countSql = `SELECT COUNT(*) AS count FROM registrations WHERE event_id = ?`;
      db.get(countSql, [eventId], (err, countRes) => {
        if (err) return res.status(500).json({ error: "DB error" });

        if (event.max_capacity && countRes.count >= event.max_capacity) {
          return res.status(400).json({ error: "Event is full" });
        }

        const insertSql = `INSERT INTO registrations (user_id, event_id, registration_date) VALUES (?, ?, ?)`;
        db.run(insertSql, [userId, eventId, today], (err) => {
          if (err) return res.status(500).json({ error: "DB error" });
          return res.status(201).json({ message: "Registered successfully" });
        });
      });
    });
  });
});

// Cancel registration
router.delete("/:id/register", authMiddleware, (req, res) => {
  const eventId = req.params.id;
  const userId = req.user.id;

  const sql = `UPDATE registrations SET status = 'cancelled' WHERE user_id = ? AND event_id = ?`;
  db.run(sql, [userId, eventId], function (err) {
    if (err) return res.status(500).json({ error: "DB error" });
    if (this.changes === 0)
      return res.status(404).json({ error: "Registration not found" });

    return res.status(200).json({ message: "Registration cancelled" });
  });
});

// View registrations (admin/organizer)
router.get("/:id/registrations", authMiddleware, (req, res) => {
  const eventId = req.params.id;

  const eventSql = `SELECT * FROM events WHERE id = ?`;
  db.get(eventSql, [eventId], (err, event) => {
    const isAdmin = req.user.account_type === "admin";
    const isOwner =
      req.user.account_type === "organizer" &&
      req.user.id === event.organizer_id;

    if (err || !event)
      return res.status(404).json({ error: "Event not found" });

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ error: "Access denied" });
    }

    const sql = `
      SELECT registrations.*, users.id, users.fullname, users.email, users.phone_number, users.profile_pic
      FROM registrations
      JOIN users ON users.id = registrations.user_id
      WHERE registrations.event_id = ?
    `;
    db.all(sql, [eventId], (err, rows) => {
      if (err) return res.status(500).json({ error: "DB error" });
      return res.json(rows);
    });
  });
});

// Organizer updates registration (deny/mark attendance)
router.patch("/:id/register", authMiddleware, (req, res) => {
  const eventId = req.params.id;
  const { user_id, status, attendance } = req.body;

  if (req.user.account_type !== "organizer")
    return res.status(403).json({ error: "Only organizers allowed" });

  const eventSql = `SELECT * FROM events WHERE id = ?`;
  db.get(eventSql, [eventId], (err, event) => {
    if (err || !event)
      return res.status(404).json({ error: "Event not found" });
    if (event.organizer_id !== req.user.id)
      return res.status(403).json({ error: "You don't own this event" });

    const updates = [];
    const values = [];

    if (status && ["denied", "active", "cancelled"].includes(status)) {
      updates.push("status = ?");
      values.push(status);
    }

    // can only update attendance if the event started
    const today = new Date().toISOString().split("T")[0];
    if (["true", "false"].includes(attendance) && event.start_date <= today) {
      updates.push("attendance = ?");
      values.push(attendance);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const updateSql = `UPDATE registrations SET ${updates.join(
      ", "
    )} WHERE event_id = ? AND user_id = ?`;
    db.run(updateSql, [...values, eventId, user_id], function (err) {
      if (err) return res.status(500).json({ error: "DB error" });
      if (this.changes === 0)
        return res.status(404).json({ error: "Registration not found" });
      return res.json({ message: "Registration updated" });
    });
  });
});

module.exports = router;
