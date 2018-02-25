const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const hbs = require('hbs');
const expressHbs = require('express-handlebars');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const config = require('./config/secret');

mongoose.connect(config.database, function(err){
	if (err) console.log(err);
	console.log("connected to the database");
});

const app = express();

app.engine('.hbs', expressHbs({ defaultLayout: 'layout', extname: '.hbs' }));
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: config.secret,
	store: new MongoStore({ url: config.database, autoReconnect: true })
}));
app.use(flash());
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const mainRoutes = require('./routes/main');
const userRoutes = require('./routes/user');


app.use(mainRoutes);
app.use(userRoutes);


app.listen(8080, (err) => {
	if (err) console.log(err);
	console.log('Running on port ${8080}');
});
