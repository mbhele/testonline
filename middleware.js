const isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.isAdmin) {
    return next();
  }
  req.flash('error', 'You do not have permission to view this page.');
  res.redirect('/login');
};

const checkRole = (role, secretCode) => {
  const adminCode = process.env.ADMIN_SECRET_CODE; // Assume this is securely stored in your environment variables

  if (role === 'parent' || role === 'regular') return true;
  
  if (role === 'admin' && secretCode === adminCode) return true;

  return false;
};

// Adjusted isLoggedIn middleware to check for kid sessions
const isLoggedIn = (req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Authenticated:", req.isAuthenticated());
  console.log("Kid ID:", req.session.kidId);

  if (req.isAuthenticated() || req.session.kidId) {
    next();
  } else {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in first!');
    res.redirect('/login');
  }
};




module.exports = { isLoggedIn, isAdmin, checkRole };
