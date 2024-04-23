const isAdmin = (req, res, next) => {
  // Check if user is authenticated and has the 'admin' role
  if (req.isAuthenticated() && req.user.role === 'admin') {
      return next();
  }
  req.flash('error', 'You do not have permission to view this page.');
  res.redirect('/login');
};

const checkRole = (role, secretCode) => {
  const adminCode = process.env.ADMIN_SECRET_CODE; // Securely stored in environment variables

  if (role === 'admin' && secretCode === adminCode) {
      return true;
  }
  // Assume roles 'parent' and 'regular' do not require a secret code
  return role === 'parent' || role === 'regular';
};

// Ensuring authentication and checking for session details
const isLoggedIn = (req, res, next) => {
  console.log("Session ID:", req.sessionID); // Debug: Log session ID
  console.log("Authenticated:", req.isAuthenticated()); // Debug: Authentication status
  console.log("User role:", req.user ? req.user.role : 'No user'); // Debug: Check user role

  if (req.isAuthenticated()) {
      return next();
  }

  // Redirect unauthenticated users to login page, saving the attempted URL
  req.session.returnTo = req.originalUrl;
  req.flash('error', 'You must be signed in to access this page.');
  res.redirect('/login');
};

module.exports = { isLoggedIn, isAdmin, checkRole };
