const express = require("express");
const gastosController = require("../controllers/gastos");
const router = express.Router();

// Establecido por defecto x el app.js:  
//  const usersRouter = require("./routes/gastos") 
//  app.use("/api/gastos", gastosRouter);
//--> /api/gastos
router.post("/", gastosController.createGasto);

//  app.use("/api/gastos", gastosRouter);
//      -->  /api/gastos
router.get("/", gastosController.getAllGastos);


// otras rutas ..



module.exports = router;