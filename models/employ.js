const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  EmpName: String,
  Address: String,
  DOB: String,
});

const Employee = mongoose.model("Employee", EmployeeSchema);

module.exports = Employee;
