const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')

//Schema validations
const Joi = require('joi')
const { prSchema, psSchema, commentSchema, reviewSchema } = require('./models/schemavs')

//Import utils
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync } = require('./utils/utils')

//Routers, unused.
//const projectRouter = require('./routes/projects');
//app.use('/projects',projectRouter);

//Models
const User = require('./models/users');
const Group = require('./models/groups');

const Post = require('./models/posts');
const Comment = require('./models/comments');

const Product = require('./models/products');
const Review = require('./models/reviews');

const morgan = require('morgan');
const { stringify } = require('querystring');
const { type } = require('os');
const { join } = require('path');


mongoose.connect('mongodb://localhost:27017/firstSite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true
}).then(()=>{hInfo("Connected to MongoDB.")})
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
    app.get('/store/new', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res) => {
        res.render('store/create', {title:"Create new product"})
    }));
    //CREATE PRODUCT ACTION
    app.put('/store/new', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res, next) => {
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
        const product = await Product.findById(id).populate('reviews');
        res.render('store/show',{ title:"Store", product });
    }));
    //EDIT PRODUCT PAGE
    //app.get('/store/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), async (req, res) => {
    app.get('/store/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res) => {
        const { id } = req.params;
        Product.findById(id).then((response)=>{
            res.render('store/edit',{ title:"Store", response });
        });
    }));
    //EDIT PRODUCT ACTION
    //app.put('/store/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), async (req, res) => {
    app.put('/store/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Product.findByIdAndUpdate(id, req.body, {runValidators: true});
        hDebug("Updated product.")
        res.redirect("/store/"+id);
    }));
    //DELETE PRODUCT
    app.delete('/store/:id/edit', authUser, authRole(Group.findOne({name: "Admin"})), wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        res.redirect("/store");
    }));
//====PRODUCTS END


//====PRODUCT REVIEWS START
    //POST REVIEW
    app.post('/store/:id/review', wrapAsync(async (req, res, next) => {
        const { id } = req.params;

        const vReview = reviewSchema.validate(req.body);
        console.log("REQ BODY:")
        console.dir(req.body)
        if (vReview.error) {
            hError("Review failed validation! DETAILS:\n"+vReview.error)
            const msg = vReview.error.details.map(el => el.message).join(',')
            next(new exError(500,"Error posting review! ERROR DETAILS: "+msg))
            //Final version should redirect to form with error msg for better user experience.
            //res.redirect(`/store/${id}`, {title:"Create new product",error:"Error submitting review! \n"+vReview.error,data:req.body.review});
        } else {
            const product = await Product.findById(id);
            const review = new Review(req.body.review);
            product.reviews.push(review);
            await review.save();
            await product.save();
            res.redirect(`/store/${id}`);
        }
    }));
    //EDIT REVIEW PAGE
    app.get('/store/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const product = await Product.findById(id);
        const review = await Review.findById(cid);
        
        res.render('store/cedit',{ title:"Edit review", product, review });
    }));
    //EDIT REVIEW ACTION
    app.patch('/store/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;

        await Review.findByIdAndUpdate(cid, req.body, {runValidators: true});
        hDebug('Review patch success');
        res.redirect(`/store/${id}`);
    }));
    //DELETE REVIEW
    app.delete('/store/:id/:cid/edit' , wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        await Product.findByIdAndUpdate(id,{$pull: {reviews: cid}});
        await Review.findByIdAndDelete(cid);
        res.redirect(`/store/${id}`);
    }));
//====PRODUCT STORE END




//====USER POSTS start
    //ALL POSTS
    app.get('/post', wrapAsync(async (req, res) => {
        Post.find()
            .then((posts)=>{
            res.render('post', { title:"Posts", posts })
        });
    }));
    //VIEW POST
    app.get('/post/:id', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const post = await Post.findById(id).populate('comments');;
        
        res.render('post/show',{ title:"Post by "+post.username, post })
    }));
    //CREATE POST
    app.post('/post', wrapAsync(async (req, res, next) => {
        
        console.log("Sending post!")
        const vPost = psSchema.validate(req.body);
        if (vPost.error) {
            hError("Error creating post!")
            next(new exError(500,"Error making post!\n"+vPost.error.details))
        } else {
            
            console.log("No error!")
            const post = new Post(req.body.post);
            await post.save();
            res.redirect(`/post/${post._id}`);
        }
    }));
    //DELETE POST
    app.delete('/post/:id/delete', wrapAsync(async (req, res) => {
        const { id } = req.params;
        hDebug(`/post/${id}/delete patch`);
        await Post.deleteOne({ _id: id });
        res.redirect('/post');
    }));
    //EDIT POST PAGE
    app.get('/post/:id/edit', wrapAsync(async (req, res) => {
        const { id } = req.params;
        Post.findById(id)
            .then((response)=>{
                res.render('post/edit',{ title:"Edit post", response });
            });
    }));
    //EDIT POST ACTION
    app.patch('/post/:id/edit', wrapAsync(async (req, res) => {
        const { id } = req.params;
        const foundPost = await Post.findById(id);
        foundPost.updatePost(req.body.comment);
        hDebug('Patch success');
        res.redirect('/post');
    }));
//====POST COMMENTS
    //CREATE COMMENT
    app.post('/post/:id/comment', wrapAsync(async (req, res, next) => {
        const { id } = req.params;

        const vComment = commentSchema.validate(req.body);
        console.log("REQ BODY:")
        console.dir(req.body)
        if (vComment.error) {
            hError("Comment failed validation! DETAILS:\n"+vComment.error)
            const msg = vComment.error.details.map(el => el.message).join(',')
            next(new exError(500,"Error posting comment! ERROR DETAILS: "+msg))
            //Final version should redirect to form with error msg for better user experience.
            //res.redirect(`/post/${id}`, {title:"Post by ",error:"Error submitting comment! \n"+vReview.error,data:req.body.comment});
        } else {
            const post = await Post.findById(id);
            const comment = new Comment(req.body.comment);
            post.comments.push(comment);
            await comment.save();
            await post.save();
            res.redirect(`/post/${id}`);
        }
    }));
    //DELETE COMMENT
    app.delete('/post/:id/:cid', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const foundPost = await Post.findById(id);
        foundPost.deleteComment(cid).then(()=>{
            hDebug("DELETE SUCCESS")
            res.redirect(`/post/${id}`);
        }).catch((e)=>{
            hError("DELETE FAIL: "+e)
        });
    }));
    //EDIT COMMENT PAGE
    app.get('/post/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const post = await Post.findById(id);
        const comment = await Comment.findById(cid);
        
        res.render('post/cedit',{ title:"Edit comment", comment, post });
    }));
    //EDIT COMMENT ACTION
    app.patch('/post/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;

        await Comment.findByIdAndUpdate(cid, req.body, {runValidators: true});
        hDebug('Comment patch success');
        res.redirect(`/post/${id}`);
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