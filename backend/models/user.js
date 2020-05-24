const mongoose = require("mongoose");
const uniqueValidador = require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  email: { type: String, require: true, unique: true},
  password: { type: String, require: true },
});

userSchema.plugin(uniqueValidador);

module.exports = mongoose.model("User", userSchema);
