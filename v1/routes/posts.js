const express = require('express')
const router = express.Router()

//Schema validations
const Joi = require('joi')
const { prSchema, psSchema, commentSchema, reviewSchema } = require('../models/schemavs')

//Import utils
const { exError,hError,hDebug,hInfo,authUser,authRole,wrapAsync } = require('../utils/utils')

//Models
const { User,Group } = require('../models/users');
const Comment = require('../models/comments');
const Post = require('../models/posts');

//====USER POSTS start
    //ALL POSTS
    router.get('/', wrapAsync(async (req, res) => {
        Post.find().then(posts=>res.render('post', { title:"Posts", posts }));
    }));
    //VIEW POST
    router.get('/:id', wrapAsync(async (req, res, next) => {
        const { id } = req.params;
        const post = await Post.findById(id).populate('comments');;
        if (!post) {
            hError("Error getting post!");
            next(new exError(404,"Post not found!"));
        } else {
            res.render('post/show',{ title:"Post by "+post.username, post })
        }
    }));
    //CREATE POST
    router.post('/', wrapAsync(async (req, res, next) => {
        
        console.log("Sending post!")
        const vPost = psSchema.validate(req.body);
        if (vPost.error) {
            hError("Error creating post!")
            next(new exError(500,"Error making post!\n"+vPost.error.details))
        } else {
            
            console.log("No error!")
            const post = new Post(req.body.post);
            await post.save();
            req.flash('success','Post has been created!');
            res.redirect(`/post`);
        }
    }));
    //DELETE POST
    router.delete('/:id/delete', wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Post.findByIdAndDelete(id);
        req.flash('success','Post has been deleted!');
        res.redirect('/post');
    }));
    //EDIT POST PAGE
    router.get('/:id/edit', wrapAsync(async (req, res) => {
        const { id } = req.params;
        Post.findById(id)
            .then((response)=>{
                res.render('post/edit',{ title:"Edit post", response });
            });
    }));
    //EDIT POST ACTION
    router.patch('/:id/edit', wrapAsync(async (req, res) => {
        const { id } = req.params;
        await Post.findByIdAndUpdate(id, req.body, {runValidators: true});
        req.flash('success','Post has been edited!');
        res.redirect('/post');
    }));
//====POST COMMENTS
    //CREATE COMMENT
    router.post('/:id/comment', wrapAsync(async (req, res, next) => {
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
            req.flash('success','Comment has been posted!');
            res.redirect(`/post/${id}`);
        }
    }));
    //DELETE COMMENT
    router.delete('/:id/:cid', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        await Post.findByIdAndUpdate(id,{$pull: {comments: cid}});
        await Comment.findByIdAndDelete(cid);
        req.flash('success','Comment has been deleted!');
        res.redirect(`/post/${id}`);
    }));
    //EDIT COMMENT PAGE
    router.get('/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        const post = await Post.findById(id);
        const comment = await Comment.findById(cid);
        
        res.render('post/cedit',{ title:"Edit comment", comment, post });
    }));
    //EDIT COMMENT ACTION
    router.patch('/:id/:cid/edit', wrapAsync(async (req, res) => {
        const { id, cid } = req.params;
        await Comment.findByIdAndUpdate(cid, req.body, {runValidators: true});
        req.flash('success','Comment has been edited!');
        res.redirect(`/post/${id}`);
    }));
//====USER POSTS END

module.exports = router;