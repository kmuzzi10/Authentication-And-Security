import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");


app.get("/",(req,res)=>{
    res.render("home")
});
app.get("/login",(req,res)=>{
    res.render("login")
});
app.get("/register",(req,res)=>{
    res.render("register")
});








app.listen(3000,()=>{
    console.log("server started at port 3000");
})