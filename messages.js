import express from 'express';
import db from './db.js';
const router = express.Router();
// router.get('/messages', async (req, res) => {
    
// });



// Toggle "replied" status
router.post("/messages/:id/toggle-reply", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  const messageId = req.params.id;

  try {
    // Get current status
    const { rows } = await db.query("SELECT replied FROM messages WHERE id = $1", [messageId]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Message not found" });
    }

    const currentStatus = rows[0].replied;
    const newStatus = !currentStatus;

    // Update in DB
    await db.query("UPDATE messages SET replied = $1 WHERE id = $2", [newStatus, messageId]);

    res.json({ success: true, replied: newStatus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});



router.post('/applyfilter', async (req, res) => {
    const dateFilter = req.body.dateFilter;
    const typeFilter = req.body.typeFilter;
    
    if(typeFilter){
        const sql = 'SELECT * FROM messages WHERE inquiry = $1 ORDER BY date DESC';
        const results = await db.query(sql, [typeFilter]);
        res.render('messages.ejs', { messages: results.rows });
    }
    else{
        res.redirect('/messages');
    }
    if(dateFilter) {
        const CURRENT_DATE = new Date.now();
        console.log(CURRENT_DATE);
        if(dateFilter === 'today') {
            const sql = 'SELECT * FROM messages WHERE date >= $1 ORDER BY date DESC';
            const results = await db.query(sql,[CURRENT_DATE]);
            res.render('messages.ejs', { messages: results.rows });
        }
        else if(dateFilter === 'yesterday') {
            const sql = 'SELECT * FROM messages WHERE date >= $1 ORDER BY date DESC';
            const results = await db.query(sql,[CURRENT_DATE - 24 * 60 * 60 * 1000]);
            res.render('messages.ejs', { messages: results.rows });
        }
        else if(dateFilter === 'week') {
            const sql = 'SELECT * FROM messages WHERE date >= $1 ORDER BY date DESC';
            const results = await db.query(sql,[CURRENT_DATE - 7 * 24 * 60 * 60 * 1000]);
            res.render('messages.ejs', { messages: results.rows });
        }
        else if(dateFilter === 'month') {
            const sql = 'SELECT * FROM messages WHERE date >= $1 ORDER BY date DESC';
            const results = await db.query(sql,[CURRENT_DATE - 30 * 24 * 60 * 60 * 1000]);
            res.render('messages.ejs', { messages: results.rows });
        }
        }
    else {
        res.redirect('/messages');
        }
});


export default router;