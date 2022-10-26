const { urlencoded } = require('express');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;


const { connectMongoose, User } = require("./Database.js");
const moment = require('moment/moment.js');

connectMongoose();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());



app.get("/", (req, res) => {
  res.send("This is home page");
})




app.post("/register", (req, res) => {
  let {  email,name, phone_no,no_of_rooms,check_in_date,check_out_date } = req.body;
  let m1=moment(check_in_date);
  let m2=moment(check_out_date);
  console.log(m1);
  
  m1=m1.toString();
  m2=m2.toString();
  check_in_date=m1.substring(0,16);
  check_out_date=m2.substring(0,16);
  User.findOne({ email: email }, (err, user) => {
    if (user) {
      res.send({ message: "User already registerd" })
    } else {
      const user = new User({
        email,
        name,
        phone_no,
        no_of_rooms,
        check_in_date,
        check_out_date,
      })
      user.save(err => {
        if (err) {
          console.log("This is error")
          res.send(err);
        } else {
          res.send({ message: "Successfully Registered " });
        }
      })
    }
  })

})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})