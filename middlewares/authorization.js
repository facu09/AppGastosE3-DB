const jwt = require("jsonwebtoken");

//midleware Authorization
const authorizationForAdmin = async ( req, res, next) => {
    // me fijo si se autoriza o no
    console.log (req.headers.authorization)
    if (!req.headers.authorization) {
        res.send(401, "User not authenticated, must provide a token")
    }
    const token = req.headers.authorization.split(" ")[1]
    console.log (token)
    try{
    
        //ahora valido el token
        const data = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
        console.log("token recuperado en verify", data)
        if (data.role !== "ADMIN") {
            res.status(403).json({ message: "Not authorized: must be 'ADMIN'" });
            return;
        }
        // si es ADMIN
        // agrego al req. un objeto user para que quede y pueda filtrar en la consulta
        req.user = {
            id: data.id,
            email: data.email,
            role: data.role,
        };
        console.log("Pasó la autorizacion for Admin: ==> el token es de ADMIN User role")
        return next() // autoriza

    } catch (error) {
        res.status(403).json({ message: "Error while validation token", error: error });
        return;
    }
};

module.exports = { authorizationForAdmin };