
module.exports = (req,res,next) => {
    const {email, password} = req.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!email || !password)
        return res.status(400).json({error : "bad request"});
    if(emailRegex.test(email)==false || password.length<8)
        return res.status(400).json({error : "bad request"});
    next();
}