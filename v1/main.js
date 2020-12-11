//Express
const express = require('express');
const app = express();
const path = require('path');

//Express middleware
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const flash = require('req-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');

//Session configuration
const secretTemp = 'secretKeyExample2';
const sessionConfig = {
    secret: secretTemp,
    /**store: '',*/ 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + (1000 * 60 * 60 * 24) * 7,
        maxAge: Date.now() + (1000 * 60 * 60 * 24) * 7
    }
};

//Define Utils
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync,routeCatch } = require('./utils');

//Import User model for passport
const { User } = require('./server/models/users');

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/firstSite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>{hInfo("Connected to MongoDB.")}).catch(e => hError("Error connecting to MongoDB: "+e));


//Setup EJS render engine
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname, '/server/views'));
app.set('view engine', 'ejs');

//Add Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser(secretTemp));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(session(sessionConfig));
app.use(morgan('dev'));

//Init and configure passport auth
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(flash());
app.use(setUser);


//Setup routes
const manageRoutes = require('./server/routes/manage');
const storeRoutes = require('./server/routes/store');
const postRoutes = require('./server/routes/posts');
const userRoutes = require('./server/routes/user');
const testRoutes = require('./server/routes/tests');
const mainRoutes = require('./server/routes/other');
app.use('',mainRoutes);
app.use('',manageRoutes);
app.use('/store',storeRoutes);
app.use('/post',postRoutes);
app.use('',userRoutes);
app.use('',testRoutes);

//Error middelware
app.use(routeCatch);

//Catch invalid requests
app.all('*', wrapAsync(async (req,res,next)=>{
    res.render('error',{title: '404 error!',status: 404,message: 'Page not found!!!'});
}));

//Start server
app.listen(3000, () => {hInfo("LISTENING ON PORT 3000")});