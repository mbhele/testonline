const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();
// const session = require('express-session');
const MongoStore = require('connect-mongo');  // Require the MongoStore


// Model imports
const User = require('./models/user');

// Route imports
const userRoutes = require('./routes/users');
const trainRoutes = require('./routes/train');
const chatbotRoutes = require('./routes/chatbot');
const aboutRoutes = require('./routes/about');
const blogRoutes = require('./routes/blogRoutes');
const parentRoutes = require('./routes/parent');
const childRoutes = require('./routes/kidRoutes');
const adminRoutes = require('./routes/adminRoutes'); // Update the path as necessary
const fileUploadRouter = require('./routes/fileUpload');

const app = express();

// Passport Config
require('./passportConfig')(passport);
require('./config/passportKid')(passport);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
// const isProduction = process.env.NODE_ENV === "production";

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI // Ensure your MONGO_URI is correctly set in your environment variables
  }),
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

app.use(sessionMiddleware);


app.use(flash());
app.use(passport.initialize());
app.use(passport.session());



// New Unified Local Strategy for User and Kid
passport.use(new LocalStrategy(async (username, password, done) => {
  let user = await User.findOne({ username });
  if (!user) user = await Kid.findOne({ username });

  if (!user) {
      return done(null, false, { message: 'User not found' });
  }

  const isValid = await user.validatePassword(password);
  if (!isValid) {
      return done(null, false, { message: 'Incorrect password' });
  }

  return done(null, user);
}));

passport.serializeUser((user, done) => {
  done(null, { id: user.id, type: user instanceof Kid ? 'Kid' : 'User' });
});

passport.deserializeUser(async (userKey, done) => {
  const Model = userKey.type === 'Kid' ? Kid : User;
  const user = await Model.findById(userKey.id);
  done(null, user);
});



passport.serializeUser((user, done) => {
  done(null, { id: user.id, type: user instanceof Kid ? 'Kid' : 'User' });
});

passport.deserializeUser((userKey, done) => {
  const Model = userKey.type === 'Kid' ? Kid : User;
  Model.findById(userKey.id, (err, user) => {
      done(err, user);
  });
});



app.use(methodOverride('_method'));

app.use(passport.session());
app.use((req, res, next) => {
  console.log('---sesifikile--')
  console.log('Session:', req.session);
  console.log('User:', req.user);
  console.log('Authenticated:', req.isAuthenticated());
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
});

// Routes
app.use('/', userRoutes);
app.use('/trains', trainRoutes);
app.use('/about', aboutRoutes);
app.use('/chatbot', chatbotRoutes);
app.use('/parent', parentRoutes);
app.use('/blogs', blogRoutes);
app.use('/child', childRoutes);
app.use('/admin', adminRoutes);
app.use('/upload', fileUploadRouter);


app.get('/chatbot', async (req, res) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be logged in to access this page.');
        return res.redirect('/login'); // Redirect to login if not authenticated
    }
    try {
        const user = await User.findById(req.user._id);
        user.visitCount += 1;
        await user.save();
        res.render('chatbot', {
            user: user,
            questions: JSON.stringify(questions),
            visitCount: user.visitCount,
            isAuthenticated: true,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred");
    }
});
// Root Route
app.get('/', (req, res) => {
  res.render('home');
});

// Error handling
app.use((req, res, next) => {
  res.status(404).send('Sorry, that route does not exist');
});

const server = http.createServer(app);
const io = require('socket.io')(server);
module.exports.io = io;

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});

const port = process.env.port || 3000;

server.listen(port, () => {
  console.log('Server with Socket.IO is running on port 9000');
});
