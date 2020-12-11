const express = require('express');
const router = express.Router();

//Utils
const { exError,hError,validateProduct,isSeller,isReviewer,hDebug,authUser,authRole,wrapAsync } = require('../../utils');
const roblox = require('../../trade')

//Controller
const products = require('../controllers/products');

//=====Roblox API
router.route('/rbx/getInventory/:id') //GET /rbx/getInventory/50449192
    .get(wrapAsync(async (req, res) => {
        const { id } = req.params;
        const result = await roblox.getInventory(id);
        res.json(result)
    }));
router.route('/rbx/getUserId') //GET /rbx/getUserId?username=PS3UDO
    .post(wrapAsync(async (req, res) => {
        const userName = req.body.username;
        console.log("Getting user ID of ",userName)
        const result = await roblox.getUserId(userName);
        const userID = result.Id
        if (userID) {
            res.json(userID)
        } else {
            res.json(result)
        }
    }));

//Routes
router.route('/inventory')
    .get(wrapAsync(async (req, res) => {
        if (req.query.username) {
            const userName = req.query.username;
            console.log("Getting user ID of ",userName)
            const result = await roblox.getUserId(userName);
            const userID = result.Id
            if (userID) {
                console.log("/inventory: Got user ID!",userID)
                res.redirect(`/inventory/${userID}`);
            } else {
                req.flash('failure',result)
                res.redirect(`/inventory`);
            }
        } else {
            res.render('manage/inventory', {title:"Inventory"})
        }
    }));
router.route('/inventory/:id')
    .get(wrapAsync(async (req, res) => {
        const { id } = req.params;
        const rolidata = await roblox.getMarketValues();
        let inventory = await roblox.getInventory(id);
        let i = 0;
        for (let item of inventory.data) {
            let idat = rolidata.items[item.assetId];
            if (idat) {
                item.name = idat[0]
                item.price = idat[2]
            } else {
                delete inventory.data[i]
            };
            i++;
        }
        console.dir(inventory.data)
        res.render('manage/inventory', {title:"Inventory", inventory})
    }));
router.route('/trades')
    .get(wrapAsync(async (req, res) => {
        res.render('manage/trades', {title:"Trades"})
    }));
module.exports = router;