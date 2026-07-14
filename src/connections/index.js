const mongoos = require("mongoose");
const mongoURI = "mongodb://localhost:27017/mydatabase";

const connectToMongo = async () => {
  try {
    await mongoos.connect(mongoURI);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.log("Error connecting to MongoDB:", error);
  }
};

module.exports = connectToMongo;



