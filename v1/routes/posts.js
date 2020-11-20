const express = require('express')
const router = express.Router()

//Schema validations
const Joi = require('joi')
const { psSchema, commentSchema } = require('../models/schemavs');

//Import utils
const { exError,hError,hDebug,hInfo,authUser,authRole,wrapAsync } = require('../utils/utils')

//Models
const Comment = require('../models/comments');
const Post = require('../models/posts');

//====USER POSTS start
    //ALL POSTS
    router.get('/', wrapAsync(async (req, res) => {
        Post.find().then(posts=>res.render('post', { title:"Posts", posts }));
    }));
    //VIEW POST
    router.get('/:id',authUser, wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const post = await Post.findById(id).populate('comments').populate('userId');
        if (!post) {
            hError("Error getting post!");
            next(new exError(404,"Post not found!"));
        } else {
            res.render('post/show',{ title:"Post by "+post.username, post });
        }
    }));
    //CREATE POST
    router.post('/',authUser, wrapAsync(async (req, res, next) => {
        let dat = req.body;
        dat.post.userId = req.user._id;
        dat.post.created = Date.now();
        
        const vPost = psSchema.validate(dat);
        console.dir(vPost.error);
        if (vPost.error) {
            hError("Error creating post!");
            next(new exError(500,"Error making post! \n"+vPost.error.details[0].message));
        } else {
            hDebug("No error!");
            const post = new Post(dat.post);
            await post.save();
            req.flash('success','Post has been created!');
            res.redirect(`/post`);
        };
    }));
    //DELETE POST
    router.delete('/:id/delete',authUser, wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        req.flash('success','Post has been deleted!');
        res.redirect('/post');
    }));
    //EDIT POST PAGE
    router.get('/:id/edit',authUser, wrapAsync(async (req, res) => {
        const { id } = req.params;
        Post.findById(id)
            .then((response)=>{
                res.render('post/edit',{ title:"Edit post", response });
            });
    }));
    //EDIT POST ACTION
    router.patch('/:id/edit',authUser, wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Post.findByIdAndUpdate(id, req.body, {runValidators: true});
        req.flash('success','Post has been edited!');
        res.redirect('/post');
    }));
//====POST COMMENTS
    //CREATE COMMENT
    router.post('/:id/comment',authUser, wrapAsync(async (req, res, next) => {
        let dat = req.body;
        dat.comment.userId = req.user._id;
        dat.comment.created = Date.now();


        const { id } = req.params;
        const vComment = commentSchema.validate(dat);
        //Validate input matches schema
        if (vComment.error) {
            hError("Comment failed validation! DETAILS:\n"+vComment.error)
            const msg = vComment.error.details.map(el => el.message).join(',')
            
            req.flash('failure','Unable to submit your comment! Please try again. ERROR: '+msg);
            req.flash('data',dat.comment);
            res.redirect(`/post/${id}`);
        } else {
            const post = await Post.findById(id);
            const comment = new Comment(dat.comment);
            post.comments.unshift(comment);
            await comment.save();
            await post.save();
            req.flash('success','Comment has been posted!');
            res.redirect(`/post/${id}`);
        }
    }));
    //DELETE COMMENT
    router.delete('/:id/:cid',authUser, wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        await Post.findByIdAndUpdate(id,{$pull: {comments: cid}});
        await Comment.findByIdAndDelete(cid);
        req.flash('success','Comment has been deleted!');
        res.redirect(`/post/${id}`);
    }));
    //EDIT COMMENT PAGE
    router.get('/:id/:cid/edit',authUser, wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const post = await Post.findById(id);
        const comment = await Comment.findById(cid);
        
        res.render('post/cedit',{ title:"Edit comment", comment, post });
    }));
    //EDIT COMMENT ACTION
    router.patch('/:id/:cid/edit',authUser, wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        await Comment.findByIdAndUpdate(cid, req.body, {runValidators: true});
        req.flash('success','Comment has been edited!');
        res.redirect(`/post/${id}`);
    }));
//====USER POSTS END

module.exports = router;