const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RegSchema = new Schema({
    id2: String,
    Name: String,
    vaccDate: Date,
    vaccine: String,
  });
  
  const Registration = mongoose.model("Registration", RegSchema);
  
  module.exports = Registration;
  