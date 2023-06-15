require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const bcrypt=require("bcrypt");
const round=10;
const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/userdata",{useNewUrlParser:true});

const userschema= new mongoose.Schema({
    email:String,
    password:String
})



const usermodel=mongoose.model("User",userschema);

app.get("/",function(req,res){
    res.render("home");
})

app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    
    res.render("register");
})

app.post("/register",function(req,res){
    bcrypt.hash(req.body.password,round,function(err,hash){
        const usernew=new usermodel( {
            email:req.body.username,
            password:hash
        });
        usernew.save().then(function(ans){
            console.log(ans);
            res.render("secrets");
        })
        .catch(function(err){
            console.log(err);
        })
    })
    
})

app.post("/login",function(req,res){
    usermodel.findOne({email:req.body.username}).then(function(ans){
       bcrypt.compare(req.body.password,ans.password,function(err,result){
        if(result===true){
            res.render("secrets")
        }
        else{
            res.send("password incorrect")
        }
       })
    }).catch(function(err){
        console.log(err);
        res.send("user dont eexist");
    })
})


app.listen(3000,function(){
    console.log("listening");
})
