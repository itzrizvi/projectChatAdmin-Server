const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

// Common User Schema
const commonUserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    //   password: { type: String, required: true },
    // profilePicture: { type: String, default: "" },
    // isAdmin: { type: Boolean, default: false },
});

// Generate Auth Token
commonUserSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWTPRIVATEKEY, {
        expiresIn: "7d",
    });
    return token;
};

// Common User Model
const commonUser = mongoose.model("commonUser", commonUserSchema);

const validate = (data) => {
    const schema = Joi.object({
        firstName: Joi.string().required().label("First Name"),
        lastName: Joi.string().required().label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        // password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(data);
};

module.exports = { commonUser, validate };
