require('dotenv').config();
const express=require("express");
const bodyparser=require("body-parser");
const mongoose=require("mongoose");
const ejs=require("ejs");
const md5=require("md5");
const app=express();
app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({extended:true}));
mongoose.connect("mongodb://127.0.0.1:27017/userdata",{useNewUrlParser:true});

const userschema= new mongoose.Schema({
    email:String,
    password:String
})

console.log(process.env.SECRET);


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
    const usernew=new usermodel( {
        email:req.body.username,
        password:md5(req.body.password)
    });
    usernew.save().then(function(ans){
        console.log(ans);
        res.render("secrets");
    })
    .catch(function(err){
        console.log(err);
    })
})

app.post("/login",function(req,res){
    usermodel.findOne({email:req.body.username}).then(function(ans){
        if(ans.password===md5(req.body.password)){
            console.log("valid");
            res.render("secrets");
        }
        else{
            console.log("invalid");
            res.send("not valid");
        }
    }).catch(function(err){
        console.log(err);
        res.send("user dont eexist");
    })
})


app.listen(3000,function(){
    console.log("listening");
})
