const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DependantSchema = new Schema({
  Name: String,
  Relation: String,
  id2: String,
});

const Dependant = mongoose.model("Dependant", DependantSchema);

module.exports = Dependant;
