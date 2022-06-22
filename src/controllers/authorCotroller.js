const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");


//### Author APIs /authors
const createAuthor = async function (req, res) {

    try {
        let body = req.body;

        if(!body.fname) return res.status(400).send({status:false, data: "fname is required"})
        if(!body.lname) return res.status(400).send({status:false, data: "lname is required"})

        if(!body.title) return res.status(400).send({status:false, data: "title is required"})
       
        if(!body.email) return res.status(400).send({status:false, data: "email is required"})
        let check = await authorModel.findOne({email:body.email})
        console.log(check)
        if(check) return res.status(400).send({status:false, data:"email is already present, enter new email"})
        if(!body.password) return res.status(400).send({status:false, data: "password is required"})
    
        const createData = await authorModel.create(body);

        res.status(201).send({ data: createData });

    } catch (err) {
        res.status(500).send({ data: err.Message });
    }

}

module.exports.createAuthor = createAuthor