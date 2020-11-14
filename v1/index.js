const express = require('express');
const app = express();
const path = require('path');
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
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync } = require('./utils/utils')

mongoose.connect('mongodb://localhost:27017/firstSite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(()=>{hInfo("Connected to MongoDB.")}).catch(e => hError("Error connecting to MongoDB: "+e));



//Middleware/config
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(cookieParser(secretTemp));
app.use(session(sessionConfig));
app.use(morgan('dev'));
app.use(setUser);
app.use(flash());
app.engine('ejs',ejsMate);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');
app.use((req,res,next) => {
    res.locals.data = req.flash('data');
    res.locals.success = req.flash('success');
    res.locals.failure = req.flash('failure');
    res.locals.shows = req.flash('shows');
    next()
})


//Routes
const storeRoutes = require('./routes/store');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
const testRoutes = require('./routes/tests');
app.use('/store',storeRoutes);
app.use('/post',postRoutes);
app.use('',userRoutes);
app.use('',testRoutes);


//home page
app.get('/', (req, res) => {
    res.render('home',{title:"Home"});
});
app.get('/about', (req, res) => {
    res.render('about',{title:"About us"});
});



//====TV SEARCH API START
    app.get('/shows',authUser, (req, res) => {
        hDebug("/shows get");
        res.render('shows',{title:"Shows"});
    }); 
    app.post('/shows',authUser, wrapAsync(async (req, res) => {
        console.log("Show test!");
        console.dir(req.body);
        const shows = await axios.get("http://api.tvmaze.com/search/shows?q="+req.body.search);
        req.flash('success','Search results received!');
        req.flash('shows',shows.data);
        res.redirect('/shows');
    }));
//====TV SEARCH API END


//====Uncatgorized
    //GAME PAGE
    app.get('/game',authUser, (req, res) => {
        res.render('game',{title:"Game"});
    });
    //Catch invalid
    app.all('*', (req,res,next)=>{
        next(new exError(404,"Page not found!"));
    });
//====Uncatgorized


//===ERROR MIDDLEWARE
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    const { message = "Something went wrong.\nERROR: "} = err;
    //hError("ERROR! "+err)
    hError("ERROR MSG: "+message);
    hError("ERROR STATUS: "+status);
    res.render('error',{title: status+' error!',status,message});
});


app.listen(3000, () => {hInfo("LISTENING ON PORT 3000")});