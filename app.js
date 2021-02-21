require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt =require("mongoose-encryption");


const app=express();


console.log(process.env.SECRET);


app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));


mongoose.connect("mongodb://localhost:27017/ticketDB",{useNewUrlParser:true});


const ticketSchema = new mongoose.Schema ({
    email:String,
    password:String
});


ticketSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const Ticket = new mongoose.model("Ticket", ticketSchema);


app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});


app.post("/register",function(req,res){
    const newTicket = new Ticket({
        email:req.body.username,
        password:req.body.password,
        repassword:req.body.repassword
    });

    newTicket.save(function(err){
      if(err){
          console.log(err);
      }else{
          res.render("booking");
      }
    });
    
});



app.post("/login",function(req,res){
    const username = req.body.username;
    const password = req.body.password;

    Ticket.findOne({email:username}, function(err,foundTicket){
        if(err){
            console.log(err);
        }else {
            if(foundTicket){
                if(foundTicket.password === password){
                    res.render("booking");
                }
            }
        }
    });

});









app.listen(3000, function(){
    console.log("server started on port 3000.")
});