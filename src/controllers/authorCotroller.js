const authorModel = require("../models/authorModel")

const createAuthor = async function(req,res){

    try{
        let body = req.body;
   
    const createData = await authorModel.create(body);
    
    res.status(201).send({data:createData});

    }catch(err){
        res.status(500).send({data: err.Message});
    }
    
}

module.exports.createAuthor = createAuthor