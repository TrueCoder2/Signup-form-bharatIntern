require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require("mongoose")
const bodyParser = require('body-parser'); 

const port = process.env.PORT || 5000 ;
const mongoURL = process.env.MONGO_URI;

app.use(bodyParser.urlencoded({urlencoded:true}))
app.use(bodyParser.json());

app.get('/', (req,res) => {
    res.sendFile(__dirname + "/pages/index.html")
  })

  mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

// Define event listeners for database connection

db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

const signupSchema = new mongoose.Schema({
    username : String,
    email :    String,
    password : String,
     
 }, {timestamps: true})

 const Signup = mongoose.model("Signup", signupSchema)

 app.post('/signup' , async(req,res) => {
    try{
      const {username,email,password} = req.body;

      const signupp = new Signup({
        username,
        email,
        password
      });

      await signupp.save();
      res.redirect('/success')
    }
    catch(error){
     console.log(error);
     res.redirect("/error")
    }
})

app.get("/success", (req,res) => {
    res.sendFile(__dirname + "/pages/success.html")
})

app.get("/error" , (req,res) => {
  res.sendFile(__dirname + "/pages/error.html")
})

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });