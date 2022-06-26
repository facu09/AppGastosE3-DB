const express = require("express");
const cnsController = require("../controllers/consultas");
const authorizationForAdmin = require("../middlewares/authorization").authorizationForAdmin;
const auth = require("../middlewares/authorization")
const router = express.Router();


// Establecido por defecto x el app.js:  
//  const usersRouter = require("./routes/gastos") 

//api/consultas
router.get("/allGastos", auth.authorizationForAllUser, cnsController.getAllGastos);

router.get("/allGastosOrderAscImporte", auth.authorizationForAllUser, cnsController.getAllGastosOrderAscByImpote);

router.get("/allGastosOrderAscFecha", auth.authorizationForAllUser, cnsController.getAllGastosOrderAscByFecha);

router.get("/promedioDeAllGastos", auth.authorizationForAllUser, cnsController.getPromedioDeAllGastos);

router.get("/sumaDeAllGastos", auth.authorizationForAllUser, cnsController.getSumaDeAllGastos);

router.get("/sumaDeGastosPorUsuario", auth.authorizationForAllUser, cnsController.getSumaDeGastosPorUsuario);

router.get("/sumaDeGastosPorTipoGasto", auth.authorizationForAllUser, cnsController.getSumaDeGastosPorTipoGasto);

router.get("/sumaDeGastosPorTipoGastoSql", auth.authorizationForAllUser,cnsController.sumaDeGastosPorTipoGastoSql
);

router.get("/mayorDeAllGastos", auth.authorizationForAllUser, cnsController.getMayorDeAllGastos);

router.get("/menorDeAllGastos", auth.authorizationForAllUser, cnsController.getMenorDeAllGastos);



// otras rutas ..


module.exports = router;