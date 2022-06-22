const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");  // este es el que impacta y conoce la DB Horoku.PostgreSQL

const userMongo = require("../models/auth") // este es el que impacta y conoce la DB MongoDB en ATLAS.

// El registerUser de route es otra ruta para la creación de usuario de los usuario
//  publicos
//Armo el CRUD de Registro y Login de Usuarios 

//Es cuando el usuario se da de Alta
const registerUser = async (req, res, next) => {
    try {
        const userBody = req.body;
        if (!thereIsPassword(userBody.password)) {
            res.status(400).json({ message: "Password can't be empty."})
            return;
        }
        if (!validLengthPassword(userBody.password)) {
            res.status(400).json({ message: "Password must have at least 8 caracters."})
            return;
        }
        if (await searchUserByEmail(userBody.email)) {
            res.status(400).json({ message: "Email already exist."})
            return
        }

        // Si llego acá: --> Hashe Password y Guardo ---------
        const hash = await bcrypt.hash(userBody.password, 10);
        
        //1ºGuardo en Prisma Heroku PostgreSQL -------
        let newUser = new User(
            userBody.email,
            userBody.lastName + ", " + userBody.firstName,
            hash,
            "USER", 
        );
        try {
            // Salvando la nueva entidad
            newUser2 = await newUser.save();
            // res.send(newUser2);  // lo comento para que siga creando en Mongo
        } catch (err) {
            res.statusCode = 500;
            res.send(err);
        }
        //Fin 1ºGuardo en Prisma Heroku PostgreSQL -------

        //Guardo en MongoDB Entidad Login MultiPlataforma
        newUser = {
            firstName: userBody.firstName,
            lastName: userBody.lastName,
            email: userBody.email,
            password: hash
        };
        // creo el usuario en las 2 bases
        await userMongo.createUser(newUser);
        res.json("Created user OK en Heroku.PostgreSQL and in Atlas.MongoDB. User email:" + userBody.email + "." )

    } catch (error) {
        res.status(500).json({ message: error.message });
        return;
    } 
}

const loginUser = async (req, res, next) => {
    //Authenticate

    // FALTA MODIFICAR
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

// Validaciones --------------------------------------
const thereIsPassword = (password) => {
  return password;
};

const validLengthPassword = (password) => {
    console.log(password.length)
    return  !(password.length < 8) 
};

//Me fijo si existe en Prisma.Heroku.PostgreSQL
const searchUserByEmail = async (email) => {
    const user = await User.findByEmail(email);
    return user;
};


//EXPORTO EL CRUD (Create, Read, Update, Delete )
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};

