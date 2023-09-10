import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";


const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");


mongoose.connect("mongodb://127.0.0.1:27017/UserDB");

const userSchema = new mongoose.Schema({
    name: String,
    password: String
});

const secret = "thisisourlittlesecret.";
userSchema.plugin(encrypt,{secret:secret,encryptedFields:["password"]});

const User = mongoose.model("User", userSchema);

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



app.post("/register", (req, res) => {
    const userData = new User({
        name: req.body.username,
        password: req.body.password
    });

    userData.save();



    res.redirect("secrets")


});

app.post("/login", async (req, res) => {
    const name = req.body.username;
    const password = req.body.password;

    try {
        const found = await User.findOne({ name: name }).exec();
        if (found) {
            if (found.password == password) {
                res.redirect("secrets");
            };
        };

    } catch (err) {
        console.log(err);
    };


});







app.listen(3000, () => {
    console.log("server started at port 3000");
})