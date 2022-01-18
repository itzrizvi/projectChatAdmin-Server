const router = require("express").Router();
const { User } = require("../model/user");
const Joi = require("joi");
const bcrypt = require("bcrypt");

router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error!" });
  }
});

module.exports = router;
