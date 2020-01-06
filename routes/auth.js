const router        = require("express").Router();
const MongoClient   = require("mongodb").MongoClient;
const bcrypt        = require("bcryptjs");

const validateEmailPassowrd = require("../middleware/validateEmailPassword");
const config                = require("../config/config");
const checkAuth             = require("../middleware/checkAuth");
const passport              = require("../middleware/passport-setup");

//ROUTE "/api/auth/register"
router.post("/register", validateEmailPassowrd, (req,res) => {
    MongoClient.connect(config.db, (err, client) => {
        if(err) return res.status(500).json({error : "server failed"});
        const db = client.db(config.dbName);
        const {email, password} = req.body;
        db.collection("users").findOne({email}, (err,doc) => {
            if(err) return res.status(500).json({error : "server failed"});
            if(doc) return res.json({"error":"email already exists"});
            bcrypt.genSalt(10, (err,salt) => {
                bcrypt.hash(password, salt, (err,hash) => {
                    db.collection("users").insertOne({email, hash}, (err, doc) => {
                        if(err) return res.status(500).json({error : "server failed"});

                        req.session.userId = doc.ops[0]._id;
                        req.session.save(err=>{});

                        res.json({"success" : "registered"});
                        client.close();
                    })
                })
            })
        })
    })
})


//ROUTE "/api/auth/login"
router.post("/login", validateEmailPassowrd, (req, res) => {
    MongoClient.connect(config.db, (err, client) => {
        if(err) return res.status(500).json({error : "server failed"});
        const db = client.db(config.dbName);
        const {email, password} = req.body;
        db.collection("users").findOne({email}, (err,doc) => {
            if(err) return res.status(500).json({error : "server failed"});
            if(!doc) return res.json({"error":"wrong email"});
            bcrypt.compare(password, doc.hash, (err, success) => {
                if(err) return res.status(500).json({error : "server failed"});
                if(!success) return res.json({"error":"wrong password"});
                
                req.session.userId = doc._id;
                req.session.save(err=>{});

                res.json({"success" : "authenticated"});
            })
            client.close();
        })
    })
})

//ROUTE "/api/auth/loginWithSession"
router.get("/loginWithSession", checkAuth, (req, res) => {
    res.json({"success" : "authenticated"});
})


//ROUTE "/api/auth/google"
router.get("/google", passport.authenticate("google", {scope: ['profile']}) )


//ROUTE "/api/auth/google/callback"
router.get("/google/callback", passport.authenticate("google", { failureRedirect: config.reactServer }), (req,res)=>{
        req.session.userId = req.user._id;
        req.session.save(err=>{})
        res.redirect(config.reactServer+"/dashboard");
})


//ROUTE "/api/auth/logout"
router.get("/logout", (req, res) => {
    req.session.destroy(err=>{});
    res.json({success:"logout"})
})


module.exports = router;