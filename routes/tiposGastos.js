const express = require("express");
const tiposGastosController = require("../controllers/tiposGastos");
const router = express.Router();

console.log("antes de entrar al route /api/tiposGastos")

// Establecido por defecto x el app.js:  
//  const usersRouter = require("./routes/tiposGastos") 
//   -->  /api/tiposGastos
router.post("/", tiposGastosController.createTipoGasto);
// Esto genera un alta en DB.PostgreSQL en entidad/Tabla TipoGasto

//   -->  /api/tiposGastos
router.get("/", tiposGastosController.getAllTiposGasto)

//  --> /api/tiposGastos/id/:id
router.put("/id/:id", tiposGastosController.updateById)

// otras rutas de tiposGastos ..



module.exports = router;