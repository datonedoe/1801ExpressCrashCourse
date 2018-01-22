var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var expressValidator = require("express-validator");
var mongojs = require("mongojs");
var db = mongojs('customerapp', ['users']);
var app = express();


// var logger = function(req, res, next) {
//   console.log('Logging...');
//   next();
// }
//
// app.use(logger);

//view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set static path
app.use(express.static(path.join(__dirname, 'public')))

// Global Vars:
app.use(function(req, res, next) {
  res.locals.errors = null;
  next();
})

// Express validator middleware
app.use(expressValidator());

var users = [
  {
    first_name: "John",
    last_name: "Doe",
    email: "johndoe@gmail.com"
  },
  {
    first_name: "Johny",
    last_name: "Smith",
    email: "jodhi@gmail.com"
  },
  {
    first_name: "Anne",
    last_name: "Scmuck",
    email: "anyemail@gmail.com"
  }
]
app.get("/", function(req, res) {
  db.users.find(function(err, docs) {
    console.log(docs);
    res.render('index', {
      title: "Customers",
      users: docs
    })
  })

  res.render('index', {
    title: "Customers",
    users: users
  });
})

app.post('/users/add', function(req, res) {
    req.checkBody('first_name', 'First Name is required').notEmpty();
    req.checkBody('last_name', 'Last Name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.render('index', {
          title: "Customers",
          users: users,
          errors: errors
      });
    } else {
      var newUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email
      }

      db.users.insert(newUser, function(err, result) {
        if (err) {
          console.log(err)
        }
        res.redirect('/');
      })

      console.log("SUCCESS");
    }


})

const port = 3001
app.listen(port, () => {
  console.log("Server started on port", port);
})
