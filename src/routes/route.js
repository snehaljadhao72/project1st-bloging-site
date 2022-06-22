const express = require('express');
const router = express.Router();
const authorController = require('../controllers/authorCotroller');
const blogController = require('../controllers/blogControllers')

router.post('/authors', authorController.createAuthor)

router.post('/blogs',blogController.createBlog)
router.get('/blogs',blogController.getBlogs)

router.put('/blogs/:blogId',blogController.updateBlog)
router.delete('/blogs/:blogId',blogController.deleteByParams)
router.delete('/blogs',blogController.deleteByQuery)



module.exports = router;