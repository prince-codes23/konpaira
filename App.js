const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const mongoose = require("mongoose");
const newFile = require("./createfile");
const port = process.env.PORT || 3000;
const url ="mongodb+srv://admin:andhapaisa@konpaira.ptayvgx.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(url);

const mydata = require("./database")

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
  secret: "PasswordManager",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// mongodb+srv://admin:<password>@konpaira.ptayvgx.mongodb.net/?retryWrites=true&w=majority


const userSchema = new mongoose.Schema({
  email: String,
  userID: String,
  password: String
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.get("/register", (req, res) => {
  res.render("register");
})

app.post("/register", (req, res) => {

  User.register({ username: req.body.username, userID: req.body.userID }, req.body.password, (err, user) => {
    if (err) {
      console.error(err);
      res.redirect("register");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/");
      })
    }
  })
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
})

app.post("/login", (req, res) => {

  const user = new User({
    username: req.body.username,
    password: req.body.password
  })

  req.login(user, (err) => {
    if (err)
      console.error(err);
    else {
      passport.authenticate("local")(req, res, () => {
        // console.log(req);
        res.redirect("/");
      })
    }
  })
})

let Output, sourceCode, inputFile, language, callerID;

app.get("/", (req, res) => {
  res.render("form", { output: Output, sourceCode: sourceCode, inputFile: inputFile });
});

app.post("/", async (req, res) => {

  sourceCode = req.body.sourceCode;
  language = req.body.Language;
  inputFile = req.body.inputFile;
  callerID = "0";
  // let timeLimit = 2 //req.body.time_limit;

  let userID = "admin";
  try {
    await newFile.createFile(sourceCode, language, inputFile, userID, callerID);
  } catch (err) {
    console.error(err);
  }

  try {
    Output = await newFile.execute(language);
  } catch (error) {
    Output = error;
    // console.error((error));
  }
  res.redirect("/");
});

app.post("/submit", async (req, res) => {

  if (req.isAuthenticated()) {
    sourceCode = req.body.sourceCode;
    language = req.body.Language;
    inputFile = req.body.inputFile;
    let userID = req.user.userID; //req.body.time_limit;
    callerID = "1";

    try {
      await newFile.createFile(sourceCode, language, inputFile, userID, callerID);
    } catch (err) {
      console.error(err);
    }
    try {
      newFile.execute(language, callerID, userID);
    } catch (error) {
      console.error((error));
    }
    res.redirect("/status");
  } else {
    res.redirect("user");
  }
});

app.get("/status", (req, res) => {
  const userID = req.user.userID;
  mydata.find(userID,req,res);
})

app.get("/status/:fileID",(req,res) => {
  const val = __dirname + "/Contest/"+req.params.fileID;
  res.download(val);
})

app.get("/user", (req, res) => {
  res.render("home");
})
app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
})

