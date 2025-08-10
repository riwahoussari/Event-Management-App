/**
 * @swagger
 * /api/stats/platform:
 *   get:
 *     summary: Get platform-wide statistics
 *     description: |
 *       Returns aggregated statistics for the entire platform.
 *       Accessible only to admin users.
 *     tags:
 *       - Stats
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Platform statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users_count:
 *                   type: integer
 *                   example: 1500
 *                   description: Total number of registered users
 *                 new_users_this_month:
 *                   type: integer
 *                   example: 120
 *                   description: Number of new users registered in the current month
 *                 organizers_count:
 *                   type: integer
 *                   example: 50
 *                   description: Number of users with account type "organizer"
 *                 new_users_by_month:
 *                   type: array
 *                   description: Number of new users for each month in the last 6 months
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2025-04"
 *                       count:
 *                         type: integer
 *                         example: 25
 *                 female_users:
 *                   type: integer
 *                   example: 700
 *                   description: Number of female users
 *                 male_users:
 *                   type: integer
 *                   example: 800
 *                   description: Number of male users
 *                 events_count:
 *                   type: integer
 *                   example: 350
 *                   description: Total number of events on the platform
 *                 events_next_month:
 *                   type: integer
 *                   example: 45
 *                   description: Number of events starting within the next 30 days
 *                 registrations_count:
 *                   type: integer
 *                   example: 1200
 *                   description: Total number of registrations across all events
 *                 total_attendants:
 *                   type: integer
 *                   example: 950
 *                   description: Total number of attendants across all events
 *                 attendance_rate:
 *                   type: number
 *                   format: float
 *                   example: 79.17
 *                   description: Percentage of attendants compared to active registrations
 *                 events_count_per_month:
 *                   type: array
 *                   description: Number of events created per month in the last 6 months
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2025-05"
 *                       count:
 *                         type: integer
 *                         example: 60
 *                 events_count_by_category:
 *                   type: array
 *                   description: Number of events per category
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_name:
 *                         type: string
 *                         example: "Music"
 *                       count:
 *                         type: integer
 *                         example: 40
 *                 registrations_count_by_category:
 *                   type: array
 *                   description: Number of registrations grouped by event category
 *                   items:
 *                     type: object
 *                     properties:
 *                       category_name:
 *                         type: string
 *                         example: "Sports"
 *                       count:
 *                         type: integer
 *                         example: 100
 *                 registrations_by_month:
 *                   type: array
 *                   description: Number of registrations per month for the last 6 months
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: "2025-02"
 *                       count:
 *                         type: integer
 *                         example: 180
 *       '403':
 *         description: Access denied (only admins allowed)
 *       '500':
 *         description: Database error
 */

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../db/db-connection");

function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

router.get("/platform", authMiddleware, async (req, res) => {
  if (req.user.account_type !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  const stats = {
    users_count: 0,
    new_users_this_month: 0,
    organizers_count: 0,
    new_users_by_month: [],
    female_users: 0,
    male_users: 0,
    events_count: 0,
    events_next_month: 0,
    registrations_count: 0,
    total_attendants: 0,
    attendance_rate: 0,
    events_count_per_month: [],
    events_count_by_category: [],
    registrations_count_by_category: [],
    registrations_by_month: [],
  };

  try {
    // Users stats
    const totalUsers = await dbGet(`SELECT COUNT(*) AS count FROM users`);
    stats.users_count = totalUsers.count;

    const newUsers = await dbGet(
      `SELECT COUNT(*) AS count FROM users 
       WHERE strftime('%Y-%m', date_joined) = strftime('%Y-%m', 'now')`
    );
    stats.new_users_this_month = newUsers.count;

    const organizers = await dbGet(
      `SELECT COUNT(*) AS count FROM users WHERE account_type = 'organizer'`
    );
    stats.organizers_count = organizers.count;

    stats.new_users_by_month = await dbAll(
      `SELECT strftime('%Y-%m', date_joined) AS month, COUNT(*) AS count
       FROM users
       WHERE date_joined >= date('now', '-6 months')
       GROUP BY month
       ORDER BY month`
    );

    const genders = await dbAll(
      `SELECT gender, COUNT(*) AS count FROM users GROUP BY gender`
    );
    genders.forEach((g) => {
      if (g.gender === "male") stats.male_users = g.count;
      if (g.gender === "female") stats.female_users = g.count;
    });

    // Events stats
    const totalEvents = await dbGet(`SELECT COUNT(*) AS count FROM events`);
    stats.events_count = totalEvents.count;

    const upcomingEvents = await dbGet(
      `SELECT COUNT(*) AS count FROM events
       WHERE start_date BETWEEN date('now') AND date('now', '+30 days')`
    );
    stats.events_next_month = upcomingEvents.count;

    stats.events_count_per_month = await dbAll(
      `SELECT strftime('%Y-%m', start_date) AS month, COUNT(*) AS count
       FROM events
       WHERE start_date >= date('now', '-6 months')
       GROUP BY month
       ORDER BY month`
    );

    stats.events_count_by_category = await dbAll(
      `SELECT categories.category_name, COUNT(events.id) AS count
       FROM events
       JOIN categories ON events.category = categories.id
       GROUP BY categories.category_name`
    );

    // Registrations stats
    const allRegistrations = await dbAll(
      `SELECT status, attendance FROM registrations`
    );
    stats.registrations_count = allRegistrations.length;
    let activeRegs = 0;
    allRegistrations.forEach((r) => {
      if (r.status === "active") activeRegs++;
      if (r.attendance === "true") stats.total_attendants++;
    });
    stats.attendance_rate =
      activeRegs > 0
        ? parseFloat((stats.total_attendants / activeRegs).toFixed(2)) * 100
        : 0;

    stats.registrations_count_by_category = await dbAll(
      `SELECT categories.category_name, COUNT(registrations.status) AS count
       FROM registrations
       JOIN events ON registrations.event_id = events.id
       JOIN categories ON events.category = categories.id
       GROUP BY categories.category_name`
    );

    stats.registrations_by_month = await dbAll(
      `SELECT strftime('%Y-%m', registration_date) AS month, COUNT(*) AS count
       FROM registrations
       WHERE registration_date >= date('now', '-6 months')
       GROUP BY month
       ORDER BY month`
    );

    return res.json(stats);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Database error", details: err.message });
  }
});

module.exports = router;
