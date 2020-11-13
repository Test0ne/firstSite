const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const { stringify } = require('querystring');
const { type } = require('os');
const { join } = require('path');

//Import utils
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync } = require('./utils/utils')

mongoose.connect('mongodb://localhost:27017/firstSite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(()=>{hInfo("Connected to MongoDB.")}).catch(e => hError("Error connecting to MongoDB: "+e));



//Middleware/config
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(cookieParser('secretKeyExample1'));
app.use(session({ secret: 'secretKeyExample2', /**store: '',*/ resave: false, saveUninitialized: false}))
app.use(morgan('dev'));
app.use(setUser)
app.engine('ejs',ejsMate)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');


//Routes
const productRoutes = require('./routes/products')
const postRoutes = require('./routes/posts')
app.use('/store',productRoutes)
app.use('/post',postRoutes)


//session test
app.get('/session', wrapAsync(async (req, res) => {
    if (req.session.testVar)  {req.session.testVar += 1} else {req.session.testVar = 1}
    res.render('error',{title: 'Session test',status:"Session test",message:"Visit "+req.session.testVar})
}));
//session name
app.get('/setname', wrapAsync(async (req, res) => {
    const { username = "Anonymous" } = req.query;
    req.session.username = username;
    res.redirect('/greets');
}));
//session greet
app.get('/greets', async (req, res) => {
    res.render('error',{title: 'Greet session',status:"Hello",message:req.session.username})
});
//cookie read test
app.get('/greet', async (req, res) => {
    const { name = "default" } = req.signedCookies;
    res.render('error',{title: 'Greet',status:"Hello",message:name})
});
//cookie set test
app.get('/nameset', async (req, res) => {
    res.cookie('name','Swager', { signed: true })
    res.render('error',{title: 'Cookie set',status:"Cookie has been set.",message:"Enjoy!"})
});


//home page
app.get('/', (req, res) => {
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


app.listen(3000, () => {hInfo("LISTENING ON PORT 3000")});