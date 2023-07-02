require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const session=require('express-session');
const passport=require('passport');
const passportlocalmongoose=require('passport-local-mongoose')
const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));

app.use(session({
    secret: 'longsentencestosave',
    resave: false,
    saveUninitialized: false
   
  }));
app.use(passport.initialize());  
app.use(passport.session());


mongoose.connect("mongodb://127.0.0.1:27017/userdata",{useNewUrlParser:true});

const userschema= new mongoose.Schema({
    email:String,
    password:String
})

userschema.plugin(passportlocalmongoose);

const usermodel=mongoose.model("User",userschema);
passport.use(usermodel.createStrategy());

passport.serializeUser(usermodel.serializeUser());
passport.deserializeUser(usermodel.deserializeUser());

app.get("/",function(req,res){
    res.render("home"); 
})
app.get("/secrets",function(req,res){
    if(req.isAuthenticated()){
        res.render("secrets");
    }
    else{
        res.redirect("/login");
    }
})
app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
   usermodel.register({username:req.body.username},req.body.password,function(err,user){
    if(err){
        console.log(err);
        res.redirect("/register");
    }
    else{
        passport.authenticate("local")(req,res,function(){
            res.redirect("/secrets");
        })
    }
   })
    
})

app.post("/login",function(req,res){
    const myuser=new usermodel({username:req.body.username,
                              password:req.body.password});
    req.login(myuser,function(err){
        if(err){
            console.log(err);
        }
        else{
            passport.authenticate("local")(req,res,function(){
                res.redirect("/secrets");
            })

        }
    })                          
})
app.get("/logout",function(req,res){
    req.logout(function(err){
        if(err){
            console.log(err);
        }
    });
    res.redirect("/"); 
})


app.listen(3000,function(){
    console.log("listening");
})
