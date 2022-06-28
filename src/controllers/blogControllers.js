const blogModel = require('../models/blogModel');
const authorModels = require('../models/authorModel')
const mongoose = require('mongoose');


//*******************************  ### POST /blogs ************************************/

const isValidObjectId1 = (ObjectId) => {
    return mongoose.Types.ObjectId.isValid(ObjectId);   // to validate a MongoDB ObjectId we are use .isValid() method on ObjectId
};

const createBlog = async function (req, res) {
    try {

        let { title, body, category, isPublished, publishedAt, authorId } = req.body

        const author = await authorModels.findById(authorId);

        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, msg: "Data in request body is required" })

        if (!title)
            return res.status(400).send({ status: false, msg: "title required...!" })


        checkTitle = await blogModel.findOne({ title: title })

        if (checkTitle)
            return res.status(400).send({ status: false, msg: "title is already present...!" });

        if (!body)
            return res.status(400).send({ status: false, msg: "body is required...!" })


        if (!category)
            return res.status(400).send({ status: false, msg: "category is required...!" });

        // console.log(checkTitle)
        if (!authorId)
            return res.status(400).send({ status: false, msg: "authorId is required!...!" });

        if (!isValidObjectId1(req.body.authorId))                //checking the boolean value
            return res.status(400).send({ status: false, msg: "Enter a valid authorId" })

        if (!author) {
            return res.status(400).send({ status: false, msg: "Please enter valid AuthorId!...!" })

        }

        if (isPublished === false) {
            let createBlog1 = await blogModel.create(req.body);
            res.status(201).send({ status: true, data: createBlog1 })
        } else {

            req.body.publishedAt = new Date()
            let createBlog1 = await blogModel.create(req.body);

            res.status(201).send({ status: true, data: createBlog1 });
        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }

};


// *****************************### GET /blogs  ##*********************************************//
const getBlogs = async function (req, res) {
    try {

        let data = req.query;

        let getData = await blogModel.find({ isPublished: true, isDeleted: false, ...data })  //.count()

        if (getData.length == 0)
            return res.status(404).send({ status: false, msg: " no such data found...!" })
        if (!getData)
            return res.status(404).send({ status: false, msg: "no such documents found...!" })

        res.status(200).send({ status: true, data: getData })
        // console.log(getData)

    } catch (err) {
        res.status(500).send({ status: false, msg: err.msg })
    }

}


//************************* */ ### PUT /blogs/:blogId  ###/************************************** */
const updateBlog = async function (req, res) {
    try {

        let blogId = req.params.blogId
        const requestBody = req.body;

        // let userIdFromToken =  req.decodedToken.userId
        // if(userIdFromToken !== userId){
        //     return res.status(403).send({status : false , msg : "unauthorized"})   //authorization
        // }

        let blog = await blogModel.findById(blogId);

        // if (!blogId)
        //     return res.status(400).send({ status: false, data: "blogId is required! " });
        // if (!blog) return res.status(404).send({ status: false, data: "No such Blog is Exist " });

        if (blog.isPublished === true)
            return res.status(400).send({ status: false, msg: "blog is already published...!" })

        if (blog.isPublished === false && blog.isDeleted === false) {   //condtion here we wants to perform

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

    }

    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


//***************************** */ ### DELETE /blogs/:blogId  //************************************* */
const deleteByParams = async function (req, res) {
    try {

        let userId = req.params.blogId;
        let checkBlog = await blogModel.findById(userId)

        // if (!checkBlog)
        //     return res.status(404).send({ status: false, data: "no such blog exist " })

        if (checkBlog.isDeleted == true)
            return res.status(400).send({ status: false, msg: "blog is already deleted...!" })

        if (checkBlog.isPublished == true && checkBlog.isDeleted == false) {   //condition wants to excecute

            let deleteBlog = await blogModel.findOneAndUpdate(
                { _id: userId },
                { $set: { isDeleted: true, deletedAt: new Date() } },
                { new: true }
            );

            res.status(201).send({ status: true, data: deleteBlog })

        }

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}


//***************************** */ ### DELETE /blogs?queryParams  ###//******************************** */
const deleteByQuery = async function (req, res) {
    try {

        let data = req.query
        let filter = { ...data }   //stores the query params in the object obj-destructure-object literals
        let checkBlog = await blogModel.findOne(filter)

        if (!checkBlog)
            return res.status(404).send({ status: false, msg: "no such blog exist...! " })

        if (checkBlog.isDeleted === true)
            return res.status(400).send({ status: false, msg: "blog is already deleted...!" })

        let blogId = checkBlog._id
        // console.log(blogId )
        let deleteBlog = await blogModel.findOneAndUpdate(
            filter,
            { $set: { isDeleted: true, deletedAt: new Date() } },
            { new: true, upsert: true }
        )
        res.status(201).send({ status: true, data: deleteBlog })

    } catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }

}


module.exports = { createBlog, getBlogs, updateBlog, deleteByParams, deleteByQuery }

