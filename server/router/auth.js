const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();



const Employee = require("../models/schema");
const authenticate = require("../middleware/authenticate")

router.get('/', (req, res) => {
  res.send("hello auth from router");
})


//registration

router.post('/registration', async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  if (!name || !email || !password || !confirm_password) {
    return res.status(422).json({ error: "All filleds are require" });
  }
  try {
    const employeeExist = await Employee.findOne({ email: email });

    if (employeeExist) {
      return res.status(422).json({ error: "Email already exist" });
    } else if (password != confirm_password) {
      return res.status(422).json({ error: "passwords are not matching" });
    } else {
      const detail = new Employee({ name, email, password, confirm_password });
      await detail.save();
      res.status(201).json({ message: "Employee registration successfully" });
    }


  } catch (e) {
    console.log(e);
  }

})

//login

router.post('/login', async (req, res) => {

  try {
    //let token;
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: "please filled the data" })
    }

    const employeeLogin = await Employee.findOne({ email: email })

    console.log(employeeLogin)

    if (employeeLogin) {
      const isMatch = await Employee.findOne({ password: password })
      //  let token = await employeeLogin.generateAuthToken();
      //  console.log("yes");
      //   console.log(token)

      //     res.cookie('iaurojwtoken',token,{
      //     expires:new Date(Date.now()+25892000000),
      //     httpOnly:true
      //   })

      if (!isMatch) {
        res.status(400).json({ error: "invalid credentials" })
      } else {
        let token = await employeeLogin.generateAuthToken();
        console.log("yes-sir");
        console.log(token)
         console.log("starting")
        res.cookie('iaurojwtoken', token, {
          expires: new Date(Date.now() + 25892000000),
          httpOnly: true
        })
        console.log("why this is happening")

        //localstorage

        //localStorage.setItem('iauronew',token);


        res.json({ message: "login successful" })
      }

    } else {
      res.status(400).json({ error: "invalid credentials" })
    }

  } catch (err) {
    console.log(err)
  }

})

router.get('/about', authenticate, (req, res) => {
  console.log('hello my about');
  res.send(req.rootUser);
})


router.get('/allemployeedata', authenticate, (req, res) => {
  Employee.find({}, (err, Employee) => {
    if (err) {
      res.send('some wrong')

    }
    res.json(Employee)
  })


})


router.post('/update', authenticate, async (req, res) => {

  const { _id, name, email, password, confirm_password } = req.body;

  if (!_id, !name || !email || !password || !confirm_password) {
    return res.status(422).json({ error: "All filleds are require" });
  }
  // try{
  await Employee.updateOne({ _id: _id }, { $set: { name: name, email: email, password: password, confirm_password: confirm_password } }).then((resp) => {
    console.log("resp :", resp)
    res.status(201).json({ message: "Employee update successfully" });
  }).catch((e) => {
    console.log("e :", e)
  })
  

})


router.get("/logout",authenticate,async(req,res)=>{
  console.log("h logout ")
  console.log(req.rootUser);
  req.rootUser.tokens = req.rootUser.tokens.filter((currElement)=>{
    console.log("out");
     return currElement.token!=req.token
  })

  res.clearCookie('iaurojwtoken',{path:'/signin'});
  await req.rootUser.save();
  res.status(200).send('user Logout')
})




module.exports = router;