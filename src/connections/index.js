const mongoos = require("mongoose");
const { tr } = require("zod/locales");
const mongoURI = "mongodb://localhost:27017/mydatabase";

const connectToMongo = () => {
  try {
   const test =  mongoos.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;



