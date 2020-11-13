const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')

//Import utils
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync } = require('./utils/utils')

const morgan = require('morgan');
const { stringify } = require('querystring');
const { type } = require('os');
const { join } = require('path');


mongoose.connect('mongodb://localhost:27017/firstSite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
})
    .then(()=>{hInfo("Connected to MongoDB.")})
    .catch(e => hError("Error connecting to MongoDB: "+e));


app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(setUser)
app.use(morgan('dev'));
app.engine('ejs',ejsMate)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');



//Routes
const productRoutes = require('./routes/products')
const postRoutes = require('./routes/posts')
app.use('/store',productRoutes)
app.use('/post',postRoutes)


//cookie test
app.get('/greet', (req, res) => {
    res.send("Hello ")
});

//cookie test
app.get('/nameset', (req, res) => {
    res.cookie('name','Dami')
    res.send('Cookie sent!')
});

//home page
app.get('/', (req, res) => {
    res.render('home',{title:"Home"})
});
app.get('/home', (req, res) => {
    res.render('home',{title:"Home"})
});
app.get('/about', (req, res) => {
    res.render('about',{title:"About us"})
});




//====USER MANAGEMENT START
    app.get('/register', (req, res) => {
        res.render('register', {title:"Sign up"})
    });
    app.post('/register', (req, res) => {
        res.render('register', {title:"Sign up"})
    });
    app.get('/login', (req, res) => {
        res.render('login', {title:"Sign in"})
    });
//====USER MANAGEMENT END




//====TV SEARCH API START
    app.get('/shows', (req, res) => {
        hDebug("/shows get")
        res.render('shows',{title:"Shows"})
    }); 
    app.post('/shows', (req, res) => {
        const { shows } = req.body;
        hDebug("/shows post: "+req.body)
        res.render('shows',{ title:"Shows",shows })
    });
    app.post('/shows', (req, res) => {
        const { shows } = req.body;
        hDebug("/shows post: "+req.body)
        res.render('shows',{ title:"Shows",shows })
    });
//====TV SEARCH API END




//====Uncatgorized
    //GAME PAGE
    app.get('/game', (req, res) => {
        res.render('game',{title:"Game"})
    });
    //Catch invalid
    app.all('*', (req,res,next)=>{
        next(new exError(404,"Page not found!"))
    })
//====Uncatgorized




//===ERROR MIDDLEWARE
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    const { message = "Something went wrong.\nERROR: "} = err;
    //hError("ERROR! "+err)
    hError("ERROR MSG: "+message)
    hError("ERROR STATUS: "+status)
    res.render('error',{title: status+' error!',status,message})
})




app.listen(3000, () => {
    hInfo("LISTENING ON PORT 3000")
});