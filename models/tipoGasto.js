const prisma = require("../utils/client");

const { v4: uuidv4 } = require("uuid");

class TipoGasto {
    constructor(nomTipoGasto, id) {
      this.id = id ? id : uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
      this.nomTipoGasto = nomTipoGasto;
    }

  //Acá va el Alta en la DB
  async save() {
    try {
        console.log (this.id + ", " +  this.nomTipoGasto + ".")
        await prisma.TipoGasto.create({
            data: {
                nomTipoGasto: this.nomTipoGasto,
            },
        });
        console.log (this)
        return this; //devuelvo la instancia de TipoGasto que se construyó
    } catch (err){
        return "Error e models/tipoGastojs" + err;
    }
  }

  static async findById(id) {
    console.log("==> findById --> ", id)
    try {
      // console.log("el mail recibido en findByEmail", email)
      const tipoGastoFinded = await prisma.TipoGasto.findUnique({
        where: {
          id: parseInt(id,10),
        },
      })
      // console.log("el userfinded:" ,userfinded)
      return tipoGastoFinded;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }   
  }

  static async getAllTiposGasto() {
    try {
        const allTiposGasto = await prisma.TipoGasto.findMany()
        return allTiposGasto
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }   
    }

    static async uptadeById (id, nomTipoGasto) {
        try {
          const updatedTipoGasto = await prisma.TipoGasto.update({
            where: {
              id: parseInt(id,10),
            },
            data: {
              nomTipoGasto: nomTipoGasto, 
            },
          })
          // console.log (updatedUser)
          return updatedTipoGasto
      
        } catch (error) {
          console.log(error);
          throw new Error(error);
        }   
      }

}


module.exports = TipoGasto;