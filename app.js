const express = require("express");
const app = express();
const path = require("path");

const mongoose = require("mongoose");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

const Employee = require("./models/employ");
const Dependant = require("./models/dependant");
const Registration = require("./models/registration");
const { response } = require("express");
const e = require("express");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.send("HIIIIII!!!!!!1");
});

app.get("/employees", async (req, res) => {
  const emp = await Employee.find({});
  // console.log(campgrounds);
  res.render("employee/index", { emp });
});

app.get("/employees/new", async (req, res) => {
  res.render("employee/new");
});

app.get("/employees/:id/dependants", async (req, res) => {
  const { id } = req.params;

  const dep = await Dependant.find({ id2: id });
  console.log(dep);
  // console.log(req.params);
  res.render("dependant/index", { dep, id });
});
app.get("/employees/:id/dependants/new", async (req, res) => {
  const { id } = req.params;
  res.render("dependant/new", { id });
});

app.post("/employees/:id/dependants", async (req, res) => {
  console.log(req.body);
  const dep2 = new Dependant(req.body.dep);
  const { id } = req.params;
  // console.log(id);
  dep2.id2 = id;
  await dep2.save();
  res.redirect(`/employees`);
  // res.send(req.body);
});

app.post("/employees", async (req, res) => {
  console.log(req.body);
  const emp2 = new Employee(req.body.emp);
  await emp2.save();
  res.redirect(`/employees/${emp2._id}`);
  // res.send(req.body);
});

app.get("/employees/:id", async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  res.render("employee/show", { emp });
});

//edit
app.get("/employees/:id/edit", async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  res.render("employee/edit", { emp });
});

app.put("/employees/:id", async (req, res) => {
  console.log(req.body);
  const { id } = req.params;
  // res.send("HIIIIIIIII");
  // must await or it will jump to redirect line
  const emp2 = await Employee.findByIdAndUpdate(
    id,
    { ...req.body.employee }
    // {
    //   runValidators: true,
    //   new: true,
    // }
  );

  res.redirect(`/employees/${emp2._id}`);
});

app.post("/employees/:id/dose-status", async(req,res) => {
  const emp = await Employee.findById(req.params.id);
  const regv = await Registration.findOne({id2: req.params.id});
  // console.log(regv.vaccDate);
  var date = new Date(regv.vaccDate);  // dateStr you get from mongodb

  var d = date.getDate();
  var m = date.getMonth()+1;
  var y = date.getFullYear();

  // if(regv.vaccine == 'Covishield'){

  // }
  
  console.log(req.body);
  console.log(emp.EmpName);
  if(req.body.firstDose == 'Yes'){
    var vs = "p";
    if(req.body.secondDose == 'No'){
      if(regv.vaccine == 'Covishield'){
        if(m < 9){
          m = m+3;
        }
        else if(m == 9){
          m = 12;
        }
  
        else{
          m = (m+3)%12;
          y = y+1;
        }
      }else{
        if(m == 12){
          m = (m+1)%12;
          y = y+1;
        }else{
          m = m+1;
        }
      }
      res.render("employee/doseStatus", {vs, emp, regv, d, m, y});
    }else{
      vs = "f";
      res.render("employee/doseStatus", {vs, emp, regv});
    }
  }
  
})

app.post("/employees/:id/check", async (req, res) => {
  const emp = await Employee.findById(req.params.id);
  if (req.body.status == "Yes") {
    res.render("employee/check", { emp });
  } else {
    return res.render("employee/gg", { emp });
  }
});

app.post("/employees/:id/first-dose", async(req,res) => {
  const emp = await Employee.findById(req.params.id);
  console.log(req.body.status);
  // if(req.body.status == 'Yes'){
  //   res.render("employee/check",{emp});
  // }
  // else{
  //   return res.render('employee/gg');
  // }
  
})

app.post("/employees/:id/vaccine", async(req, res) => {
  const { id } = req.params;
  const emp = await Employee.findById(req.params.id);
  const regg = new Registration();
  regg.Name = req.body.name;
  regg.vaccDate = req.body.date;
  regg.vaccine = req.body.vaccine;
  regg.id2 = id;
  await regg.save();
  console.log(regg);
  res.redirect(`/employees/${emp._id}`);
})

app.get("/employees/:id/status", async(req, res) =>{
  const regg = await Registration.findOne({id2: req.params.id});
  console.log(regg);
  res.render('employee/status',{regg});
})

app.post("/employees/:id/valid", async(req, res) => {
  const emp = await Employee.findById(req.params.id);
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();

  const date = req.body.date;
  var x = parseInt(date.substring(0,4));
  if(x == yyyy){
    if(parseInt(mm - date.substring(5,7)) >= 3){
      return res.render('employee/gg',{emp});
    }else{
      return res.render('employee/no');
    }
  }else{
    return res.render('employee/gg', {emp});
  }

})

app.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  await Employee.findByIdAndDelete(id);
  res.redirect("/employees");
});



app.listen(3000, () => {
  console.log("serving on port 3000");
});
