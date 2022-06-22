//Controlador Users - Independiente de con que DB esté hecho
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const users = require("../models/user");  // este es el que impacta y conoce la DB

// El registerUser de route es otra ruta para la creación de usuario de los usuario
//  publicos
//Armo el CRUD de Registro y Login de Usuarios 

//Es cuando el usuario se da de Alta
const registerUser = async (req, res, next) => {
    try {
        const userBody = req.body;
        if (!validPassword(userBody.password)) {
            res.status(400).json({ message: "Invalid password."})
            return;
        }
        if (await searchUserByEmail(userBody.email)) {
            res.status(400).json({ message: "Email already exist."})
        }
        const hash = await bcrypt.hash(userBody.password, 10);
        newUser = {
            firstName: userBody.firstName,
            lastName: userBody.lastName,
            email: userBody.email,
            password: hash
        };
        // creo el usuario en las 2 bases
        await users.createUser(newUser);
        res.json("Created user OK")

    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    } 
}

const loginUser = async (req, res, next) => {
    //Authenticate

    // Una vez Autentidado: --> genero el Token y se lo doy como respuesta
    const accessToken = jwt.sign(
        {name:"fcigliuti@gmail.com", role: "admin"}, 
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: 900 })
    res.json({ accessToken: accessToken})
}

const logoutUser = async (req, res, next) => {
    //Logout: 
    //  habrá que matar el token y o el de refresh
   
}


//EXPORTO EL CRUD (Create, Read, Update, Delete )
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};

