import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import md5 from "md5";


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
    const userData = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });
    userData.save();
    res.redirect("/secrets");
});

app.post("/login", async (req, res) => {
    const email = req.body.username;
    const password = md5(req.body.password);
    try {
        const found = await User.findOne({ email: email }).exec()
        if (found) {
            if (found.password == password) {
                res.redirect("/secrets");
            }
        }
    } catch (err) {
        console.log(err);
    }
});








app.listen(3000, () => {
    console.log("server started at port 3000");
});