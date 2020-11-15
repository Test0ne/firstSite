//Express
const express = require('express');
const app = express();
const path = require('path');

//Express middleware
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const axios = require ('axios');
const { stringify } = require('querystring');
const { type } = require('os');
const { join } = require('path');

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
}

//Import utils
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync,routeCatch } = require('./utils/utils')

//Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/firstSite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>{hInfo("Connected to MongoDB.")}).catch(e => hError("Error connecting to MongoDB: "+e));


//Setup EJS render engine
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Add Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser(secretTemp));
app.use(session(sessionConfig));
app.use(morgan('dev'));
app.use(flash());
app.use(setUser);


//Setup routes
const storeRoutes = require('./routes/store');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const testRoutes = require('./routes/tests');
const mainRoutes = require('./routes/main');
app.use('',mainRoutes);
app.use('/store',storeRoutes);
app.use('/post',postRoutes);
app.use('',userRoutes);
app.use('',testRoutes);

//Error middelware
app.use(routeCatch);

//Catch invalid requests
app.all('*', (req,res,next)=>{
    next(new exError(404,"Page not found!"));
});

//Start server
app.listen(3000, () => {hInfo("LISTENING ON PORT 3000")});