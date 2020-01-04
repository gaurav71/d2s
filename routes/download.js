const router        = require("express").Router();
const checkAuth     = require("../middleware/checkAuth");
const config        = require("../config/config");

var shell = require('shelljs');
//ROUTE : "/api/download/"
router.post("/", checkAuth, (req,res) => {
    console.log(req.body.url);
    const {url} = req.body;
    console.log(url);
})

module.exports = router;