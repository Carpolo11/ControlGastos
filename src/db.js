const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'grcIA',
  password: '123456',
  port: 5432, 
});


// ********** Bloque para probar la conexión **********
pool.connect()
  .then(client => {
    console.log('✅ Conexión exitosa a PostgreSQL');
    client.release(); // Liberar el cliente después de la prueba
  })
  .catch(err => {
    console.error('❌ Error de conexión a PostgreSQL:', err.message);
  });
// *************************************************

module.exports = {
  query: (text, params) => pool.query(text, params),
};

