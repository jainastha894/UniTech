import express from 'express';
import contactRouter from './contact.js'; 
import reviewsRouter from './reviews.js';
import db from './db.js';
import adminLoginRouter from './admin-login.js';
import messagesRouter from './messages.js'; 
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import passport from "./passportConfig.js";

// import bodyParser from 'body-parser';
const app = express();
const pgSession = connectPgSimple(session);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store: new pgSession({
    pool: db,            
    tableName: "session" 
  }),
  secret: "secretlysecret",    
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/",reviewsRouter)
app.use("/", adminLoginRouter);
app.use("/", messagesRouter);
app.use("/", contactRouter); 

app.get("/blogs", (req, res) => {
  res.render("blogs");
}   );
app.get("/contact", (req, res) => {
  res.render("contact",{req});
});

app.get("/admin",(req,res)=>{
  res.redirect("/messages");
} );
app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/our-products", (req, res) => {
  res.render("our-products");
});
app.get('/', async (req, res) => {
  const result = await db.query('SELECT * FROM reviews ORDER BY rating DESC');
  const reviews = result.rows;
  res.render('home', { reviews:reviews });
  }); 
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});