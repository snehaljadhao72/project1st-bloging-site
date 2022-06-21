const blogModel = require('../models/blogModel');
const authorModels = require('../models/authorModel')
 
const createBlog = async function(req, res){
 let title = req.body.title  
let authorId = req.body.authorId
const author = await authorModels.findById(authorId);

checkTitle = await blogModel.findOne({title:title}).select({title:1})
if(title === checkTitle) return res.send({msg:"title is already present"});

if(!authorId) return res.status(400).send({status:false, data: "authorId is required!"})
if(!author){
    res.status(400).send({status:false, data:"Please enter vallid AuthorId!"})
}
if(req.body.isPublished === false){
    let createBlog1 = await blogModel.create(req.body);
    res.status(201).send({status:true, data:createBlog1})  
}else{
    req.body.publishedAt = new Date()
    let createBlog1 = await blogModel.create(req.body);

    res.status(201).send({status:true, data:createBlog1})
}
};

module.exports.createBlog= createBlog