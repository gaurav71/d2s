const passport          = require("passport");
const GoogleStrategy    = require("passport-google-oauth20");
const MongoClient       = require("mongodb").MongoClient;

const config            = require("../config/config");


passport.serializeUser((user,done) => {
    done(null , user);
})

passport.deserializeUser((user,done) => {
    done(null, user);
})


module.exports = passport.use(new GoogleStrategy({
    callbackURL: config.google_callbackUrl,
    clientID : config.google_clientId,
    clientSecret : config.google_clientSecret
}, (accessToken, refreshToken, profile, cb)=>{
    
    MongoClient.connect(config.db, (err, client) => {
        const db = client.db("main");
        db.collection("users").findOne({googleId : profile.id}, (err, doc) => {
            if(doc) return cb(null, doc);
            //db.collection("users").insertOne({name: profile.displayName, googleId:profile.id}, (err, doc) => {
            //    return cb(null, doc.ops[0]);
            //})
            return cb(null)
        })
    })
}));


