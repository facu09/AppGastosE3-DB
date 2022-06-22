//Controlador Users - Independiente de con que DB esté hecho
const User = require("../models/user");  // este es el que impacta y conoce la DB

//Armo el CRUD de Usuarios (Create, Read, Update, Delete )

// Lo va a usar solo el role= "Admin" para crear usuario on demanda "AdHoc"
//    y sus gastos
const createUser = async (req, res, next) => {
    // console.log(req.body);
    // res.send(req.body) //esto tira json del json que venga en el body
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password
    const role = req.body.role;

    if (!emailIsValid(email)) {
        res.statusCode = 400;
        res.send("Email cannot be empty");
        return;
    }
    if (!nameIsValid(name)) {
        res.statusCode = 400;
        res.send("Name cannot be empty");
        return;
    };
    if (!passwordIsValid(password)) {
        res.statusCode = 400;
        res.send("Password cannot be empty")
        return
    }
    if (!roleIsValid(role)) {
        res.statusCode = 400;
        res.send("Role is not valid");
        return;
    };
    if (await userAlreadyExists(email)) { 
        res.statusCode = 400;
        res.send("User with this eamil already exists.");
        return;
    };

  
    // Si llego acá es que valido bien ==> Creo la entidad
    let newUser = new User(
        req.body.email,
        req.body.name,
        req.body.password,
        req.body.role, 
    );

    try {
        // Salvando la nueva entidad
        newUser2 = await newUser.save();
        res.send(newUser2);
      } catch (err) {
        res.statusCode = 500;
        res.send(err);
      }
};

const getAllUsers = async (req, res, next) => {
    const users = await User.getAllUsers();
    // console.log("Response user", users);
    res.send(users)
}

// /api/users/search?email=roberto5@gmail.com&name=Roberto
const findUserByEmail = async (req, res, next) => {
    // console.log("----> entrando a findUserByEmail")
    if (req.query.email === "") {
        res.statusCode = 400;
        res.send("Eamil cannot be empty")
    }
    if (await userDosentExist(req.query.email)) { 
        res.statusCode = 400;
        res.send("User with this eamil dosen't exist.");
        return;
    };
    
    // console.log("Email ingresado por req.query.email", req.query.email)
    // console.log("Name por req.query.name", req.query.name)

    const users = await User.findByEmail(req.query.email);
   
    console.log("Response user", users);
    res.send(users)
}

// ... su ruta fue:  "// /api/users/email/roberto5@gmail.com"
const updateByEmail = async (req, res, next) => {
    //PATH PARAM id es parte de la ruta lo puedo acceder como parte del req
    const name = req.body.name;
    const password = req.body.password
    const role = req.body.role;
    console.log("---> entro al updataByEmail");
    console.log("email: " , req.params.email, ", nombre: ", name, ", password; " , password, " , role: " , role)

    if (req.params.email === "") {
        res.statusCode = 400;
        res.send("Eamil cannot be empty");
    }
    if (await userDosentExist(req.params.email)) { 
        res.statusCode = 400;
        res.send("User with this eamil dosen't exist.");
        return;
    };
    if (!nameIsValid(name)) {
        res.statusCode = 400;
        res.send("Name cannot be empty");
        return;
    };
    if (!passwordIsValid(password)) {
        res.statusCode = 400;
        res.send("Password cannot be empty")
        return
    }
    if (!roleIsValid(role)) {
        res.statusCode = 400;
        res.send("Role is not valid");
        return;
    };

    const userUpdated = await User.uptadeByEmail(req.params.email, name, password, role );

    res.send(userUpdated);
}

const deleteByEmail = async(req, res, next) => {
    // console.log("--------> ", req.params.email )
    if (req.params.email === "") {
        res.statusCode = 400;
        res.send("Eamil cannot be empty");
        return;
    }
    //Sino existe el usuario
    if (await userDosentExist(req.params.email)) { 
        console.log("--> Entrando a buscar si existe el email a borrar")
        res.statusCode = 400;
        res.send("User with this eamil dosen't exist.");
        return;
    };
    const userDeleted = await User.deleteByEmail(req.params.email);
    res.send(userDeleted);  
}


//Validaciones -------------------------------------
const emailIsValid = (email) => {
    return email !== "";
};
const nameIsValid = (name) => {
    return name !==""; 
}
const passwordIsValid = (password) =>  {
    return password !== "";
}
const roleIsValid = (role) => {
    return ( role !== "" &&
            (role === "USER" || role === "ADMIN") )
};

const userAlreadyExists = async (email) => {
    const userByEmail = await User.findByEmail(email);
    // console.log("user encontrado:", userByEamil)
    if (userByEmail) {
        return true
    }else {
        return false
    }
};

const userDosentExist = async (email) => {
    console.log ("---> Entro al userDosentExist")
    const userByEmail = await User.findByEmail(email);
    console.log(userByEmail) ;
    if (userByEmail) {
        return false
    }else {
        return true
    } 
}

//EXPORTO EL CRUD (Create, Read, Update, Delete )
module.exports = {
    createUser,
    getAllUsers,
    findUserByEmail,
    updateByEmail,
    deleteByEmail,
};