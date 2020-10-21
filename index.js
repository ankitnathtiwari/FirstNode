var express = require('express');
var app = express();
var session = require('express-session');
const bodyParser = require('body-parser');
//const nodemailer = require('nodemailer');
//const redis = require('redis');
//let RedisStore = require('connect-redis')(session)
//let redisClient = redis.createClient();

var ankit = {
  username:"ankit",
  password:"1234",
  message:"Hey, Ankit Welocme to Dashboard"
};

const rishi = {
  username:"rishi",
  password:"1234",
  message:"Hey, Ankit Welocme to Dashboard"
};

const users = [ankit,rishi]


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  //store:new RedisStore({client:redisClient}),
  resave:false,
  saveUninitialized:false,
  secret:"iamgood",
 
}));

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


passport.use(new LocalStrategy(
    function(username, password, done){
      console.log('Passport Local Strategy')
      console.log(username, password);
      if(username === ankit.username){
        if(password === ankit.password){
          return done (null, ankit)
        } else{
          return done(null, false, {message:"Incorect Password"});  
        }
      } else{
        return done(null, false, {message:"Incorect Username"});
      }
    }
  ))


passport.serializeUser(function (user, done) {
  done(null, user.username);
});

passport.deserializeUser(function (username, done) {
    done(null, username);
 
});


app.use(passport.initialize());
app.use(passport.session());




app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

const auth = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    return res.end("First login");
  }
};


app.get('/dashboard',auth, (req, res)=>{  
   res.send(`${req.user}`);
})


app.get('/logout', (req, res)=>{  
  req.session.destroy();
  res.redirect('/')
})


app.get('/', (req, res)=>{
  res.send("this is home page")
 })
 



// let transporter = nodemailer.createTransport({
//   service:'gmail',
//   auth:{
//     user:'ankitfounder@gmail.com', 
//     pass:'tiwaribaba'
//   }
// })

// let mailOptions ={
//   from:'ankitfounder@gmail.com', 
//   to:'ankitfounder@gmail.com',
//   subject:"My Testing Mail", 
//   text:"Hi their how are you this doesnot contail otp"

// }

// transporter.sendMail(mailOptions, (err, data)=>{
//   if(err){
//     console.log(err)
//   } else{
//     console.log('email sent')
//   }

// })


 
app.listen(4000);
console.log("app running at http://localhost:4000");