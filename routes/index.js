// Packages and routes required
const express = require('express');
const router = express.Router();

// Gets the home page
router.get('/', (req, res) => {
  res.redirect('/books');
});

module.exports = router;
