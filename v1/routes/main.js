const express = require('express')
const router = express.Router()

//Schema validations
const Joi = require('joi')
const { prSchema, psSchema, commentSchema, reviewSchema } = require('../models/schemavs')

//Import utils
const { exError,hError,hDebug,hInfo,setUser,authUser,authRole,wrapAsync } = require('../utils/utils')

//Models
const { User,Group } = require('../models/users');

//Require sign in
//router.use(authUser)

module.exports = router;