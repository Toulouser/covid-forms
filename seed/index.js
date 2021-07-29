const mongoose = require("mongoose");
// const methodOverride = require("method-override");

// app.use(methodOverride("_method"));
// app.use(express.urlencoded({ extended: true }));

//use product database
const Employee = require("../models/employ");
const employee = require("./employee");

const Dependant = require("../models/dependant");
const dependant = require("./dependant");

// const emp = require("./employee");
mongoose
  .connect("mongodb://localhost:27017/empApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("CONNECTION OPEN!!!");
  })
  .catch(() => {
    console.log("OHH FAILED TO CONNECT");
  });

const seedDB = async () => {
  await Employee.deleteMany({});
  for (let i = 0; i < 3; i++) {
    const emp = new Employee({
      EmpName: `${employee[i].EmpName}`,
      Address: `${employee[i].Address}`,
      DOB: `${employee[i].DOB}`,
    });
    await emp.save();
  }
};
const seedDB2 = async () => {
  await Dependant.deleteMany({});
  // for (let i = 0; i < 2; i++) {
  //   const dep = new Dependant({
  //     EmpName: `${dependant[i].Name}`,
  //     Address: `${dependant[i].Relation}`,
  //     _id: `${dependant[i]._id}`,
  //   });
  //   await dep.save();
  // }
};

seedDB();
seedDB2().then(() => {
  mongoose.connection.close();
});
