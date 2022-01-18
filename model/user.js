const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// User Schema
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  // profilePicture: { type: String, default: "" },
  // isAdmin: { type: Boolean, default: false },
});

// Generate Auth Token
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
    expiresIn: "7d",
  });
  return token;
};

// User Model
const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
