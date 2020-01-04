const router        = require("express").Router();
const checkAuth     = require("../middleware/checkAuth");
const MongoClient   = require("mongodb").MongoClient;
const ObjectId      = require('mongodb').ObjectID;
const config        = require("../config/config");

//ROUTE : "/api/dashboard/"
router.get("/", checkAuth, (req,res) => {
    MongoClient.connect(config.db, (err, client) => {
        const db = client.db(config.dbName);
        db.collection("users").findOne({_id:new ObjectId(req.session.userId)}, (err, doc) => {
            res.json(doc);
        })
    })
})

module.exports = router;