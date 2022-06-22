const jwt = require("jsonwebtoken");
const { JsonWebTokenError } = require("jsonwebtoken"); //???

//midleware Authorization
const authorizationForAdmin = ( req, res, next) => {
    // me fijo si se autoriza o no
    console.log (req.headers.authorization)
    if (!req.headers.authorization) {
        res.send(401, "User not authenticated, must provide a token")
    }
    const token = req.headers.authorization.split(" ")[1]
    console.log (token)
    //ahora valido el token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, payload) => {
        if (err) {
            res.send(403, "Error while validation token")
        }
        console.log (JSON.stringify(payload));
        console.log ("El Role es:", payload.role);
        
        if (payload.role !== "admin") {
            res.send(403, "User is not authorized")
        }
        // si llega acá es porque hay token y es role "admin"
        next() // autoriza
    });

};

module.exports = { authorizationForAdmin };