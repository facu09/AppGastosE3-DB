const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");  // este es el que impacta y conoce la DB Horoku.PostgreSQL

const userMongo = require("../models/auth") // este es el que impacta y conoce la DB MongoDB en ATLAS.

// El registerUser de route es otra ruta para la creación de usuario de los usuario
//  publicos
//Armo el CRUD de Registro y Login de Usuarios 

//Es cuando el usuario se da de Alta
const registerUser = async (req, res, next) => {
    console.log("ARRANCA DE NUEVO ===========> ")
    // asum not insert into DB PostgreSQL and MongoDB
    let lbInsertOKinPostgre = false
    let lbInsertOKinMongo = false
    //"firstName": "Roberto Siete",
    //"lastName": "García",
    //"email": "robero8gmail.com",
    //"password": "pass12345"
    const userBody = req.body;

    try {
        //Validation of fields of Post
        const messageValid = await MessageNotPassValidation(userBody)
        console.log ("mensaje devuelvo x validation:",  messageValid)
        if (messageValid) {
            res.status(400).json({ message: messageValid})
            return
        }

        // Si llego acá: --> Hashe Password y Guardo ---------
        const hash = await bcrypt.hash(userBody.password, 10);
        
        //1º Guardo en Prisma Heroku PostgreSQL (Redundancy Model) ----
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
            console.log ("Si llego acá:--> grabo bien en DB.Heroku.PostgreSQL")
            lbInsertOKinPostgre = true
        } catch (error) {
            console.log("entro al Catch del Controllers.auth.registerUser().InsertPostgreSQL")
            // res.statusCode = 500;
            // res.send(err);
            res.status(500).json({ message: error.message + ". Error en Insert de Heroku.PostgreSQL --> aborta Inserts" });
            return;
        }
        //Fin 1ºGuardo en Prisma Heroku PostgreSQL -------

        //2º Guardo en MongoDB Entidad Login Principal 
        newUser = {
            firstName: userBody.firstName,
            lastName: userBody.lastName,
            email: userBody.email,
            password: hash,
            role: "USER",
        };
        // creo el usuario en las 2 bases
        await userMongo.createUser(newUser);
        res.json("Created user OK en Heroku.PostgreSQL and in Atlas.MongoDB. User email:" + userBody.email + "." )

        console.log("Si llegó acá: -->  Grabó bien en las 2 DB")
        lbInsertOKinMongo = true

    } catch (error) {
        console.log("entro al Catch del Controllers.auth.registerUser.DelInsertDelMongo()")
        res.status(500).json({ message: error.message + ". Proced with RollBack LAST INSERT into Heroku.PostgreSQL.User" });
        //Si se insertó bien en Heroku y no en Atlas
        // console.log("despues del msj erro de que no mongueó" +  lbInsertOKinPostgre + " " + lbInsertOKinMongo )
        if (lbInsertOKinPostgre && !lbInsertOKinMongo) {
            //Borro en Heroku.PostgreSQL
            console.log("Entro al ifff eseeee")
            User.deleteByEmail(userBody.email)
            console.log("RollBackeo y Borro el usuario de Heroku.PostgreSQL.Users")
        }
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
const thereIsFirstName = (firstName) => {
    return firstName;
};
const thereIsEmail = (email) => {
    return email;
};
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


const MessageNotPassValidation = async (userBody) => {
    //return Message of Error of validacion
    //If pass validation --> return null 
    
    //Assum there isn't Error Validatins Message
    MakeMessageNotPassValidation = null
    
    if (!userBody.firstName) {
        return "First Name can't be empty."
    };
    if (!userBody.lastName) {
        return "Last Name can't be empty.";
    };
    if (!userBody.email) {
        return "Email can't be empty.";
    };
    if (!thereIsPassword(userBody.password)) {
        return "Password can't be empty.";
    };
    if (!validLengthPassword(userBody.password)) {
        return "Password must have at least 8 caracters."
        ;
    };
    if  (await searchUserByEmail(userBody.email)) {
        console.log ("Email repido cheeeee")
        return "Email already exist.";
    };
};

// Fin Validaciones ----------------------------------------


//EXPORTO EL CRUD (Create, Read, Update, Delete )
module.exports = {
    registerUser,
    loginUser,
    logoutUser,
};

