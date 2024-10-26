const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.development" });

const connectionURI = process.env.MONGODB_CONNECTION_URI;

const connectToDB = async () => {
  try {
    const connection = await mongoose.connect(connectionURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    if (connection) {
      console.log("Connection to DB successful");
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectToDB;
