// import modules
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import md5 from "md5";
import bcrypt from "bcryptjs";
const saltRounds = bcrypt.genSaltSync(10);


const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/UserDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});





const User = mongoose.model("user", userSchema);




app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");

});
app.get("/secrets", (req, res) => {
    res.render("secrets");

});


app.post("/register", async (req, res) => {

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const userData = new User({
            email: req.body.username,
            password: hash
        });
        userData.save();
        res.redirect("/secrets");
    });


    
});

app.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        const found = await User.findOne({ email: email }).exec()
        if (found) {
            bcrypt.compare(password, found.password, function(err, result) {
               if(result === true){
                res.redirect("/secrets");
               }
            });
                
            
        }
    } catch (err) {
        console.log(err);
    }
});








app.listen(3000, () => {
    console.log("server started at port 3000");
});