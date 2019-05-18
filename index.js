//import and define express and other modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const config = require('./config/database');
const passport = require('passport');

//*****************************************************************************
//*****************************************************************************

// DB connect
var mongoose = require('mongoose');
mongoose.connect(config.database, {
  useMongoClient: true
});

mongoose.Promise = global.Promise;

let db = mongoose.connection;
//check connection
db.once('open', function() {
  console.log('Connected to MongoDB');
});
//check for db errors
db.on('error', function(err) {
  console.log(err);
});
// *****************************************************************************
// *****************************************************************************

// init app
const app = express();
//bring in models
let Article = require('./models/article');

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// *****************************************************************************
// *****************************************************************************
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Express Session Middleware
app.use(
  session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
  })
);

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(
  expressValidator({
    errorFormatter: function(param, msg, value) {
      var namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

// *****************************************************************************
// *****************************************************************************
// import Passport config
require('./config/passport')(passport);

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
  res.locals.user = req.user || null;
  next();
});

//set public folder
app.use(express.static(path.join(__dirname, 'public')));

// home route
app.get('/', function(req, res) {
  Article.find({}, function(err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', {
        title: 'Articles',
        articles: articles
      });
    }
  });
});

//route files
let articles = require('./routes/articles');
let users = require('./routes/users');
app.use('/article', articles);
app.use('/users', users);

//start server
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log('Server started on port :' + port);
});
