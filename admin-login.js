import express from 'express';
import db from "./db.js";
import passport from "./passportConfig.js";
import pkg from "passport-local";
const LocalStrategy = pkg.Strategy;

const router = express.Router();

const ADMIN_USERNAME = 'unitechadmin@8500';
const ADMIN_PASSWORD = 'unitechsolutions';


// Render the login page at /hr/login
router.get('/admin-login', (req, res) => {
  res.render('admin-login.ejs', { error: null });
});

router.get("/messages", async (req, res) => {
  console.log("entered into messages block");
  if (req.isAuthenticated()) {
    const newMessages = async () => {
        const sql = 'SELECT count(*) FROM messages WHERE replied = $1';
        const results = await db.query(sql, ['false']);
        return results.rows[0].count;
    };
    const totalMessages = async () => {
        const sql = 'SELECT count(*) FROM messages';  
        const results = await db.query(sql);
        return results.rows[0].count;
    }

const CURRENT_DATE = new Date();
const formatDate = date => date.toISOString().split('T')[0];

// Calculate dates
const YESTERDAY = new Date(CURRENT_DATE);
YESTERDAY.setDate(CURRENT_DATE.getDate() - 1);

const WEEK_START = new Date(CURRENT_DATE);
WEEK_START.setDate(CURRENT_DATE.getDate() - CURRENT_DATE.getDay() + 1); // Monday start

const MONTH_START = new Date(CURRENT_DATE.getFullYear(), CURRENT_DATE.getMonth(), 1);

    let query = req.query.filter || 'all';
    let sql, results;

    if (query === 'today') {
        sql = 'SELECT * FROM messages WHERE date >= $1 ORDER BY date DESC';
        results = await db.query(sql,[formatDate(CURRENT_DATE)]);
    } 
    else if (query === 'new') {
        sql = 'SELECT * FROM messages WHERE replied = $1 ORDER BY date DESC';
        results = await db.query(sql, ['false']);
    } 
    else if (query === 'replied') {
        sql = 'SELECT * FROM messages WHERE replied = $1 ORDER BY date DESC';
        results = await db.query(sql, ['true']);
    } 
    else if(query==='all') {
        sql = 'SELECT * FROM messages ORDER BY date DESC';
        results = await db.query(sql);
    }
    else if(query==="yesterday") {

      console.log(formatDate(YESTERDAY));
        sql = 'SELECT * FROM messages WHERE date = $1 ORDER BY date DESC';
        results = await db.query(sql,[formatDate(YESTERDAY)]);
    }
    else if(query==="week") {
        sql = 'SELECT * FROM messages WHERE date >= $1 ORDER BY date DESC';
        results = await db.query(sql,[formatDate(WEEK_START)]);
    }
    else if(query==="month") {
        sql = 'SELECT * FROM messages WHERE date >= $1 ORDER BY date DESC';
        results = await db.query(sql,[formatDate(MONTH_START)]);
    }
    else {
        sql = 'SELECT * FROM messages ORDER BY date DESC';
        results = await db.query(sql);
    }
    


    res.render('messages.ejs', { 
        newMessages: await newMessages(),
        messages: results.rows,
        currentFilter: query,
        totalMessages: await totalMessages(),
        todayCount: results.rows.filter(message => new Date(message.date).toDateString() === new Date().toDateString()).length
    });
  }
  else {
    res.render("admin-login.ejs");
  }
})

router.post('/admin-login', passport.authenticate("local", {
  successRedirect: "/messages",
  failureRedirect: "/admin-login"
}));

passport.use("local", new LocalStrategy(async function verify(username, password, cb) {
  try {

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      console.log("{username,password} here: ",{username,password});
        // If the credentials match, create a user object
      const user ={username,password};

      return cb(null, user);
    }
    else {
      console.log("wrong password entered by hr user");
      return cb(null, false);
    }
  }
  catch (err) {
    console.log("error in local strategy: ", err);

  }
}))

passport.serializeUser((user, cb) => {
    cb(null, user);
    console.log("user.username in serialize user: ",user.username);
});

passport.deserializeUser(async (user, cb) => {
        console.log("desrialize user for admin");
        return cb(null,user);
    
});
export default router;
