const express = require('express');
const router = express.Router();
const middleware = require("../middleware/middleware")
const authorController = require('../controllers/authorCotroller');
const blogController = require('../controllers/blogControllers')
const loginCotroller = require("../controllers/loginController")

/**------------------------------------Authorization--------------------------------------------- */

 router.post('/authors', authorController.createAuthor)

 router.post("/login", loginCotroller.loginAuthor)

 router.post('/blogs', middleware.authenticate, blogController.createBlog)

 router.get('/blogs', middleware.authenticate, blogController.getBlogs)

 router.put('/blogs/:blogId', middleware.authenticate, middleware.authorise, blogController.updateBlog)

 router.delete('/blogs/:blogId', middleware.authenticate, middleware.authorise, blogController.deleteByParams)

 router.delete('/blogs', middleware.authenticate, middleware.authorise, blogController.deleteByQuery)

/**----------------------------------------------------------------------------------------------- */

 router.post('/authors', authorController.createAuthor)

 router.post('/blogs',blogController.createBlog)
 router.get('/blogs',blogController.getBlogs)

 router.put('/blogs/:blogId',blogController.updateBlog)
 router.delete('/blogs/:blogId',blogController.deleteByParams)
 router.delete('/blogs',blogController.deleteByQuery)

module.exports = router;