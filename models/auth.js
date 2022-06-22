/// Maneja todo en MongoDB tanto Registro como Autienticación
/// En caso de que esté caido Mongo, autenticará en Heroku PostgreSQL

const getDb = require("../utils/clientMongo").getDb

const USERS_COLLECTION = "Users";

const createUser = async (newUser) => {
  try {
    const db = getDb();
    await db.collection(USERS_COLLECTION).insertOne(newUser);
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

const findUserByEmail = async (email) => {
    try {
      const db = getDb();
      const result = await db
        .collection(USERS_COLLECTION)
        .findOne({ email: email });
      return result;
    } catch (error) {
      throw new Error(error);
    }
  };
  
  module.exports = { createUser, findUserByEmail };