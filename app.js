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
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Model imports
const User = require('./models/user');
const Kid = require('./models/Kid'); // Assuming Kid model is correctly set up like User

// Route imports
const userRoutes = require('./routes/users');
// const trainRoutes = require('./routes/train');
const chatbotRoutes = require('./routes/chatbot');
const aboutRoutes = require('./routes/about');
const blogRoutes = require('./routes/blogRoutes');

// const childRoutes = require('./routes/kidRoutes');
const adminRoutes = require('./routes/adminRoutes');
const fileUploadRouter = require('./routes/fileUpload');

const app = express();

// Passport Config - assuming passportConfig is correctly set up
require('./config/passportKid')(passport); // Adjust the path as necessary

// MongoDB Connection Setup
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Middlewares
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(methodOverride('_method'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false, // Changed to false for better security (prevents session fixation)
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Set to true only if on HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
});

app.use(sessionMiddleware);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'username', // ensure your form has a username field
    passwordField: 'password'  // ensure your form has a password field
  }, async (username, password, done) => {
    try {
      let user = await User.findOne({ username });
      if (!user) {
        user = await Kid.findOne({ username });
      }

      if (!user) {
        return done(null, false, { message: 'User not found' });
      }

      const isValid = await user.validatePassword(password);
      if (!isValid) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

// Serialization and Deserialization
passport.serializeUser((user, done) => {
  done(null, { id: user.id, type: user instanceof Kid ? 'Kid' : 'User' });
});

passport.deserializeUser(async (userKey, done) => {
  const Model = userKey.type === 'Kid' ? Kid : User;
  try {
    const user = await Model.findById(userKey.id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Routes
app.use('/', userRoutes);
app.use('/about', aboutRoutes);
app.use('/chatbot', chatbotRoutes);

app.use('/blogs', blogRoutes);

app.use('/admin', adminRoutes);
app.use('/upload', fileUploadRouter);

// Root Route
app.get('/', (req, res) => {
  res.render('home', { user: req.user || null });
});



// Error handling
// After all specific routes
app.use((req, res, next) => {
  res.locals.user = req.user || null; // This makes user available as a local variable in all views
  next();
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

server.listen(process.env.PORT || 9002, () => {
  console.log(`Server with Socket.IO is running on port ${process.env.PORT || 9000}`);
});
