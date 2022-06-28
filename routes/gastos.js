const express = require("express");
const gastosController = require("../controllers/gastos");
const router = express.Router();
const auth = require("../middlewares/authorization")

// Establecido por defecto x el app.js:  
//  const usersRouter = require("./routes/gastos") 
//  app.use("/api/gastos", gastosRouter);

//--> /api/gastos  --> da de alta el gasto previo chequeo Permisos
//           ADMIN --> puede cargar todo   Token.User --> solo los suyos
//           Sin Token --> rechazado
router.post("/", auth.authorizationForAllUser, gastosController.createGasto);

//  app.use("/api/gastos", gastosRouter);
//      -->  /api/gastos
router.get("/", auth.authorizationForAllUser, gastosController.getAllGastos);


// otras rutas ..



module.exports = router;