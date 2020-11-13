const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const Joi = require('joi')
const { prSchema, psSchema } = require('./models/schemavs')
const Post = require('./models/posts');
const Comment = require('./models/comments');
const Product = require('./models/products');
const Review = require('./models/reviews');
const User = require('./models/users');
const exError = require('./exError')

//fake db -TEMP 
const { ROLE, users } = require('./data')

const morgan = require('morgan');
const { stringify } = require('querystring');
const { type } = require('os');
const colorize = require('colorize');
const cconsole = colorize.console;
const projectRouter = require('./routes/projects');
const { join } = require('path');

const hError = (e) => {cconsole.log(`#red[${e}]`)};
const hDebug = (e) => {cconsole.log(`#cyan[${e}]`)};
const hInfo = (e) => {cconsole.log(`#green[${e}]`)};


mongoose.connect('mongodb://localhost:27017/firstSite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then(()=>{hInfo("Connected to MongoDB.")})
.catch(e => hError("Error connecting to MongoDB: "+e));

function setUser (req,res,next) {
    const userId = req.body.userId;
    if (userId) {
        req.user = users.find(user => user.id === userId)
    }
    next()
}
function authUser (req,res,next) {
    if (req.user == null) {
        return res.status(403).render('login',{title:"You must be signed in for this!", message: `Please sign in to access ${req.path}`})
    }
    next()
}
function authRole (role) {
    return (req,res,next) => {
        if (req.user.role !== role) {
            next(new exError(401,"Access denied. WTF?."))
        } else {
            next()
        }
    }
}
function wrapAsync(fn) {
    return function(req,res,next) {
        fn(req,res,next).catch((e) => next(e))
    }
}
app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(setUser)
app.use('/projects',projectRouter);
app.use(morgan('dev'));
app.engine('ejs',ejsMate)
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs');




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




//====PRODUCT STORE START
    //ALL PRODUCTS
    app.get('/store', wrapAsync(async (req, res) => {
        Product.find()
            .then((products)=>{
            res.render('store', { title:"Store", products })
        });
    }));
    //CREATE PRODUCT PAGE
    app.get('/store/new', authUser, authRole(ROLE.ADMIN), wrapAsync(async (req, res) => {
        res.render('store/create', {title:"Create new product"})
    }));
    //CREATE PRODUCT ACTION
    app.put('/store/new', authUser, authRole(ROLE.ADMIN), wrapAsync(async (req, res, next) => {
        const vProduct = prSchema.validate(req.body);
        if (vProduct.error) {
            res.render('store/create', {title:"Create new product",error:"Error adding product! \n"+vProduct.error,data:req.body.product})
        } else {
            const product = new Product(req.body.product);
            await product.save();
            res.redirect(`/store/${product._id}`)
        }
    }));
    //VIEW PRODUCT
    app.get('/store/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        Product.findById(id).then((r)=>{
            if (r) {
                res.render('store/show',{ title:"Store", response:r });
            } else {
                next(new exError(404,"Product not found! CODE _M"))
            }
        }).catch((e)=>{
            hError("error")
            next(new exError(404,"Product not found! CODE _C"))
        })
    }));
    //EDIT PRODUCT PAGE
    //app.get('/store/:id/edit', authUser, authRole(ROLE.ADMIN), async (req, res) => {
    app.get('/store/:id/edit', authUser, authRole(ROLE.ADMIN), wrapAsync(async (req, res) => {
        const { id } = req.params;
        Product.findById(id).then((response)=>{
            res.render('store/edit',{ title:"Store", response });
        });
    }));
    //EDIT PRODUCT ACTION
    //app.put('/store/:id/edit', authUser, authRole(ROLE.ADMIN), async (req, res) => {
    app.put('/store/:id/edit', authUser, authRole(ROLE.ADMIN), wrapAsync(async (req, res) => {
        const { id } = req.params;
        const foundProduct = await Product.findByIdAndUpdate(id, req.body, {runValidators: true});
        hDebug("Updated product.")
        res.redirect("/store/"+id);
    }));
    //DELETE PRODUCT
    app.delete('/store/:id/edit', authUser, authRole(ROLE.ADMIN), wrapAsync(async (req, res) => {
        const { id } = req.params;
        const deletedProduct = await Product.findByIdAndDelete(id);
        res.redirect("/store");
    }));
//====PRODUCTS END




//====PRODUCT REVIEWS START
    //POST REVIEW
    app.post('/store/:id/comment', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const product = await Product.findById(id);
        const review = new Review(req.body.review);
        product.reviews.push(review);
        await review.save();
        await product.save();
        res.redirect(`/store/${id}`);
    }));
    //EDIT REVIEW PAGE
    app.get('/store/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        Product.findById(id)
            .then((response)=>{
                const {id, name, description, price, stock, rating, ratings, comments} = response;
                const comment = comments.find(e => {
                    const {id,username,comment} = e;
                    return id == cid
                });
                res.render('store/cedit',{ title:"Store", comment, id, name });
            });
    }));
    //EDIT REVIEW ACTION
    app.patch('/store/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const foundProduct = await Product.findById(id);
        foundProduct.updateComment(cid,req.body.comment);
        hDebug('Review patch success');
        res.redirect(`/store/${id}`);
    }));
    //DELETE REVIEW
    app.delete('/store/:id/:cid/edit' , wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const foundProduct = await Product.findById(id);
        foundProduct.deleteComment(cid)
            .then(()=>{
                hDebug("DELETE SUCCESS")
                res.redirect(`/store/${id}`);
            })
            .catch((e)=>{
                hError("DELETE FAIL: "+e)
            });
    }));
//====PRODUCT STORE END




//====USER POSTS START
    //ALL POSTS
    app.get('/post', wrapAsync(async (req, res) => {
        Post.find()
            .then((posts)=>{
            res.render('post', { title:"Posts", posts })
        });
    }));
    //CREATE POST
    app.post('/post', authUser, authRole(ROLE.ADMIN), wrapAsync(async (req, res, next) => {
        const vPost = psSchema.validate(req.body);
        if (vPost.error) {
            hError("Error creating post!")
            next(new exError(500,"Error making post!\n"+vPost.error.details))
        } else {
            const post = new Post(req.body.post);
            await post.save();
            res.redirect(`/post/${post._id}`);
        }
    }));
    //VIEW POST
    app.get('/post/:id', wrapAsync(async (req, res) => {
        const { id } = req.params;
        try {
            const response = await Post.findById(id);
            res.render('post/show',{ title:"Post", response });
        } catch (e) {
            hError("/post/"+id+" get ERROR: "+e);
        }
    }));
    //EDIT POST PAGE
    app.get('/post/:id/edit', authUser, authRole, wrapAsync(async (req, res) => {
        const { id } = req.params;
        Post.findById(id)
            .then((response)=>{
                res.render('post/edit',{ title:"Edit post", response });
            });
    }));
    //EDIT POST ACTION
    app.patch('/post/:id/edit', authUser, authRole, wrapAsync(async (req, res) => {
        const { id } = req.params;
        const foundPost = await Post.findById(id);
        foundPost.updatePost(req.body.comment);
        hDebug('Patch success');
        res.redirect('/post');
    }));
    //DELETE POST
    app.delete('/post/:id/delete', authUser, authRole, wrapAsync(async (req, res) => {
        const { id } = req.params;
        hDebug(`/post/${id}/delete patch`);
        await Post.deleteOne({ _id: id });
        res.redirect('/post');
    }));
    //POST COMMENTS
    app.post('/post/:id/comment', authUser, authRole, wrapAsync(async (req, res) => {
        const { id } = req.params;
        const { username: username = "Default", comment: comment = "undefined" } = req.body;
        hDebug("COMMENT: "+comment);
        const foundPost = await Post.findById(id);
        foundPost.addComment(username,comment)
            .then(()=>{
                res.redirect(`/post/${id}`);
            }).catch((e)=>{
                hError("ERROR adding comment: "+e)
            });
    }));
    //EDIT COMMENT PAGE
    app.get('/post/:id/:cid/edit', authUser, authRole, wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        Post.findById(id)
            .then((response)=>{
                const {id, name, description, price, stock, rating, ratings, comments} = response;
                const comment = comments.find(e => {
                    const {id,username,comment} = e;
                    return id == cid
                });
                res.render('post/cedit',{ title:"Edit comment", comment, id, name });
            });
    }));
    //EDIT COMMENT ACTION
    app.patch('/post/:id/:cid/edit', authUser, authRole, wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const foundPostComment = await Post.findById(id);
        foundPostComment.updateComment(cid,req.body.comment).then(()=>{
            hDebug('Post comment patch success');
            res.redirect(`/post/${id}`);
        }).catch((e)=>{
            hError("Error updating comment!"+e);
        });
    }));
    //DELETE COMMENT
    app.delete('/post/:id/:cid/edit', authUser, authRole, wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const foundPost = await Post.findById(id);
        foundPost.deleteComment(cid).then(()=>{
            hDebug("DELETE SUCCESS")
            res.redirect(`/post/${id}`);
        }).catch((e)=>{
            hError("DELETE FAIL: "+e)
        });
    }));
//====USER POSTS END




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
    //404
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