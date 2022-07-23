const User = require("../models/userModel");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const generateToken = require("../config/generateToken");


exports.register = async (req, res, next) => {
  // User Input Validation - Joi Validation
  const schema = Joi.object({
    username: Joi.string().min(4).max(15).required(),
    email: Joi.string().min(6).max(50).email().required(),
    password: Joi.string().min(8).max(20).required(),
    pic: Joi.string()
  });
  try {
    var { error } = await schema.validate(req.body);
    if (error) return res.status(400).send({ msg: error.details[0].message });

    // Email already exists
    var existUser = await User.findOne({ email: req.body.email }).exec();
    if (existUser) return res.status(400).send({ msg: "Email already exists" });

    // Create / register
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      pic:req.body.pic,
    });
    var response = await user.save();

    // var token = generateToken(response._id)
    // console.log(token)
    res.json({
      _id: response._id,
      username: response.username,
      email: response.email,
      isAdmin: response.isAdmin,
      pic: response.pic,
      token: generateToken(response._id),
    });
    // console.log(generateToken(response._id))
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

exports.login = async (req, res, next) => {
  // User Input Validation - Joi Validation
  const schema = Joi.object({
    email: Joi.string().min(6).max(50).email().required(),
    password: Joi.string().min(8).max(20).required(),
  });
  try {
    var { error } = await schema.validate(req.body);
    if (error) return res.status(400).send({ msg: error.details[0].message });

    // Is registerd User
    var existUser = await User.findOne({ email: req.body.email }).exec();
    if (!existUser)
      return res.status(400).send({ msg: "Email not registered" });


    // Password compare check
    const isValid = await bcrypt.compare(req.body.password, existUser.password);
    if (!isValid)
      return res.status(400).send({ msg: "Password doesn't match" });

    res.json({
      _id: existUser._id,
      username: existUser.username,
      email: existUser.email,
      isAdmin: existUser.isAdmin,
      pic: existUser.pic,
      token: generateToken(existUser._id),
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}

exports.allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { username: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    res.send(users);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
}
