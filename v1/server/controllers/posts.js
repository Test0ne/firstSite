

//Schema validations
const Joi = require('joi')
const { psSchema, commentSchema } = require('../models/schemavs');

//Import utils
const { exError,hError,hDebug,hInfo,authUser,authRole,wrapAsync } = require('../../utils')

//Models
const Comment = require('../models/comments');
const Post = require('../models/posts');


module.exports.allPosts = async () => {};