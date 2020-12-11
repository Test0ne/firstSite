const assetTypeIds = {
    EmoteAnimation: 61,
    PoseAnimation: 56,
    SwimAnimation: 54,
    WalkAnimation: 55,
    RunAnimation: 53,
    JumpAnimation: 52,
    IdleAnimation: 51,
    FallAnimation: 50,
    DeathAnimation: 49,
    ClimbAnimation: 48,
    WaistAccessory: 47,
    BackAccessory: 46,
    FrontAccessory: 45,
    ShoulderAccessory: 44,
    NeckAccessory: 43,
    FaceAccessory: 42,
    HairAccessory: 41,
    MeshPart: 40,
    RightLeg: 31,
    LeftLeg: 30,
    LeftArm: 29,
    RightArm: 28,
    Torso: 27,
    Animation: 24,
    Gear: 19,
    Face: 18,
    Head: 17,
    Decal: 13,
    Pants: 12,
    Shirt: 11,
    Hat: 8,
    Audio: 3
};
const handleError = async (e) => {
    console.log("handleError: ",e)
};
const https = require('https');
const trade_controller = {
    getMarketValues: async () => {
        return new Promise(((resolve,reject)=> {
            let data = '';
            const options = {
                hostname: 'www.rolimons.com',
                port: 443,
                path: '/itemapi/itemdetails',
                method: 'GET',
                headers: { 'User-Agent': 'Mozilla/5.0' },
            };
            const req = https.get(options, (res) => {
                console.log('getMarketValues: statusCode:', res.statusCode);
                console.log("getMarketValues: REQUEST RECEIVED!!")
                res.on('data', c => data += c);
                res.on('end', () => {
                    console.log("getMarketValues: REQUEST DONE!!")
                    resolve(JSON.parse(data))
                });
            });
            req.on('error', (e) => {
                console.log("getMarketValues: REQUEST ERROR!!")
                reject(e)
            });
        })).catch(e => handleError(e));
    },
    getXToken: (UserCookie) => {
        return new Promise((resolve, reject) => {
            const data = JSON.stringify({});
            const options = {
                hostname: 'auth.roblox.com',
                port: 443,
                path: '/v2/logout',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                    'Cookie': '.ROBLOSECURITY='.concat(UserCookie)
                }
            };
            const req = https.request(options, (res)=>{
                const xtoken = res.headers['x-csrf-token'];
                resolve(xtoken)
            });
            req.write(data);
            req.on('error', (e) => {
                reject('ERROR',e);
            });
            req.on('timeout', (e) => {
                reject('timeout',e);
            });
            req.on('uncaughtException', (e) => {
                reject('uncaughtException',e);
            });
            req.end();
        }).catch(e => handleError(e));
    },
    getTradebyId: async function (tradeId,UserCookie,xtoken) {
        const tcont = this;
        return new Promise(async (resolve,reject) =>{
            if (!xtoken) {
                xtoken = await tcont.getXToken(UserCookie);
                console.log("getTradebyId: Got XToken: ",xtoken);
            };
            let options = {
                host: 'trades.rprxy.xyz',
                path: `/v1/trades/${tradeId}`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'text/javascript; charset=UTF-8',
                    'Cookie': '.ROBLOSECURITY='.concat(UserCookie)
                }
            };
            options.headers['x-csrf-token'] = xtoken;
            https.get(options,async (res) => {
                    const scode = res.statusCode;
                    console.log("getTradebyId: HTTP RESPONSE: ",scode)
                    if (scode != 404) {
                        let data = '';
                        res.on('data', c => data += c);
                        res.on('end', () => {
                            resolve(JSON.parse(data) )
                        })

                    } else {reject("404")}
                }
            ).on('error', (e) => {
                reject(e);
            });
        }).catch(e => handleError(e));
    },
    sendTrade: async function (sellerID,clientID,targetItems = [],clientItems = [],Robux,UserCookie,xtoken) {
        const tcont = this;
        return new Promise(async (resolve,reject) =>{
            if (!xtoken) {
                xtoken = await tcont.getXToken(UserCookie);
                console.log("sendTrade: Got XToken: ",xtoken);
            };
            const data = {
                "offers": [
                    {
                        "userId": sellerID,
                        "userAssetIds": targetItems,
                        "robux": Robux[0]
                    },{
                        "userId": clientID,
                        "userAssetIds": clientItems,
                        "robux": Robux[1]
                    },
                ]
            };
            let options = {
                hostname: 'trades.rprxy.xyz',
                path: `/v1/trades/send`,
                port: 443,
                method: 'POST',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'application/json',
                    'Cookie': `.ROBLOSECURITY=${UserCookie}`
                }
            };
            options.headers['x-csrf-token'] = xtoken;
            const req = https.request(options,async (res) => {
                const scode = res.statusCode;
                console.log("sendTrade: HTTP RESPONSE: ",scode)
                if (scode != 404) {
                    let rdata = '';
                    res.on('data', c => rdata += c);
                    res.on('end', () => {
                        console.log("Data: ")
                        console.dir(rdata);
                        resolve(JSON.parse(rdata) )
                    })
                } else {reject("404")}
            });
            req.write(JSON.stringify(data));
            req.on('error', (e) => {
                reject(e);
            });
            req.end();
        }).catch(e => handleError(e))
    },
    getTrades: async function (UserCookie,addRoli) {
        return new Promise(async (resolve,reject) =>{
            const xtoken = await this.getXToken(UserCookie);
            console.log("getTrades: Got XToken: ",xtoken);
            let options = {
                host: 'trades.rprxy.xyz',
                path: '/v1/trades/Inbound?sortOrder=Asc&limit=10',
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'text/javascript; charset=UTF-8',
                    'Cookie': '.ROBLOSECURITY='.concat(UserCookie)
                }
            };
            options.headers['x-csrf-token'] = xtoken;
            https.get(options,async (res) => {
                    const scode = res.statusCode;
                    console.log("getTrades: HTTP RESPONSE: ",scode)
                    if (scode != 404) {
                        let data = '';
                        res.on('data', c => data += c);
                        res.on('end', async () => {
                            let trades = JSON.parse(data);
                            if (!addRoli) {resolve(trades)} else {
                                let rolidata = await this.getMarketValues();
                                rolidata = rolidata.items;
                                for (let trade of trades.data) {
                                    trades = await this.getTradebyId(trade.id,UserCookie,xtoken);
                                    for (let item of trades.offers[0].userAssets) { 
                                        item.roliName = rolidata[item.assetId][0];
                                        item.roliValue = rolidata[item.assetId][2];
                                    }
                                    for (let item of trades.offers[1].userAssets) { 
                                        item.roliName = rolidata[item.assetId][0];
                                        item.roliValue = rolidata[item.assetId][2];
                                    };
                                    console.log("Trade data for:",trade)
                                    console.dir(trades.offers[0].userAssets)
                                    console.dir(trades.offers[1].userAssets)
                                }
                                resolve(trades)
                            }
                        });
                    } else {reject("404")}
            }).on('error', (e) => {
                reject(e);
            });
        }).catch(e => handleError(e))
    },
    getUserId: async function(userName) {
        return new Promise(async (resolve,reject) =>{
            let options = {
                host: 'api.rprxy.xyz',
                path: `/users/get-by-username?username=${userName}`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'text/javascript; charset=UTF-8'
                }
            };
            https.get(options,async (res) => {
                const scode = res.statusCode;
                console.log("getUserId: HTTP RESPONSE: ",scode)
                if (scode != 404) {
                    let data = '';
                    res.on('data', c => data += c);
                    res.on('end', async () => {
                        let result = JSON.parse(data);
                        console.log("getUserId: DATA RESULT:")
                        console.dir(result)
                        resolve(result)
                    });
                } else {reject("404")}
            }).on('error', (e) => {
                reject(e);
            });
        }).catch(e => handleError(e))
    },
    getInventory: async function (userID) {
        return new Promise(async (resolve,reject) =>{
            let options = {
                host: 'inventory.rprxy.xyz',
                path: `/v2/users/${userID}/inventory?assetTypes=EmoteAnimation,PoseAnimation,WalkAnimation,SwimAnimation,RunAnimation,JumpAnimation,IdleAnimation,FallAnimation,DeathAnimation,ClimbAnimation,WaistAccessory,BackAccessory,FrontAccessory,ShoulderAccessory,NeckAccessory,FaceAccessory,HairAccessory,MeshPart,RightLeg,LeftLeg,LeftArm,RightArm,Torso,Animation,Gear,Face,Head,Decal,Pants,Shirt,Hat,Audio&limit=100`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'text/javascript; charset=UTF-8'
                }
            };
            https.get(options,async (res) => {
                const scode = res.statusCode;
                console.log("getInventory: HTTP RESPONSE: ",scode)
                if (scode != 404) {
                    let data = '';
                    res.on('data', c => data += c);
                    res.on('end', async () => {
                        let result = JSON.parse(data);
                        //console.log("getInventory: DATA RESULT:")
                        //console.dir(result)
                        resolve(result)
                    });
                } else {reject("404")}
            }).on('error', (e) => {
                reject(e);
            });
        }).catch(e => handleError(e))
    },
    getInventoryByAssetId: async function (userID,assetID) {
        return new Promise(async (resolve,reject) =>{
            let options = {
                host: 'inventory.rprxy.xyz',
                path: `/v2/users/${userID}/inventory/${assetTypeIds[assetID]}?limit=10`,
                method: 'GET',
                headers: {
                    'User-Agent': 'Mozilla/5.0',
                    'Content-Type': 'text/javascript; charset=UTF-8'
                }
            };
            https.get(options,async (res) => {
                const scode = res.statusCode;
                console.log("getInventoryByAssetId: HTTP RESPONSE: ",scode)
                if (scode != 404) {
                    let data = '';
                    res.on('data', c => data += c);
                    res.on('end', async () => {
                        let result = JSON.parse(data);
                        //console.log("getInventoryByAssetId: DATA RESULT:")
                        //console.dir(result)
                        resolve(result)
                    });
                } else {reject("404")}
            }).on('error', (e) => {
                reject(e);
            });
        }).catch(e => handleError(e))
    }
};

const myCookie = '_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_BDA423C2FFB55701B17F2753DB966506C4F8E3311A4EEA07675DDBF2E9D1D5E6AFE1ACABE012D9BD820673D3FF3616B2BAD42E7CCA9F4AB1BF73C76DFF40FFC20A7B4F1D188DC8C9368C0F2E60BACE7FA5FCE50B7A9CA1F929482413FC6AA0D36ABFC22124DCB948E6E29D40E55E72B7AAC3844F436ED220B8BC0F9BF7294BA4B1D721560C7953E27AE087BAC81C5E0A1BC5674C82C48B3DA249C9A325FE60B21C8F99DA552A23D3FE614B3B1D81D1B44F46449525D4ED3D16F3F4168C926C711DAE54DA9C1E3F9269ED837E31769283885A57F99F954435D0448EE461B0E12308EA8F54BF4CEBE249FB5B7E5D104296B09C96C85F0F649ACB30265F652B2D2C70CD6A3650D5D499FDE30BC30F0EF9DC7095D1D21DA9453A9FE903F70AFB6704A42078A6'
const test = async () => {
    //const result = await trade_controller.getTrades(myCookie,true)
    //const result = await trade_controller.sendTrade(50449192,372973026,[24826811],[398673908],[0,0],myCookie);
    const result = await trade_controller.getUserId("Forbrad");
    const userID = result.Id;
    if (userID) {
        const inventory = await trade_controller.getInventory(userID,'Hat');

        console.log("Test result: ");
        //console.dir(inventory);
    } else {
        console.log("Test: Result does not contain ID!")
    }
};
//test();
module.exports = trade_controller;