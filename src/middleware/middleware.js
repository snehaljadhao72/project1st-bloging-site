let jwt = require("jsonwebtoken")
const mongoose = require('mongoose');
const blogModel = require("../models/blogModel")

const isValidObjectId = (ObjectId) => {
  return mongoose.Types.ObjectId.isValid(ObjectId);   // to validate a MongoDB ObjectId we are use .isValid() method on ObjectId
};


const authenticate = async function (req, res, next) {
  try {

    let token = req.headers["x-api-key"] || req.headers["x-Api-key"];

    if (!token)
      return res.status(400).send({ status: false, msg: "token must be present" });

    jwt.verify(token, "Project1_Group10", function (err, data) {
      if (err)
        return res.status(500).send({ status: false, message: err.message })
    })

  } catch (err) {
    res.status(500).send({ msg: err.msg })
  }
  next()
}


const authorise = async function (req, res, next) {
  try {

    let token = req.headers["x-api-key"] || req.headers["x-Api-key"]
    let decodedToken = jwt.verify(token, "Project1_Group10");
    let loginAuthor = decodedToken.authorId;

    let userLogging;

    /**validation for path params */
    if (req.params.hasOwnProperty('blogId')) {
      if (!isValidObjectId(req.params.blogId))
        return res.status(400).send({ status: false, msg: "Enter a valid blog Id" })

      let blogData = await blogModel.findById(req.params.blogId);
      if (!blogData)
        return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });

      userLogging = blogData.authorId.toString();
    }

    /**validation for query params */
    if (req.query.hasOwnProperty('authorId')) {                   //if authorId is present in request query


      if (!isValidObjectId(req.query.authorId))
        return res.status(400).send({ status: false, msg: "Enter a valid author Id" })

      let blogData = await blogModel.findOne({ authorId: req.query.authorId });
      if (!blogData)
        return res.status(404).send({ status: false, msg: "Error, Please check Id and try again" });

      userLogging = blogData.authorId.toString();
      //getting authorId from blog data using authorId,converting it to string
    }
   if (!userLogging)
      return res.status(400).send({ status: false, msg: "AuthorId is required" });  //it valids specially for query params

    if (loginAuthor !== userLogging)
      return res.status(403).send({ status: false, msg: "Error, authorization failed" });

  } catch (err) {
    res.status(500).send({ msg: err.msg })
  }
  next()
}

module.exports = { authorise, authenticate, isValidObjectId }