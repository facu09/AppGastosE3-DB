const prisma = require("../utils/clientPrismaPosgre");
const pool = require("../utils/clientPostgreSQL")
const User = require("../models/user");


const { v4: uuidv4 } = require("uuid");
const req = require("express/lib/request");
const { user } = require("../utils/clientPrismaPosgre");

const getAllGastos = async (userToken, psEmail) => {
//Def: 
//Aca puede ser el ADMIN o un USER
//Si es role ADMIN: -> Tree todos los gastos de todos lo usars.
//Si es role USER: -> Trae solo los gastos de ese usuario.
//--------------------------------------------------------------------
    try {
        //antes -->  con prisma --> andando ok PERO sin filtro por mail
        // const allGastos = await prisma.Gastos.findMany()
        // return allGastos
        //con SQL DIRECTO  FALTA VER COMO SE ARMA LA CONEXION
        // const resultados = await pool.query('SELECT * FROM Public."Gastos" as G ');
        // const resultados = await pool.query('SELECT Public."Gastos".id FROM Public."Gastos" ');
        // const resultados = await pool.query('SELECT GT.id,  GT.*  FROM Public."Gastos" as GT ');
        
        if (userToken.role === "ADMIN" && psEmail) {
            //Traigo los gastos del usuarrio de psEmail
            lsWhere = '';
            console.log("Del getAllGastos", psEmail);

            console.log("Del getAllGastos. if --> ", psEmail)
            lsWhere = ' WHERE U."email" = ' + "'" + psEmail + "'" 
            
            const resultados = await pool.query('SELECT ' + 
                    ' GT."id", U."email", GT."importe",  GT."tipoGastoId", ' +
                    ' Tipo."nomTipoGasto",  ' + 
                    ' GT."fechaGasto", GT."userId" ' + 
                ' FROM "Gastos" AS GT ' + 
                ' JOIN "User" AS  U ON GT."userId" = U."id" ' +
                ' JOIN "TipoGasto" AS Tipo ON GT."tipoGastoId" = Tipo."id" ' +
                lsWhere + 
                ' ORDER BY gt."fechaGasto" ' );
            // console.log( resultados.rows);
            return resultados.rows
        }
        if (userToken.role === "ADMIN" && !psEmail) {
            //Traigo todos los gatos por prisma
            //-->  con prisma --> andando ok PERO sin filtro por mail
            const allGastos = await prisma.Gastos.findMany()
            return allGastos
        }
        if (userToken.role === "USER") {
            const allGastosUser = await prisma.Gastos.findMany({
                where: { 
                    userId: userToken.userId,  // el userIdBuscar = Undefinde -> trae todos
                },
            });
            return allGastosUser;  
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
}

const getAllGastosOrderAscByImpote = async (user) => {
    console.log("Entro a la model/consulta/getAllGastosOrderByImprote con email: ", user.email, "and role '", user.role, " and userId: ", user.userId  )
    
    // Ya no hace falta hacer esto xque meti en el token y de ahi al req.user el PostreSQL.User.id  :) cool water.
       // // voy a buscar el Id de Usuario segun el mail en la tabla Heroku.PostregSQL.User
       // userFound = await User.findByEmail(user.email)    
       // console.log ("Usuario encontrado por email", userFound)

    console.log("El PostgreSQL.User.Id que vieajo por Token hacie el req.user y llega a consunta el parametro user es: " + user.userId)
    
    //DUDA PARA SALVA para ver si esta ok por Prisma usar undefined para que traiga todos el where:
    if (user.role == "ADMIN") {
        userIdBuscar = undefined // para que busque todos gastos de todos los ID de usuario (es decir de todos los users)
    } else {
        // si es role = "USER" => busca solo los de ese User del mail del token.
        userIdBuscar = user.userId
    }

    try {
        const allGastos = await prisma.Gastos.findMany({
            where: { 
                userId: userIdBuscar,  // el userIdBuscar = Undefinde -> trae todos
            },
            orderBy: {
                importe: "asc"
            }
        })
        return allGastos
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
}

const getAllGastosOrderAscByFecha= async (user) => {
    //DUDA PARA SALVA para ver si esta ok por Prisma usar undefined para que traiga todos el where:
    if (user.role == "ADMIN") {
        userIdBuscar = undefined // para que busque todos gastos de todos los ID de usuario (es decir de todos los users)
    } else {
        // si es role = "USER" => busca solo los de ese User del mail del token.
        userIdBuscar = user.userId
    }
    try {
        const allGastos = await prisma.Gastos.findMany({
            where: { 
                userId: userIdBuscar,  // el userIdBuscar = Undefinde -> trae todos
            },
            orderBy: {
                fechaGasto: "asc"
              }
        })
        return allGastos
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
}

const getPromedioDeAllGastos = async (user) => {
    //DUDA PARA SALVA para ver si esta ok por Prisma usar undefined para que traiga todos el where:
    if (user.role == "ADMIN") {
        userIdBuscar = undefined // para que busque todos gastos de todos los ID de usuario (es decir de todos los users)
        lsMsgReturn = "Promedio de Gasto de todos los Usuario en el Periodo: "
    } else {
        // si es role = "USER" => busca solo los de ese User del mail del token.
        userIdBuscar = user.userId
        lsMsgReturn = "Promedio de Gasto del usuario '" + user.email + "' en el periodo: " 
    }
    try {
        const aggregations = await prisma.Gastos.aggregate({
            _avg: {
              importe: true,
            },
            where: { 
                userId: userIdBuscar,  // el userIdBuscar = Undefinde -> trae todos
            },
        })
        lsTotConFormato = Intl.NumberFormat('en-EN', { style: 'currency', currency: 'ARG' }).format(aggregations._avg.importe)
        lsMsgReturn = lsMsgReturn + lsTotConFormato
        console.log(lsMsgReturn)
        // return { "Promedio de Gastos " : lsTotConFormato}
        return { "El Promedio del Periodo s/ usuario Token o Todos (ADMIN)" : lsTotConFormato }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
}

const getSumaDeAllGastos = async (user) => {
    //DUDA PARA SALVA para ver si esta ok por Prisma usar undefined para que traiga todos el where:
    if (user.role == "ADMIN") {
        userIdBuscar = undefined // para que busque todos gastos de todos los ID de usuario (es decir de todos los users)
    } else {
        // si es role = "USER" => busca solo los de ese User del mail del token.
        userIdBuscar = user.userId
    }

    try {
        const aggregations = await prisma.Gastos.aggregate({
            _sum: {
              importe: true,
            },
            where: { 
                userId: userIdBuscar,  // el userIdBuscar = Undefinde -> trae todos
            },
        })
        console.log('Suma de Gastos: ' + aggregations._sum.importe)
        // const liSumTotGastos= parseInt(aggregations._sum.importe);
        lsTotConFormato = Intl.NumberFormat('en-EN', { style: 'currency', currency: 'ARG' }).format(aggregations._sum.importe)
        console.log('Suma de Gastos: ' + lsTotConFormato)
        return {"La Sumar Total de Gastos del período s/ usuario Token o Todos (ADMIN) es de: ":    lsTotConFormato}
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
}

const getSumaDeGastosPorUsuario = async (user) => {
    //DUDA PARA SALVA para ver si esta ok por Prisma usar undefined para que traiga todos el where:
    if (user.role == "ADMIN") {
        userIdBuscar = undefined // para que busque todos gastos de todos los ID de usuario (es decir de todos los users)
    } else {
        // si es role = "USER" => busca solo los de ese User del mail del token.
        userIdBuscar = user.userId
    }
    try {
        const fd = await prisma.Gastos.groupBy({
            by: ['userId'],
            _sum: {
              importe: true,
            },
            where: { 
                userId: userIdBuscar,  // el userIdBuscar = Undefinde -> trae todos
            },
        })
        console.log(fd)
        return {"Suma de Gastos del Período por Usuario s/Token o todos para ADMIN es: ": fd  }

    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
}

const getSumaDeGastosPorTipoGasto = async (user) => {
     //DUDA PARA SALVA para ver si esta ok por Prisma usar undefined para que traiga todos el where:
     if (user.role == "ADMIN") {
        userIdBuscar = undefined // para que busque todos gastos de todos los ID de usuario (es decir de todos los users)
    } else {
        // si es role = "USER" => busca solo los de ese User del mail del token.
        userIdBuscar = user.userId
    }

    try {
        const fd = await prisma.Gastos.groupBy({
            by: ['tipoGastoId'],
            _sum: {
              importe: true,
            },
            where: { 
                userId: userIdBuscar,  // el userIdBuscar = Undefinde -> trae todos
            },
        })
        console.log(fd)
        return {"Suma de Gastos del Período por Tipo de Gasto del Usuario del Token o de todos los Usuarios para role ADMIN: ": fd  }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
}

const getSumaDeGastosPorTipoGastoSql = async (user) => {
     if (user.role == "ADMIN") {
        lsWhere = ""
        userIdBuscar = undefined // para que busque todos gastos de todos los ID de usuario (es decir de todos los users)
    } else {
        // si es role = "USER" => busca solo los de ese User del mail del token.
        lsWhere = ' WHERE U."email" = ' + "'" + psEmail + "'" 
        lsWhere = ' AND G."userId" = ' + user.userId + " "
        userIdBuscar = user.userId
    }
    
    try {
        //FALTA HACER CON LOGICA DE TOKEN Y ADMIN       


        //Finalmente tiro sql necesario
        const resultados = await pool.query(
            'SELECT max(TG."id") AS IdTipoGasto, max(TG."nomTipoGasto") AS TipoGasto, Sum(G."importe") AS SumOfimporte ' +
            'FROM Public."Gastos" AS G,  Public."TipoGasto" AS TG ' +
            'WHERE G."tipoGastoId" = TG."id" ' + lsWhere +
            'GROUP BY G."tipoGastoId", TG."id" ' +
            'ORDER BY TG."id" ')

         // console.log( resultados.rows);
        return resultados.rows
    
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
}


const getMayorDeAllGastos = async (user) => {
     //DUDA PARA SALVA para ver si esta ok por Prisma usar undefined para que traiga todos el where:
     if (user.role == "ADMIN") {
        userIdBuscar = undefined // para que busque todos gastos de todos los ID de usuario (es decir de todos los users)
    } else {
        // si es role = "USER" => busca solo los de ese User del mail del token.
        userIdBuscar = user.userId
    }

    try {
        const aggregations = await prisma.Gastos.aggregate({
            _max: {
              importe: true,
            },
            where: { 
                userId: userIdBuscar,  // el userIdBuscar = Undefinde -> trae todos
            },
        })

        lsTotConFormato = Intl.NumberFormat('en-EN', { style: 'currency', currency: 'ARG' }).format(aggregations._max.importe)
        console.log('El Mayor Gastos: ' + lsTotConFormato)
        return {"El Mayor de los Gastos del período s/ Usuario del Token o de todos los Usuarios para role 'ADMIN' es de: ": lsTotConFormato}
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
}

const getMenorDeAllGastos = async (user) => {
     //DUDA PARA SALVA para ver si esta ok por Prisma usar undefined para que traiga todos el where:
     if (user.role == "ADMIN") {
        userIdBuscar = undefined // para que busque todos gastos de todos los ID de usuario (es decir de todos los users)
    } else {
        // si es role = "USER" => busca solo los de ese User del mail del token.
        userIdBuscar = user.userId
    }

    try {
        const aggregations = await prisma.Gastos.aggregate({
            _min: {
              importe: true,
            },
            where: { 
                userId: userIdBuscar,  // el userIdBuscar = Undefinde -> trae todos
            },
           
        })
        lsTotConFormato = Intl.NumberFormat('en-EN', { style: 'currency', currency: 'ARG' }).format(aggregations._min.importe)
        console.log("El Menor de los Gastos del Período del Usuario del Token o de Todos los Usuario para role 'ADMIN': " + lsTotConFormato)
        return {"El Menor de los Gastos del período del Usuario del Token o de todos los Usuarios para el role 'ADMIN' es de: ": lsTotConFormato}
    } catch (error) {
        console.log(error);
        throw new Error(error);
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
    getSumaDeGastosPorTipoGastoSql,
    getMayorDeAllGastos,
    getMenorDeAllGastos,
}