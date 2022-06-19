//Controlador Users - Independiente de con que DB esté hecho
const Gasto = require("../models/gasto");  // este es el que impacta y conoce la DB
const TipoGasto = require("../models/tipoGasto");
const User = require("../models/user");

const createGasto = async (req, res, next) => {
    const nomGasto = req.body.nomGasto;
    const importe = req.body.importe;
    const fechaGasto = req.body.fechaGasto;
    const idTipoGasto = req.body.idTipoGasto;
    const idUser = req.body.UserId;

    if (!nomGastoIsValid(nomGasto)) {
        res.statusCode = 400;
        res.send("nomGasto can not be empty.");
        return;
    }
    if (!importeIsValid(importe)) {
        res.statusCode = 400;
        res.send("The importe can not be empty.");
        return;
    }
    if (await IdTipoGastoNotValid(idTipoGasto)) {
        res.statusCode = 400;
        res.send("The Id. Tipo Gasto is not valid.");
        return;
    }
    if (! await IdUserIsValid(idUser)) {
        res.statusCode = 400;
        res.send("The userId is not valid.");
        return;
    }
    if (await Gasto.GastoAlreadyExist( nomGasto,
                importe, fechaGasto, idTipoGasto, idUser)) {
        res.statusCode = 402;
        res.send("Este Gasto ya fue cargado.");
        return;
    }
    //otras validaciones
    // valida que idTipoGasto exista
    //..

   // falta otras validarciones
    // Creo la entidad
    let newGasto = new Gasto(
        req.body.nomGasto,
        req.body.importe,
        req.body.fechaGasto, 
        req.body.idTipoGasto,
        req.body.UserId,
    );
    console.log ("despues de new en cotroller ", newGasto)
    try {
        // Salvando la nueva entidad
        newGasto2 = await newGasto.save();
        res.statusCode = 200;
        res.send(newGasto2);
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