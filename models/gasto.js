const prisma = require("../utils/client");

const { v4: uuidv4 } = require("uuid");

  //Se rompió el autoincremental del Id de Gastos (por metar registros desde odbc de MsAccess)
  //Obtener el Próximo id Gasto = Mayor + 1
  const getNextId_NewGastos = async () => {
    try {
        const aggregations = await prisma.Gastos.aggregate({
            _max: {
              id: true,
            },
        })
  
        console.log('El Mayor id de  Gastos: ', aggregations._max.id, " elproximo es: ", (aggregations._max.id + 1 ));
        return (aggregations._max.id + 1 );
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
  }

class Gasto {
  constructor  (nomGasto, importe, fechaGasto, idTipoGasto, idUser, id) {
   // this.id = id ? id : uuidv4(); // ⇨    '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    this.nomGasto = nomGasto;
    this.importe = importe;
    this.fechaGasto = fechaGasto ? fechaGasto : now();
    this.idTipoGasto = idTipoGasto; 
    this.idUser = idUser;   

    console.log ("Constructor IdGasto: ", this.id)
  }

  
  async save() {
    try {
      console.log ("Del Save: " + this.nomGasto + ", " + this.importe + ", " + this.fechaGasto + ", " + this.idUser );
    
      //busco ultimo id y le sumo 1
      const liProxId = await getNextId_NewGastos() 
      console.log("Proximo", liProxId)
     
      const newGsto =  await prisma.Gastos.create({
        data: {
          id: liProxId,
          nomGasto: this.nomGasto,
          importe: this.importe,
          fechaGasto: new Date(this.fechaGasto),
          tipoGastoId: this.idTipoGasto,
          userId: this.idUser,
        },
      });
      console.log ("Desp de guardar: ");
      console.log (newGsto)
      return newGsto;
    
    } catch (err) {
      console.log(err)
      return err;
    }
  }

  static async findByidTipoGasto(idTipoGasto) {
    try {
      // console.log("el mail recibido en findByEmail", email)
      const gastosfinded = await prisma.Gastos.findMany({
        where: {
          idTipoGasto: idTipoGasto,
        },
      })
      // console.log("el userfinded:" ,userfinded)
      return gastosfinded;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
  }

  static async GastoAlreadyExist (nomGasto,
    importe, fechaGasto, idTipoGasto, idUser) {
    console.log("nomgasto ==>", nomGasto, " id Us:", idUser )
    try {
      const gastosFinded = await prisma.Gastos.findMany({
        where: {
          nomGasto: nomGasto,
          importe: importe,
          fechaGasto: new Date(fechaGasto),
          tipoGastoId: idTipoGasto,
          userId: idUser,
        },
      })
      console.log("gastos finded ", gastosFinded.length, "; " ,gastosFinded )
      if (gastosFinded.length > 0) {
        console.log ("uuuuuuuu Sale por true hay")
        return true
      } else {
        console.log ("uuuuuuuu Sale por faseeeee no hay")
        return false
      }
      
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }   
  }

  static async getAllGastos (){
    try {
      const allGastos = await prisma.Gastos.findMany()
      return allGastos
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }   
  }



}//cirra el User Class

module.exports = Gasto;