const authorModel = require("../models/authorModel");
const blogModel = require("../models/blogModel");


/*******************************### Author APIs /authors****************************************/

let isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

let isValid = function (attribute) {
    return (/^[a-zA-Z]{2,20}$/.test(attribute.trim()))
}

const isvalidEmail = function (gmail) {
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/   //.test(gmail);
    return regex.test(gmail)
}


const createAuthor = async function (req, res) {

    try {

        let { fname, lname, title, email, password } = req.body
        let body = req.body;
        if (Object.keys(body).length == 0)
            return res.status(400).send({ status: false, msg: "Data in request body is required...!" })

        if (!fname)
            return res.status(400).send({ status: false, msg: "fname is required...!" })
        if (typeof fname !== "string" || fname.trim().length === 0) return res.status(400).send({ status: false, msg: "first name should be string and should not contain spaces" })

        if (!isValid(fname))
            return res.status(400).send({ stats: true, msg: "enter valid first name" })


        if (!lname)
            return res.status(400).send({ status: false, msg: "lname is required...!" })
        if (typeof lname !== "string" || lname.trim().length === 0) return res.status(400).send({ status: false, msg: "last name should be string and should not contain spaces" })

        if (!isValid(lname))
            return res.status(400).send({ stats: true, msg: "enter valid last name" })

        if (!title)
            return res.status(400).send({ status: false, msg: "title is required...!" })
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, msg: "Invalid request parameters in the title, It should be Mr, Mrs, Miss" })
        }


        if (!email)
            return res.status(400).send({ status: false, msg: "email is required...!" })

        if (!isvalidEmail(body.email)) {
            return res.status(400).send({ status: false, msg: "Please enter a valid email" })
        }


        let check = await authorModel.findOne({ email: body.email })
        // console.log(check)
        if (check)
            return res.status(400).send({ status: false, msg: "email is already present, enter new email...!" })

        if (!password)
            return res.status(400).send({ status: false, msg: "password is required...!" })
        if (typeof password !== "string" || password.trim().length === 0) return res.status(400).send({ status: false, msg: "last name should be string and should not contain spaces" })
        if (password.length < 8) {
            return res.status(400).send({ status: false, msg: "enter password with Minimum length 8" })
        }

        const createData = await authorModel.create(body);

        res.status(201).send({ status: true, data: createData });

    } catch (err) {
        res.status(500).send({ status: false, data: err.message });
    }
}

module.exports.createAuthor = createAuthor