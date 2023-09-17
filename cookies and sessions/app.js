// import modules
import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import ejs from "ejs";
import mongoose from "mongoose";
import session from 'express-session';
import passport from 'passport';
import passportLocalMongoose from "passport-local-mongoose";


const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.use(session({
    secret: 'this is my secret and i am not gonna show',
    resave: false,
    saveUninitialized: true

}));


app.use(passport.initialize());
app.use(passport.session());



mongoose.connect("mongodb://127.0.0.1:27017/UserDB");
// mongoose.set("useCreateIndex",true)        //deprication warning

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


userSchema.plugin(passportLocalMongoose);




const User = mongoose.model("user", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());






app.get("/", (req, res) => {
    res.render("home");
});
app.get("/login", (req, res) => {
    res.render("login");
});
app.get("/register", (req, res) => {
    res.render("register");

});
app.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err)
        }else{
            res.redirect("/")
        }
    });
    
})

app.get("/secrets", (req, res) => {
    console.log("Session before authentication check:", req.session);
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
    console.log("Session after authentication check:", req.session);

});


app.post("/register", (req, res) => {

    User.register({ username: req.body.username }, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            res.redirect("/register");
        } else {
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });

        };
    });



});

app.post("/login", (req, res) => {

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    passport.authenticate("local")(req, res, () => {
        // This callback will be called after authentication succeeds or fails
        if (req.isAuthenticated()) {
            // User is authenticated, redirect to the secrets page
            res.redirect("/secrets");
        } else {
            // Authentication failed, redirect to the login page
            res.redirect("/login");
        }
    });

});








app.listen(3000, () => {
    console.log("server started at port 3000");
});