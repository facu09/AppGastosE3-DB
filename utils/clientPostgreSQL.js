const { Pool } = require("pg")

// Coloca aquí tus credenciales
const pool = new Pool({
  user: "fksktchzqupvzs",
  host: "ec2-34-225-159-178.compute-1.amazonaws.com",
  database: "d2ue8gqnl4shsj",
  password: "c8dd659fcb7647d5a8d542e9cb7faab1272db98396b82305d9453388d49c444c",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});


module.exports = pool;