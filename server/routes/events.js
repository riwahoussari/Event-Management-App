/**
 * @swagger
 * tags:
 *   name: Events
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve a list of events available to the authenticated user
 *     description: >
 *       Returns a list of events with optional filters, sorting, and pagination.
 *       Filters include: liked, registered, categories, city, date range, ongoing, completed, and text search.
 *       Sorting options include:
 *       - closest (by start date) (default)
 *       - popular (by number of registrations)
 *       - deadline (by closest registration deadline)
 *       Results vary based on user role:
 *       - No one can see deleted events
 *       - Regular users cannot see suspended
 *       - Organizers can see their own suspended events
 *     tags:
 *       - Events
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: liked
 *         schema:
 *           type: string
 *           example: 'true'
 *         description: Set to 'true' to return only liked events by the user. Defaults to 'false'
 *       - in: query
 *         name: owner
 *         schema:
 *           type: integer
 *           example: 3
 *         description: set ownerId to filter by event owner.
 *       - in: query
 *         name: registered
 *         schema:
 *           type: string
 *           example: 'true'
 *         description: Set to 'true' to return only events the user is registered for (non-cancelled)
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *           example: '1,3'
 *         description: Comma-separated list of category IDs to filter by category
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           example: 'Beirut'
 *         description: Filter by city name (case-insensitive)
 *       - in: query
 *         name: start_date
 *         schema:
 *           type: string
 *           format: date
 *           example: '2025-01-01'
 *         description: Start of date range (YYYY-MM-DD)
 *       - in: query
 *         name: end_date
 *         schema:
 *           type: string
 *           format: date
 *           example: '2025-12-31'
 *         description: End of date range (YYYY-MM-DD)
 *       - in: query
 *         name: ongoing
 *         schema:
 *           type: string
 *           example: 'true'
 *         description: set to 'true' to return ongoing events. Defaults to 'false'
 *       - in: query
 *         name: completed
 *         schema:
 *           type: string
 *           example: 'false'
 *         description: Filter by completed events. 'true' = past, 'false' = ongoing/future
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: 'Nancy'
 *         description: Search by event title or organizer name (case-insensitive)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [closest, popular, deadline]
 *           example: 'popular'
 *         description: Sorting option
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 10
 *         description: Number of events to return (default 20)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           example: 0
 *         description: Offset to start from (default 0)
 *     responses:
 *       200:
 *         description: A list of matching events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   event_banner:
 *                     type: string
 *                     example: 'https://host.com/image_slug.png'
 *                   title:
 *                     type: string
 *                     example: 'Music Concert'
 *                   description:
 *                     type: string
 *                     example: 'Event description here.'
 *                   category:
 *                     type: integer
 *                     example: 2
 *                   category_name:
 *                     type: string
 *                     example: 'Music'
 *                   tags:
 *                     type: string
 *                     example: 'paid,12+,exclusive'
 *                   city:
 *                     type: string
 *                     example: 'Beirut'
 *                   country:
 *                     type: string
 *                     example: 'Lebanon'
 *                   full_address:
 *                     type: string
 *                     example: 'Downtown Hall, Main Street'
 *                   start_date:
 *                     type: string
 *                     format: date
 *                     example: '2025-09-10'
 *                   start_time:
 *                     type: string
 *                     example: '19:00'
 *                   end_date:
 *                     type: string
 *                     format: date
 *                     example: '2025-09-12'
 *                   end_time:
 *                     type: string
 *                     example: '23:00'
 *                   registration_deadline_date:
 *                     type: string
 *                     example: '2025-09-01'
 *                   registration_deadline_time:
 *                     type: string
 *                     example: '23:59'
 *                   cancellation_deadline_date:
 *                     type: string
 *                     example: '2025-09-05'
 *                   cancellation_deadline_time:
 *                     type: string
 *                     example: '23:59'
 *                   organizer_name:
 *                     type: string
 *                     example: 'Nancy Ajram'
 *                   organizer_id:
 *                     type: integer
 *                     example: 11
 *                   organizer_profile_pic:
 *                     type: string
 *                     example: 'https://host.com/profile.png'
 *                   likes:
 *                     type: integer
 *                     example: 2048
 *                   views_count:
 *                     type: integer
 *                     example: 9874
 *                   max_capacity:
 *                     type: integer
 *                     example: 5000
 *                   status:
 *                     type: string
 *                     example: 'active'
 *                   suspended:
 *                     type: string
 *                     example: 'false'
 *                   date_created:
 *                     type: string
 *                     example: '2025-08-01'
 *                   isLikedByUser:
 *                     type: boolean
 *                     example: true
 *                   registration_status:
 *                     type: string
 *                     example: 'confirmed'
 *                     description: Only returned when `registered=true` is passed
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get a single event by ID
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *           example: 1
 *         required: true
 *         description: ID of the event to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved event
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 event_banner:
 *                   type: string
 *                   example: 'https://host.com/image_slug.png'
 *                 title:
 *                   type: string
 *                   example: 'Music Concert'
 *                 description:
 *                   type: string
 *                   example: 'lorem ipsum dolor sit amet consectetutoe avif loremsum.'
 *                 category:
 *                   type: integer
 *                   example: 2
 *                 category_name:
 *                   type: string
 *                   example: 'Music'
 *                 tags:
 *                   type: string
 *                   example: 'paid,12+,exclusive'
 *                 city:
 *                   type: string
 *                   example: 'Beirut'
 *                 country:
 *                   type: string
 *                   example: 'Lebanon'
 *                 full_address:
 *                   type: string
 *                   example: 'The Music Hall, Starco Center, Omar Daouk Street, Downtown.'
 *                 start_date:
 *                   type: string
 *                   example: '2025-01-01'
 *                 start_time:
 *                   type: string
 *                   example: '19:00'
 *                 end_date:
 *                   type: string
 *                   example: '2025-01-01'
 *                 end_time:
 *                   type: string
 *                   example: '19:00'
 *                 registration_deadline_date:
 *                   type: string
 *                   example: '2025-01-01'
 *                 registration_deadline_time:
 *                   type: string
 *                   example: '19:00'
 *                 cancellation_deadline_date:
 *                   type: string
 *                   example: '2025-01-01'
 *                 cancellation_deadline_time:
 *                   type: string
 *                   example: '19:00'
 *                 organizer_name:
 *                   type: string
 *                   example: 'Nancy Ajram'
 *                 organizer_id:
 *                   type: integer
 *                   example: 11
 *                 likes:
 *                   type: integer
 *                   example: 2048
 *                 views_count:
 *                   type: integer
 *                   example: 9874
 *                 max_capacity:
 *                   type: integer
 *                   example: 5000
 *                 status:
 *                   type: string
 *                   example: active/cancelled/deleted
 *                 suspended:
 *                   type: string
 *                   example: true/false
 *                 date_created:
 *                   type: string
 *                   example: '2025-01-01'
 *       403:
 *         description: Not authorized to view this event
 *       404:
 *         description: Event not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event (organizer only)
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - event_banner
 *               - start_date
 *               - start_time
 *               - end_date
 *               - end_time
 *               - country
 *               - city
 *               - full_address
 *               - registration_deadline_date
 *               - registration_deadline_time
 *               - cancellation_deadline_date
 *               - cancellation_deadline_time
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: integer
 *               event_banner:
 *                 type: string
 *                 description: File path or URL
 *               start_date:
 *                 type: string
 *                 format: date
 *               start_time:
 *                 type: string
 *                 example: "13:00"
 *               end_date:
 *                 type: string
 *                 format: date
 *               end_time:
 *                 type: string
 *                 example: "16:00"
 *               country:
 *                 type: string
 *               city:
 *                 type: string
 *               full_address:
 *                 type: string
 *               registration_deadline_date:
 *                 type: string
 *                 format: date
 *               registration_deadline_time:
 *                 type: string
 *               cancellation_deadline_date:
 *                 type: string
 *                 format: date
 *               cancellation_deadline_time:
 *                 type: string
 *               tags:
 *                 type: string
 *                 description: Comma-separated tags (optional)
 *               max_capacity:
 *                 type: integer
 *                 description: Max number of registrants (optional)
 *     responses:
 *       201:
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event created successfully.
 *                 event_id:
 *                   type: integer
 *       400:
 *         description: Missing required fields
 *       403:
 *         description: Only organizers can create events
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/events/{id}:
 *   patch:
 *     summary: Update event (organizer only / admin can only change "suspended")
 *     tags: [Events]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 3
 *         description: Event ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event_banner:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [active, cancelled, removed]
 *               suspended:
 *                 type: string
 *                 enum: [true, false]
 *               city:
 *                 type: string
 *               full_address:
 *                 type: string
 *               start_date:
 *                 type: string
 *               start_time:
 *                 type: string
 *               end_date:
 *                 type: string
 *               end_time:
 *                 type: string
 *               tags:
 *                 type: string
 *                 description: Comma-separated
 *               max_capacity:
 *                 type: integer
 *               registration_deadline_date:
 *                 type: string
 *               registration_deadline_time:
 *                 type: string
 *               cancellation_deadline_date:
 *                 type: string
 *               cancellation_deadline_time:
 *                 type: string
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       403:
 *         description: Unauthorized to update this event
 *       404:
 *         description: Event not found
 *       400:
 *         description: Invalid request
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 *
 * paths:
 *   /api/events/{id}/stats:
 *     get:
 *       summary: Get statistics for a single event
 *       description: |
 *         Returns various statistics for a specific event.  
 *         Only the event organizer and admins can access this endpoint.
 *       tags:
 *         - Stats
 *       security:
 *         - bearerAuth: []
 *       parameters:
 *         - in: path
 *           name: id
 *           required: true
 *           schema:
 *             type: integer
 *           description: ID of the event to retrieve stats for
 *       responses:
 *         '200':
 *           description: Successful response with event statistics
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   total_likes:
 *                     type: integer
 *                     example: 35
 *                   total_views:
 *                     type: integer
 *                     example: 1500
 *                   total_registrations:
 *                     type: integer
 *                     example: 120
 *                   total_active_registrations:
 *                     type: integer
 *                     example: 100
 *                   total_cancelled_registrations:
 *                     type: integer
 *                     example: 15
 *                   total_denied_registrations:
 *                     type: integer
 *                     example: 5
 *                   conversion_rate:
 *                     type: number
 *                     format: float
 *                     example: 8.0
 *                     description: Percentage of views converted to registrations
 *                   registrations_last_6_months:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         month:
 *                           type: string
 *                           example: "2025-03"
 *                         count:
 *                           type: integer
 *                           example: 20
 *                   total_attendants:
 *                     type: integer
 *                     example: 90
 *                   attendance_rate:
 *                     type: number
 *                     format: float
 *                     example: 90.0
 *                     description: Percentage of active registrations who attended
 *                   female_registrations:
 *                     type: integer
 *                     example: 60
 *                   male_registrations:
 *                     type: integer
 *                     example: 60
 *         '400':
 *           description: Invalid event ID
 *         '403':
 *           description: Access denied (not admin or event organizer)
 *         '404':
 *           description: Event not found
 *         '500':
 *           description: Database error
*/

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth");
const db = require("../db/db-connection");

// List of events (with filter - sort - search - limit...)
router.get("/", authMiddleware, (req, res) => {
  let {
    search,
    categories,
    start_date,
    end_date,
    ongoing,
    completed = "false",
    city,
    sort,
    limit = 20,
    offset = 0,
    liked = "false",
    registerId = "0",
    owner = "0",
  } = req.query;

  // Normalize
  limit = parseInt(limit);
  offset = parseInt(offset);
  if (isNaN(limit)) limit = 20;
  if (isNaN(offset)) offset = 0;

  // no one can see deleted events
  const conditions = ["events.status != 'deleted'"];
  const params = [];

  // regular users can't see suspended events (suspended by admin)
  if (req.user.account_type === "regular")
    conditions.push("events.suspended != 'true'");

  // organizers can see suspended events ONLY IF the own them
  if (req.user.account_type === "organizer") {
    conditions.push(
      "(events.suspended != 'true' OR (events.suspended = 'true' AND events.organizer_id = ?))"
    );
    params.push(req.user.id);
  }

  if (search) {
    conditions.push("(events.title LIKE ? OR users.organizer_name LIKE ?)");
    const keyword = `%${search.toLowerCase()}%`;
    params.push(keyword, keyword);
  }

  if (categories) {
    const catList = categories
      .split(",")
      .map((c) => parseInt(c.trim()))
      .filter(Boolean);
    if (catList.length > 0) {
      const placeholders = catList.map(() => "?").join(",");
      conditions.push(`events.category IN (${placeholders})`);
      params.push(...catList);
    }
  }

  if (start_date) {
    conditions.push("events.start_date >= ?");
    params.push(start_date);
  }

  if (end_date) {
    conditions.push("events.end_date <= ?");
    params.push(end_date);
  }

  const today = new Date().toISOString().split("T")[0];

  if (ongoing === "true") {
    conditions.push("events.start_date <= ?");
    conditions.push("events.end_date >= ?");
    params.push(today, today);
  }

  if (completed) {
    if (completed === "true") {
      conditions.push("events.end_date < ?");
      params.push(today);
    } else if (completed === "false") {
      conditions.push("events.end_date >= ?");
      params.push(today);
    }
  }

  if (city) {
    conditions.push("LOWER(events.city) = ?");
    params.push(city.toLowerCase());
  }

  const ownerId = parseInt(owner);
  if (!isNaN(ownerId) && ownerId !== 0) {
    conditions.push("events.organizer_id = ?");
    params.push(ownerId);
  }

  // registrations filter
  let regId = 0;
  let parsedId = parseInt(registerId);
  if (!isNaN(parsedId) && parsedId !== 0) {
    if (req.user.account_type === "admin" || req.user.id === parsedId) {
      regId = parsedId;
    } else if (req.user.account_type === "organizer") {
      conditions.push("events.organizer_id = ?");
      params.push(req.user.id);
      regId = parsedId;
    } else {
      return res.status(409).json({ error: "denied access register" });
    }
  }

  // Sorting logic
  let orderBy = "events.start_date ASC"; // default
  if (sort === "popular") {
    orderBy =
      "(SELECT COUNT(*) FROM registrations WHERE event_id = events.id) DESC";
  } else if (sort === "deadline") {
    orderBy = "events.registration_deadline_date ASC";
  }

  const whereClause = conditions.length
    ? `WHERE ${conditions.join(" AND ")}`
    : "";

  const sql = `
    SELECT 
      events.*, 
      users.organizer_name, 
      users.profile_pic AS organizer_profile_pic,
      categories.category_name, 
      ${
        regId !== 0
          ? "r.status AS registration_status, r.registration_date, r.attendance,"
          : ""
      }
      (likes.event_id IS NOT NULL) AS isLikedByUser
    FROM events
    JOIN users ON users.id = events.organizer_id
    JOIN categories ON categories.id = events.category
    ${
      liked === "true" ? "JOIN" : "LEFT JOIN"
    } likes ON likes.event_id = events.id AND likes.user_id = ?
    ${
      regId !== 0
        ? "JOIN registrations r ON r.event_id = events.id AND r.user_id = ? AND r.status != 'cancelled' "
        : ""
    }
    ${whereClause}
    ORDER BY ${orderBy}
    LIMIT ? OFFSET ?
  `;

  // add user id for registrations table joining
  if (regId !== 0) params.unshift(regId);
  // add user id for likes table joining
  params.unshift(req.user.id);

  params.push(limit, offset);

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ error: "Database error" });
    }

    res.status(200).json(rows);
  });
});

// get single event by id
router.get("/:id", authMiddleware, (req, res) => {
  const eventId = req.params.id;
  const user = req.user;

  // Fetch the event
  const sql = `
    SELECT 
      events.*, 
      users.organizer_name, 
      users.profile_pic AS organizer_profile_pic,
      categories.category_name,
      r.status AS user_registration_status
    FROM events
    JOIN users ON users.id = events.organizer_id
    JOIN categories ON categories.id = events.category
    LEFT JOIN registrations r ON r.user_id = ? AND r.event_id = ?
    WHERE events.id = ?
  `;

  db.get(sql, [req.user.id, eventId, eventId], (err, event) => {
    if (err) return res.status(500).json({ error: "Database error." });
    if (!event) return res.status(404).json({ error: "Event not found." });

    if (event.status === "deleted") {
      return res.status(404).json({ error: "Event not found." });
    }

    // Apply authorization logic
    const isOwner =
      user &&
      user.account_type === "organizer" &&
      user.id === event.organizer_id;
    const isAdmin = user && user.account_type === "admin";
    const isRegular = user && user.account_type === "regular";

    // only return the event if admin or owner when  suspended = true
    if (event.suspended === "true" && (isRegular || !isOwner) && !isAdmin) {
      return res
        .status(403)
        .json({ error: "Not authorized to view this event." });
    }

    // Increment views count
    const incrementViews = `UPDATE events SET views_count = views_count + 1 WHERE id = ?`;
    db.run(incrementViews, [eventId], (err) => {
      if (err) console.error("Failed to increment views_count:", err);
    });

    res.status(200).json(event);
  });
});

// create new event (organizers only)
router.post("/", authMiddleware, (req, res) => {
  const user = req.user;

  // Ensure the user is an organizer
  if (user.account_type !== "organizer") {
    return res
      .status(403)
      .json({ message: "Only organizers can create events." });
  }

  const {
    title,
    description,
    category,
    event_banner,
    start_date,
    start_time,
    end_date,
    end_time,
    country,
    city,
    full_address,
    registration_deadline_date,
    registration_deadline_time,
    cancellation_deadline_date,
    cancellation_deadline_time,
    tags = null,
    max_capacity = null,
  } = req.body;

  // Validate required fields
  const requiredFields = [
    title,
    description,
    category,
    event_banner,
    start_date,
    start_time,
    end_date,
    end_time,
    country,
    city,
    full_address,
    registration_deadline_date,
    registration_deadline_time,
    cancellation_deadline_date,
    cancellation_deadline_time,
  ];

  if (requiredFields.some((field) => field === undefined)) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  const sql = `
    INSERT INTO events (
      organizer_id, date_created, event_banner, category,
      title, description, country, city, full_address,
      start_date, start_time, end_date, end_time,
      tags, max_capacity,
      registration_deadline_date, registration_deadline_time,
      cancellation_deadline_date, cancellation_deadline_time,
      views_count, status, suspended
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 'active', 'false')
  `;

  const today = new Date().toISOString().split("T")[0];

  const params = [
    user.id,
    today,
    event_banner,
    category,
    title,
    description,
    country,
    city,
    full_address,
    start_date,
    start_time,
    end_date,
    end_time,
    tags,
    max_capacity,
    registration_deadline_date,
    registration_deadline_time,
    cancellation_deadline_date,
    cancellation_deadline_time,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error("Error creating event:", err.message);
      return res.status(500).json({ error: "Internal server error." });
    }

    res.status(201).json({
      message: "Event created successfully.",
      event_id: this.lastID,
    });
  });
});

// update event settings
router.patch("/:id", authMiddleware, (req, res) => {
  const eventId = req.params.id;
  const user = req.user;
  const {
    event_banner,
    description,
    status,
    suspended,
    city,
    full_address,
    start_date,
    start_time,
    end_date,
    end_time,
    tags,
    max_capacity,
    registration_deadline_date,
    registration_deadline_time,
    cancellation_deadline_date,
    cancellation_deadline_time,
  } = req.body;

  db.get("SELECT * FROM events WHERE id = ?", [eventId], (err, event) => {
    if (err) return res.status(500).json({ error: "DB error" });
    if (!event) return res.status(404).json({ error: "Event not found" });

    const isOwner = user.id === event.organizer_id;
    const isAdmin = user.account_type === "admin";

    // Admin can only change 'suspended' field
    if (isAdmin) {
      if (suspended === "true" || suspended === "false") {
        db.run(
          `UPDATE events SET suspended = ? WHERE id = ?`,
          [suspended, eventId],
          function (err) {
            if (err) return res.status(500).json({ error: "Update failed" });
            return res
              .status(200)
              .json({ message: "Event updated by admin (suspended changed)" });
          }
        );
        return;
      } else if (suspended) {
        return res
          .status(400)
          .json({ message: "Incorrect value for field 'suspended'" });
      } else {
        return res
          .status(403)
          .json({ message: "Admin can only update 'suspended' field" });
      }
    }

    // Organizer only: must be the event owner
    if (!isOwner) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    // Disallow updates on cancelled/deleted/suspended/started events
    if (event.status === "deleted" || event.suspended === "true") {
      return res.status(400).json({ error: "Cannot update inactive events" });
    }

    // prevent updating if event has started
    const now = new Date();
    const eventStart = new Date(`${event.start_date}T${event.start_time}`);

    if (eventStart < now) {
      return res
        .status(400)
        .json({ message: "Cannot update an event that has already started" });
    }

    // Build fields dynamically
    const updates = [];
    const values = [];

    const fields = {
      event_banner,
      description,
      status,
      city,
      full_address,
      start_date,
      start_time,
      end_date,
      end_time,
      tags,
      max_capacity,
      registration_deadline_date,
      registration_deadline_time,
      cancellation_deadline_date,
      cancellation_deadline_time,
    };

    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) {
        updates.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (updates.length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const sql = `UPDATE events SET ${updates.join(", ")} WHERE id = ?`;
    values.push(eventId);

    db.run(sql, values, function (err) {
      if (err) {
        return res
          .status(500)
          .json({ message: "Database error", error: err.message });
      }
      return res.status(200).json({ message: "Event updated successfully" });
    });
  });
});

// get event stats
router.get("/:id/stats", authMiddleware, (req, res) => {
  const eventId = parseInt(req.params.id);

  const stats = {
    total_likes: 0,
    total_views: 0,
    total_registrations: 0,
    total_active_registrations: 0,
    total_cancelled_registrations: 0,
    total_denied_registrations: 0,
    conversion_rate: 0,
    registrations_last_6_months: [],
    total_attendants: 0,
    attendance_rate: 0,
    female_registrations: 0,
    male_registrations: 0,
  };

  // step 1 - check if event exists and get views
  db.get("SELECT * FROM events WHERE id = ?", [eventId], (err, event) => {
    if (err) {
      return res.status(500).json({ error: "DB error" });
    }
    if (!event) {
      return res.status(404).json({ error: "event not found" });
    }

    if (
      req.user.account_type !== "admin" &&
      req.user.id != event.organizer_id
    ) {
      return res.status(403).json({ error: "access denied" });
    }

    stats.total_views = event.views_count || 0;

    // Step 2 — Total likes
    db.get(
      `SELECT COUNT(*) AS total_likes FROM likes WHERE event_id = ?`,
      [eventId],
      (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        stats.total_likes = row.total_likes || 0;

        // Step 3 — Registrations
        db.all(
          `SELECT status, attendance, gender
           FROM registrations
           JOIN users ON registrations.user_id = users.id
           WHERE event_id = ?`,
          [eventId],
          (err, rows) => {
            if (err) return res.status(500).json({ error: "Database error" });

            stats.total_registrations = rows.length;
            rows.forEach((r) => {
              // Count status
              if (r.status === "active") stats.total_active_registrations++;
              if (r.status === "cancelled")
                stats.total_cancelled_registrations++;
              if (r.status === "denied") stats.total_denied_registrations++;

              // Count gender
              if (r.gender === "male") stats.male_registrations++;
              else if (r.gender === "female") stats.female_registrations++;

              // Attendance
              if (r.attendance === "true") stats.total_attendants++;
            });

            // Conversion rate
            stats.conversion_rate =
              stats.total_views > 0
                ? parseFloat((rows.length / stats.total_views).toFixed(2)) * 100
                : 0;

            // Attendance rate
            stats.attendance_rate =
              stats.total_active_registrations > 0
                ? parseFloat(
                    (
                      stats.total_attendants / stats.total_active_registrations
                    ).toFixed(2)
                  ) * 100
                : 0;

            // Step 4 — Registrations per month (last 6 months)
            db.all(
              `SELECT strftime('%Y-%m', registration_date) AS month, COUNT(*) AS count
               FROM registrations
               WHERE event_id = ?
                 AND registration_date >= date('now', '-6 months')
               GROUP BY month
               ORDER BY month`,
              [eventId],
              (err, rows) => {
                if (err)
                  return res.status(500).json({ error: "Database error" });
                stats.registrations_last_6_months = rows;
                return res.status(200).json(stats);
              }
            );
          }
        );
      }
    );
  });
});

module.exports = router;
