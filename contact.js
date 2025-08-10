import express from 'express';
import db from './db.js';

const router = express.Router();
router.post('/sendMsg', async (req, res) => {
  const { fullName, company, email, phone,inquiry, message } = req.body;
  console.log(`Received messages from ${fullName} ${company} (${email}): ${phone} ${inquiry}  ${message}`);
  const insertionResult=await db.query(
    'INSERT INTO messages (full_name, company_name, email, phone, inquiry, message) VALUES ($1, $2, $3, $4, $5, $6)  returning *',
    [fullName, company, email, phone, inquiry, message]);
    if (insertionResult.rowCount === 0) {
        return res.status(500).send('Failed to save messages to the database.');
        }
    else {
      res.redirect('/contact?success=1');
    }    

  
});

export default router;