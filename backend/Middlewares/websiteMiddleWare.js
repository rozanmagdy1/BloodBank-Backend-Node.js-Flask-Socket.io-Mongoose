const jwt = require("jsonwebtoken");
const User = require("../Model/User");
async function WebsiteMiddleWare(req, res, next) {

    if(req.path == '/login' || req.path == '/signup'){
        next();
    }else {
        try {
            let token = req.headers["authorization"];
            //if not get token in requests
            if(!token){
                return res.status(401).json({message: "unauthorized"})
            }else{
                let decoded = jwt.verify(token, 'loginccqq');
                req.user = await User.findById(decoded.id);
                next();
            }
        }catch (e) {
            res.json({
                message : "invalid token"
            })
        }
    }
}
module.exports = {
    WebsiteMiddleWare
}