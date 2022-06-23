const jwt = require("jsonwebtoken");
const authorModel = require("../models/authorModel");


const loginAuthor = async function (req, res) {
  try {
    let userName = req.body.email;
    let password = req.body.password;
    //   if(!req.body)  return res.status(400).send({status:false, data: "email and password is required"})
    if (!req.body.email)
      return res.status(400).send({ status: false, data: "email is required" })

    if (!req.body.password)
      return res.status(400).send({ status: false, data: "password is required" })

    let user = await authorModel.findOne({ email: userName, password: password });
    if (!user)
      return res.status(400).send({ status: false, msg: "username or the password is not corerct" });

    let token = jwt.sign(
      {
        authorId: user._id.toString(),
        batch: "Radon",
        organisation: "FunctionUp",
      },
      "Project1_Group10"
    );
    res.setHeader("x-api-key", token);

    res.status(201).send({ status: true, token: token });

  } catch (err) {
    res.status(500).send({ msg: err.msg })
  }
};

module.exports.loginAuthor = loginAuthor;