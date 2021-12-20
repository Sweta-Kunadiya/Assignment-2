require('./models/db');

const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

const expressHandlebars = require('express-handlebars');

const studentController = require('./controller/studentController');

const { check, validationResult} = require("express-validator");
const helmet = require('helmet');
const morgan = require('morgan');
const cors=require("cors");
const cookieparser = require('cookie-parser')
const jwtlib=require("./libs/jwt");
const mongoose=require('mongoose');

const Student = mongoose.model('Student');
var app = express();
app.use(cookieparser())
app.use(cors())
app.use(helmet());
app.use(morgan("combined"));
app.use(bodyParser.urlencoded({
    extended:true
}));
const jwt = require('jsonwebtoken')

app.use(bodyParser.json());

app.set('views',path.join(__dirname,'/views/'))

app.engine('hbs',expressHandlebars({
    extname:'hbs',
    defaultLayout:'mainLayout',
    layoutsDir:__dirname + '/views/layouts/'
}))

app.set('view engine','hbs');

const jwtKey = 'my_secret_key';
const jwtExpirySeconds = 3000;

app.get("/", (req, res) => {

    // res.send(`
  
    // <h2>Welcome to Students Database!!</h2>
  
    // <h3>Click here to get access to the <b> <a href="/getjwtkey">Database</a> </b></h3>`);
     
    res.render('login');
  });
// <h3>Click here to get access to the <b> <a href="/student/list">Database</a> </b></h3>`);

app.post("/login",[check("email", "Please enter a valid email").isEmail()],
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array()
        });
      }
  
      const { email } = req.body;
      try {
        let user = await Student.findOne({email});
        if (!user)
          return res.status(400).json({
            message: "User Not Exist"
          });
  
        const payload = {
          user: {
            id: user.id
          }
        };
  
        jwt.sign(
          payload,
          jwtKey,
          {
            algorithm: 'HS256',
            expiresIn: jwtExpirySeconds
          },
          (err, token) => {
            if (err) throw err;
            // res.status(200).json({
            //   token
            // });
            console.log('token:', token)
            res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
            res.redirect('/student/list');

          }
        );
      } catch (e) {
        console.error(e);
        res.status(500).json({
          message: "Server Error"
        });
      }
    }
  );

  
app.get('/logout',(req,res) => {
  res.clearCookie("token");
  res.render('login');
})


app.listen(5000,() => {
    console.log("Server is listening on Port 5000");
})

app.use('/student',jwtlib.verify,studentController);
//app.get("/getjwtkey",jwtlib.sign)