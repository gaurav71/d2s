module.exports = (req,res,next) => {
    if(req.session.userId){
        return next();
    }
    else{
        return res.status(400).json({"error":"bad request"});
    }
}