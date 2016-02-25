var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var mongoose = require('mongoose');
var session = require('express-session');
var index = require('./routes/index');

var app = express();
var COMMENTS_FILE = path.join(__dirname, 'comments.json');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'wow this is a secret',
    resave: false,
    saveUninitialized: false,
    cookie:{}
}));

app.get('/', index.home);

app.get('/api/noots', index.showNoots);
app.post('/api/compose', index.newNoot);
app.post('/api/remove', index.remove);
app.post('/api/toggle', index.toggle);

mongoose.connect('mongodb://keenan:olinjs@ds011228.mongolab.com:11228/toodoo', function(err){
	if(err) console.log(err);
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function() {
  console.log("Application running on port: ", PORT);
});

module.exports = app;