//Controlador Users - Independiente de con que DB esté hecho
const Gasto = require("../models/gasto");  // este es el que impacta y conoce la DB
const TipoGasto = require("../models/tipoGasto");
const User = require("../models/user");

const createGasto = async (req, res, next) => {
//Si es rol ADMIN se espera un Body:
// {
//     "nomGasto": "Dif Cable e Internet",
//     "importe": 10,
//     "fechaGasto": "05/13/2022",
//     "idTipoGasto": 1,
//     "UserId": 1 o cualquiera valido
// }
//Si es rol USER se espera un Body:
// {
//     "nomGasto": "Dif Cable e Internet",
//     "importe": 10,
//     "fechaGasto": "05/13/2022",
//     "idTipoGasto": 1,
// }

    // const nomGasto = req.body.nomGasto;
    // const importe = req.body.importe;
    // const fechaGasto = req.body.fechaGasto;
    // const idTipoGasto = req.body.idTipoGasto;
    // const idUser = req.body.UserId;

    // Definiciones
    let IdUsuarioGasto = 0;  // es el IdUsuario que se le imputará el gastos
    const gastoBody = req.body;
    //Validaciones comunes a ADMIN y USER role
    const msgValidComunes = await MessageNotPassValidationCommonNewGasto(gastoBody)
    console.log ("mensaje devuelvo x validation de Gastos comun all roles:",  msgValidComunes)
    if (msgValidComunes) {
        res.status(400).json({ message: msgValidComunes})
        return
    }

    console.log("Entrando al CreateGasto, ya paso validaciones, por aca va el req.body", gastoBody, "y el req.user: ", req.user )
    //Validaciones si es ADMIN role: 
    if (req.user.role === "ADMIN") {
        //-> que el usuairo exista y que fuera mandado
        if (! await IdUserIsValid(gastoBody.UserId)) {
            res.status(400).json({ message: "The userId is not valid."})
            return;
        }
        IdUsuarioGasto = req.body.UserId //para que meterlo en el Alta: lo tomo del body
    }
     //Validaciones si es USER role: 
    if (req.user.role === "USER") {
        // si hay UserId en el body --> lo rechazo
        if (gastoBody.UserId && gastoBody.UserId !== req.user.userId) {
            res.status(400).json({ message: "'USER' role can't insert Gastos to other User, only ADMIN role can do it. 'UserId' musn't be given in this case."})
            return;
        }
        IdUsuarioGasto = req.user.userId  //Previamente cargado durante middleware de Autorizacion, se cargo el objeto req.user  con el userId del token (el idUser de PostgreSQL)
    }
    // Si llego acá viene bien --> a punto de hacer el insert del gasto
    // Validación final: veo si el gasto ya fue cardo y esta duplicado (erro comun) 
    if (await Gasto.GastoAlreadyExist( gastoBody.nomGasto,
        gastoBody.importe, gastoBody.fechaGasto, gastoBody.idTipoGasto, IdUsuarioGasto)) {
        res.status(402).json({ message: "Este Gasto ya fue cargado. No puedo haber 2 gastos totalmente iguales."})
        return;
    }
    //Fin Validaciones Previas ---------------------------------------

    //Doy de Alta Gasto -----------------------------
    // Creo la entidad
    let newGasto = new Gasto(
        req.body.nomGasto,
        req.body.importe,
        req.body.fechaGasto, 
        req.body.idTipoGasto,
        IdUsuarioGasto, //el que corresponde segun autorizacion y o token
    );
    console.log ("despues de new objeto Gasto ", newGasto)
    try {
        // Salvando la nueva entidad
        newGasto2 = await newGasto.save();
        res.status(200).json({ "Alta Gasto Exitosa" : newGasto2 })

      } catch (err) {
        res.statusCode = 500;
        res.send(err);
      }

};


const getAllGastos = async (req, res, next) => {
    const gastos = await Gasto.getAllGastos();
    // console.log("Response user", users);
    res.send(gastos)
}

// Validaciones ----------------------------------------

const MessageNotPassValidationCommonNewGasto = async (gastoBody) => {
    if (!nomGastoIsValid(gastoBody.nomGasto)) {
        return "Nombre Gasto can't be empty."
    }
    if (!importeIsValid(gastoBody.importe)) {
        return "The importe can not be empty.";
    }
    if (await IdTipoGastoNotValid(gastoBody.idTipoGasto)) {
        return "The Id. Tipo Gasto is not valid.";
    }
}


const idTipoGastoExists = async (id) => {
    const tipoGastoById = await TipoGasto.findById(id);
    console.log ("Encontrado  tipo gasto", tipoGastoById)
    if (tipoGastoById) {
        console.log ("Sale por true")
        return true
    }else {
        console.log ("Sale por false")
        return false
    } 
}
const userAlreadyExists = async (idUser) => {
    const userFinded = await User.findByIdUser(idUser);
    console.log("user encontrado idUser:", userFinded)
    if (userFinded) {
        console.log("Sale x encontrado idUser: true")
        return true
    }else {
        console.log("Sale x encontrado idUser: false")
        return false
    }
};

const nomGastoIsValid = (nomGasto) => {
    return nomGasto !== "";
};
const importeIsValid = (importe) => {
    return( importe && importe>0)
}
const IdTipoGastoNotValid = async (idTipoGasto) => {
    const lbExisteTipoGasto = await idTipoGastoExists(idTipoGasto)
    console.log ("Saleeeee por ----> " + ( !idTipoGasto || !lbExisteTipoGasto) )
    // console.log ("lbExisteTipoGasto: __>" + ( lbExisteTipoGasto) )
    return( !idTipoGasto || !lbExisteTipoGasto )
}
const IdUserIsValid = async (idUser) => {
    return( idUser && (await userAlreadyExists(idUser)))
}


module.exports = {
    createGasto,
    getAllGastos,
}