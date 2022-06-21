const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorCotroller');
const blogController = require('../controllers/blogControllers')

router.post('/authors', authorController.createAuthor)

router.post('/blogs',blogController.createBlog)







module.exports = router;