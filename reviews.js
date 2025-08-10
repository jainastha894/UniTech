import express from 'express';
import db from './db.js';
const router = express.Router();

router.post('/reviews', async (req, res) => {
  const {reviewerName, reviewerCompany, reviewText, rating} = req.body;

  try {
    // Insert the review into the database
    const result = await db.query(
      'INSERT INTO reviews (name, company,rating,  experience) VALUES ($1, $2, $3, $4) RETURNING *',
      [reviewerName, reviewerCompany,rating, reviewText]
    );

    // Send a success response
    res.status(201).json({
      message: 'Review submitted successfully',
      review: result.rows[0]
    });
  } catch (error) {
    console.error('Error inserting review:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;