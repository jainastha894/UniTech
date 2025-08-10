// import express from 'express';
// import db from '../db.js';

// const router = express.Router();
// // Route to render the blogs page
// router.get('/blogs', async (req, res) => {
//     try {
//         // Fetch all blogs from the database
//         const result = await db.query('SELECT * FROM blogs');
//         const blogs = result.rows;
//         // Render the blogs page with the fetched blogs
//         res.render('blogs', { blogs });
//     } catch (error) {
//         console.error('Error fetching blogs:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// router.get('/blog', async (req, res) => {
//     try{
//         const blogId = req.query.id;
//         if (!blogId) {
//             return res.status(400).send('Blog ID is required');
//         }
//         else{
//             // Fetch the specific blog by ID
//             const result = await db.query('SELECT * FROM blogs WHERE id = $1', [blogId]);
//             const blog = result.rows[0];
//             if (!blog) {
//                 return res.status(404).send('Blog not found');
//             }
//             // Render the blog details page
//             res.render('blog', { blog });
//         }
//     }
// }