const express = require('express');
const router = express.Router();
const sanitizeHtml = require('sanitize-html');

const multer = require('multer');
const { storage } = require('../config/cloudinary');
// Correct import if middleware.js is at the same level as the routes directory
const { isAdmin } = require('../middleware');
const { isLoggedIn } = require('../middleware'); // For checking login status
const Blog = require('../models/blog'); // Ensure this is the correct path to your Blog model

// OR if your structure has routes and middleware at the same directory level
// and you're inside one of the route files.


// Define the file filter function
const fileFilter = (req, file, cb) => {
  console.log(file.mimetype); // Log the MIME type of the file
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

// Update the upload middleware to include the fileFilter

// const upload = multer({ storage });
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 10 }, // for example, 10 MB
  fileFilter: function (req, file, cb) {
    // File type validation can be done here
    cb(null, true);
  }
});


// Show all blog posts
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: 'desc' }).lean();
    res.render('blogs/index', { blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.redirect('/');
  }
});

// Show the form to create a new blog post
router.get('/new',(req, res) => {
  res.render('blogs/new', { blog: new Blog() });
});

// Endpoint to create a new blog post
// POST route for creating a new blog post
router.post('/',upload.single('image'), async (req, res) => {
  console.log('Update details:', JSON.stringify(req.body, null, 2));
  if (req.file) {
    console.log('New uploaded file:', JSON.stringify(req.file, null, 2));
  }

  const blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
  });

  if (req.file) {
    blog.image = {
      url: req.file.path, // or req.file.url if using Cloudinary
      filename: req.file.filename
    };
  }

  try {
    await blog.save();
    res.redirect(`/blogs/${blog.id}`);
  } catch (error) {
    // Check if the error is due to file size limit exceeded
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      console.error('Error: File too large.');
      return res.status(413).render('blogs/new', { 
        blog, 
        errorMessage: 'Error: File too large. Please upload a file smaller than 10MB.'
      });
    }

    // Handle other types of errors
    console.error(JSON.stringify(error, null, 2));
    console.error('Error saving new blog:', error);
    res.render('blogs/new', { blog, errorMessage: 'Failed to create blog post' });
  }
});





// Show a single blog post
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id).lean();
    if (!blog) return res.redirect('/blogs');
    const readingTime = calculateReadingTime(blog.content); // Call a function to calculate
    res.render('blogs/show', { blog, readingTime });
  } catch (error) {
    console.error('Error finding blog:', error);
    res.redirect('/blogs');
  }
});

// Define the calculateReadingTime function in the same file or import it if it's defined elsewhere
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const textLength = content.split(/\s+/).length; // Split by whitespace to get words
  const readingTime = Math.ceil(textLength / wordsPerMinute);
  return readingTime;
}
// Show the form to edit a blog post


// Route to show the edit form for a blog post
router.get('/:id/edit', async (req, res) => {
  try {
      const blog = await Blog.findById(req.params.id);
      if (!blog) {
          req.flash('error', 'Cannot find that blog post.');
          return res.redirect('/blogs');
      }
      res.render('blogs/edit', { blog }); // Adjust the path as necessary
  } catch (error) {
      console.error('Error fetching blog for editing:', error);
      res.redirect('/blogs');
  }
});

// Update a blog post
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
      let blog = await Blog.findById(req.params.id);
      if (!blog) {
          // Handle the case where the blog post is not found
          return res.status(404).send("Blog not found.");
      }

      // Sanitize the content to allow certain HTML tags and attributes
      const cleanContent = sanitizeHtml(req.body.content, {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['h1', 'h2', 'h3', 'img']), // Continue to allow these tags
        allowedAttributes: {
            ...sanitizeHtml.defaults.allowedAttributes,
            'img': ['src', 'alt', 'style'], // Now allowing 'style' attribute for <img> tags
        },
        allowedStyles: {
          // Optionally, you can also define which CSS properties are allowed in 'style' attributes
          '*': {
            // Allow all CSS properties for all tags ('*' acts as a wildcard)
            // You can be more specific if needed, for example:
            // 'color': [/^#(0x)?[0-9a-f]+$/i],
            // 'text-align': [/^left$/, /^right$/, /^center$/],
            'width': [/^\d+(?:px|%)$/], // Allows values like '100px' or '100%'
            // 'height': [/^\d+(?:px|%)$/],
            'width': [/^\d+%$/], // Allows percentage-based widths, adjust as needed
            // Add other CSS properties as needed
          }
        },
    });

      // Update the blog post with sanitized content and other fields
      blog.title = req.body.title;
      blog.author = req.body.author;
      blog.content = cleanContent; // Use the sanitized content

      if (req.file) {
          blog.image = {
              url: req.file.path, // Adjust based on your file storage logic
              filename: req.file.filename
          };
      }

      await blog.save();
      res.redirect(`/blogs/${blog._id}`);
  } catch (error) {
      console.error('Error updating blog:', error);
      // Render the edit form again with an error message (adjust based on your error handling)
      res.status(500).render('blogs/edit', { 
          blog: req.body, 
          errorMessage: 'Failed to update the blog post'
      });
  }
});

// Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.redirect('/blogs');
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.redirect('/blogs');
  }
});

module.exports = router;
