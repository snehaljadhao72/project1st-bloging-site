const blogModel = require('../models/blogModel');
const authorModels = require('../models/authorModel')
const { isValidObjectId } = require('../middleware/middleware')  //objectliteral distructure


// ### POST /blogs
const createBlog = async function (req, res) {
    try {

        let title = req.body.title
        let authorId = req.body.authorId
        const author = await authorModels.findById(authorId);

        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, data: "Data in request body is required" })

       

        if (!req.body.title)
            return res.status(400).send({ status: false, msg: "title required...!" })

        checkTitle = await blogModel.findOne({ title: title })

        if (checkTitle)
            return res.status(400).send({ status: false, msg: "title is already present...!" });

        if (!req.body.body)
            return res.status(400).send({ status: false, data: "body is required...!" })

        if (!req.body.category)
            return res.status(400).send({ status: false, data: "category is required...!" });

        // console.log(checkTitle)
        if (!authorId)
            return res.status(400).send({ status: false, data: "authorId is required!...!" });

        if (!author) {
            res.status(400).send({ status: false, data: "Please enter valid AuthorId!...!" })

        }
        
        if (req.body.isPublished === false) {
            let createBlog1 = await blogModel.create(req.body);
            res.status(201).send({ status: true, data: createBlog1 })
        }
        req.body.publishedAt = new Date()
        let createBlog1 = await blogModel.create(req.body);

        res.status(201).send({ status: true, data: createBlog1 });

    } catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }

};


// ### GET /blogs
const getBlogs = async function (req, res) {
    try {

        let data = req.query;
        let getData = await blogModel.find({ isPublished: true, isDeleted: false, ...data }).count()

        if (!getData)
            return res.status(404).send({ status: false, data: "no such documents found...!" })

        if (getData.length == 0)
            return res.status(404).send({ status: false, data: " no such data found...!" })
        res.status(200).send({ status: true, data: getData })
        console.log(getData)

    } catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }

}


// ### PUT /blogs/:blogId
const updateBlog = async function (req, res) {
    try {

        let blogId = req.params.blogId
        const requestBody = req.body;

        if (!blogId)
            return res.status(400).send({ status: false, data: "blogId is required! " });
         let blog = await blogModel.findById(blogId);
        // if (!blog) return res.status(404).send({ status: false, data: "No such Blog is Exist " });

        if (blog.isPublished === true)
            return res.status(400).send({ status: false, data: "blog is already published...!" })

        const updateBlog = await blogModel.findOneAndUpdate(
            { _id: blogId },
            {
                $set: {
                    title: requestBody.title,
                    body: requestBody.body,
                    category: requestBody.category,
                    isPublished: true,
                    publishedAt: new Date()
                },
                $push: {
                    tags: req.body.tags,
                    subcategory: req.body.subcategory,
                }
            },
            { new: true, upsert: true })

        res.status(200).send({ Status: true, Data: updateBlog })
    }

    catch (err) {
        res.status(500).send({ msg: err.message })
    }
}


// ### DELETE /blogs/:blogId
const deleteByParams = async function (req, res) {
    try {

        let userId = req.params.blogId;
        let checkBlog = await blogModel.findById(userId)

        if (!isValidObjectId(userId))
            return res.status(400).send({ status: false, msg: "invalid blogId provide proper id...!" })

        // if (!checkBlog)
        //     return res.status(404).send({ status: false, data: "no such blog exist " })

        if (checkBlog.isDeleted == true)
            return res.status(400).send({ status: false, data: "blog is already deleted...!" })

        let deleteBlog = await blogModel.findOneAndUpdate(
            { _id: userId },
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true }
        );

        res.status(201).send({ status: true, data: deleteBlog })

    } catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }

}


// ### DELETE /blogs?queryParams
const deleteByQuery = async function (req, res) {
    try {

        let data = req.query
        let filter = { ...data }   //stores the query params in the object obj-destructure
        let checkBlog = await blogModel.findOne(filter)

        if (!checkBlog)
            return res.status(404).send({ status: false, data: "no such blog exist...! " })

        if (checkBlog.isDeleted === true)
            return res.status(400).send({ status: false, data: "blog is already deleted...!" })

        let blogId = checkBlog._id
        // console.log(blogId )
        let deleteBlog = await blogModel.findOneAndUpdate(
            filter,
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true, upsert: true }
        )
        res.status(201).send({ status: true, data: deleteBlog })

    } catch (err) {
        res.status(500).send({ status: false, data: err.message })
    }

}


module.exports = { createBlog, getBlogs, updateBlog, deleteByParams, deleteByQuery }
