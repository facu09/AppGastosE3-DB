const express = require("express");
const bodyParser= require("body-parser");

const usersRouter = require("./routes/users")
const tiposGastosRouter = require("./routes/tiposGastos");
const gastosRouter = require("./routes/gastos");
const consultasRouter = require("./routes/consultas");

// const PORT = 3000;
// Para q funque en Heroku
const PORT = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

//ataja todas las rutas que arranquen con "api/user" --> y las tira al /routes/users.js
app.use("/api/users", usersRouter);

//ataja todas las rutas que arranquen con "api/tiposGasto" --> y las tira al /routes/tiposGastos.js
app.use("/api/tiposGastos", tiposGastosRouter);

//ataja todas las rutas que arranquen con "api/gastos" --> y las tira al /routes/gastos.js
app.use("/api/gastos", gastosRouter);

//ataja todas las rutas que arranquen con "api/consultas" --> y las tira al /routes/consultas.js
app.use("/api/consultas", consultasRouter);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT} Bro`);
})





