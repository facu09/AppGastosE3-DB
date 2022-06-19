//Controlador Users - Independiente de con que DB esté hecho
const TipoGasto = require("../models/tipoGasto");  // este es el que impacta y conoce la DB

const createTipoGasto = async (req, res, next) => {
    const nomTipoGasto = req.body.nomTipoGasto;

    if (!nomTipoGastoIsValid(nomTipoGasto)) {
        res.statusCode = 400;
        res.send("nomTipoGasto cannot be empty");
        return;
    }
    // falta otras validarciones
    console.log("paso por aca antes de crear newinstance")
   
   
    // Creo la entidad
    let newTipoGasto = new TipoGasto(
        req.body.nomTipoGasto
    );
    console.log("paso por aca despues de crear new instance")
    try {
        // Salvando la nueva entidad
        newTipoGasto2 = await newTipoGasto.save();
        res.send(newTipoGasto2);
      } catch (err) {
        res.statusCode = 500;
        res.send(err);
      }

};

const getAllTiposGasto = async (req, res, next) => {
    const tiposGasto  = await TipoGasto.getAllTiposGasto();
    // console.log("Response user", users);
    res.send(tiposGasto)
};

const updateById = async (req, res, next) => {
    
    const nomTipoGasto = req.body.nomTipoGasto;
    console.log("---> entro al updataById");
    console.log("id: " , req.params.id, ", nomTipoGasto: ", nomTipoGasto)

    if (req.params.id === "") {
        res.statusCode = 400;
        res.send("Id cannot be empty");
    }
    if (await idDosentExist(req.params.id)) { 
        res.statusCode = 400;
        res.send("Tipo de Gasto with this id dosen't exist.");
        return;
    };
    if (!nomTipoGastoIsValid(nomTipoGasto)) {
        res.statusCode = 400;
        res.send("Name cannot be empty");
        return;
    };

    const tipoGastoUpdated = await TipoGasto.uptadeById(req.params.id, nomTipoGasto );

    res.send(tipoGastoUpdated);  
}


// Validaciones

const idDosentExist = async (id) => {
    const tipoGastoById = await TipoGasto.findById(id);
    console.log ("Encontrado ", tipoGastoById)
    if (tipoGastoById) {
        return false
    }else {
        return true
    } 
}

const nomTipoGastoIsValid = (nomTipoGasto) => {
    return nomTipoGasto !== "";
};



module.exports = {
    createTipoGasto,
    getAllTiposGasto,
    updateById, 
};