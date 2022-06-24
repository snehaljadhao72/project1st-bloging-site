const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");


//### Author APIs /authors
const createAuthor = async function (req, res) {

    try {

        
        let body = req.body;
        if (Object.keys(body).length == 0)
            return res.status(400).send({ status: false, data: "Data in request body is required...!" })

        if (!body.fname)
            return res.status(400).send({ status: false, data: "fname is required...!" })

        if (!body.lname)
            return res.status(400).send({ status: false, data: "lname is required...!" })

        if (!body.title)
            return res.status(400).send({ status: false, data: "title is required...!" })

        if (!body.email)
            return res.status(400).send({ status: false, data: "email is required...!" })

        
         const isvalidEmail =   function (gmail) {
                let regex= /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/   //.test(gmail);
                return regex.test(gmail)
          }
        
          if(!isvalidEmail(body.email)){
            return res.status(400).send( {msg:"Please enter a valid email"})     
         }
        
        
        let check = await authorModel.findOne({ email: body.email })
        console.log(check)
        if (check)
            return res.status(400).send({ status: false, data: "email is already present, enter new email...!" })

        if (!body.password)
            return res.status(400).send({ status: false, data: "password is required...!" })

        const createData = await authorModel.create(body);

        res.status(201).send({status:true, data: createData });

    } catch (err) {
        res.status(500).send({ status: false, data: err.message });
    }
}

module.exports.createAuthor = createAuthor