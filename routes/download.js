const router        = require("express").Router();
const checkAuth     = require("../middleware/checkAuth");
const MongoClient   = require("mongodb").MongoClient;
const ObjectId      = require('mongodb').ObjectID;
const config        = require("../config/config");
const wget          = require("node-wget");
var shell = require('shelljs');
//ROUTE : "/api/download/"
router.post("/", checkAuth, (req,res) => {
    console.log(req.body.url);
    const {url} = req.body;

    shell.echo('Sorry, this script requires git');
  shell.exit(1);
})

module.exports = router;