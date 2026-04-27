const schema = require("mongoose").Schema;
const mongoose = require("mongoose");

const userSchema = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["admin", "user", "Dj"],
    default: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  followerCount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  favouriteAlbums: [{ type: schema.Types.ObjectId, ref: "Album" }],
});

const User = mongoose.model("user", userSchema);
module.exports = User;
