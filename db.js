const mongoose = require("mongoose");

module.exports = () => {
  // DB Connection Params by Mongoose
  const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  try {
    mongoose.connect(process.env.DB, connectionParams);
    console.log("Connected By Mongoose");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to Database by  Mongoose");
  }
};
