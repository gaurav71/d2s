const router        = require("express").Router();
const checkAuth     = require("../middleware/checkAuth");
const MongoClient   = require("mongodb").MongoClient;
const ObjectId      = require('mongodb').ObjectID;
const config        = require("../config/config");

//ROUTE : "/api/dashboard/"
router.get("/", checkAuth, (req,res) => {
    res.json({"success" : "dashboard"})
})

module.exports = router;