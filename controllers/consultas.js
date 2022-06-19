//Controlador Users - Independiente de con que DB esté hecho
const Cns = require("../models/consulta");  // este es el que impacta y conoce la DB
const User = require("../models/user"); // para buscar si existe el email para algunas consultas


const getAllGastos = async (req, res, next) => {
    console.log ("Del consultas.controllers: ", req.query.email)
    if (req.query.email) {
        if (await userDosentExist(req.query.email)) { 
            res.statusCode = 400;
            res.send("User with this eamil dosen't exist.");
            return;
        // Si el mail existe    
        } else {
            const gastosDelUs = await Cns.getAllGastos(req.query.email);
            res.send(gastosDelUs)
        }
    //sino tiene mail --> trae todos los gastos
    } else{
        const allGastos = await Cns.getAllGastos();
        res.send(allGastos)
    }
}
    
const getAllGastosOrderAscByImpote = async (req, res, next) => {
    const allGastosOrdered = await Cns.getAllGastosOrderAscByImpote();
   
    res.send(allGastosOrdered)
}
const getAllGastosOrderAscByFecha = async (req, res, next) => {
    const allGastosOrdered = await Cns.getAllGastosOrderAscByFecha();
   
    res.send(allGastosOrdered)
}
const getPromedioDeAllGastos = async (req, res, next) => {
    const PromedioOfAll = await Cns.getPromedioDeAllGastos();
    res.status(200).send(PromedioOfAll)
}
const getSumaDeAllGastos = async (req, res, next) => {
    const SumaGastos = await Cns.getSumaDeAllGastos();
    res.status(200).send(SumaGastos)
}
const getSumaDeGastosPorUsuario = async (req, res, next) => {
    const SumaGastosProUs = await Cns.getSumaDeGastosPorUsuario();
    res.status(200).send(SumaGastosProUs)
}
const getSumaDeGastosPorTipoGasto = async (req, res, next) => {
    const SumaGastosProT = await Cns.getSumaDeGastosPorTipoGasto();
    res.status(200).send(SumaGastosProT)
}
const sumaDeGastosPorTipoGastoSql = async (req, res, next) => {
    const SumaGastosProT = await Cns.getSumaDeGastosPorTipoGastoSql();
    res.status(200).send(SumaGastosProT)
}


const getMayorDeAllGastos = async (req, res, next) => {
    const mayorOfAll = await Cns.getMayorDeAllGastos();
    res.send(mayorOfAll)
}
const getMenorDeAllGastos = async (req, res, next) => {
    const menorOfAll = await Cns.getMenorDeAllGastos();
    res.send(menorOfAll)
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


// Validaciones
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


module.exports = {
    getAllGastos,
    getAllGastosOrderAscByImpote,
    getAllGastosOrderAscByFecha,
    getPromedioDeAllGastos,
    getSumaDeAllGastos,
    getSumaDeGastosPorUsuario,
    getSumaDeGastosPorTipoGasto,
    sumaDeGastosPorTipoGastoSql,
    getMayorDeAllGastos,
    getMenorDeAllGastos,
}