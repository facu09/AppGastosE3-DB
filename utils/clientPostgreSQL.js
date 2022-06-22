const { Pool } = require("pg")

DATABASE_USER ="fksktchzqupvzs"
DATABASE_HOST ="ec2-34-225-159-178.compute-1.amazonaws.com"
DATABASE_NAME ="d2ue8gqnl4shsj"
DATABASE_PASS ="c8dd659fcb7647d5a8d542e9cb7faab1272db98396b82305d9453388d49c444c"


// Coloca aquí tus credenciales
const pool = new Pool({
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  password: process.env.DATABASE_PASS,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});


module.exports = pool;