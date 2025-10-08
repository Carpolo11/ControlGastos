const { Pool } = require('pg');
const pool = new Pool({
  user: 'carpolo',
  host: 'localhost',
  database: 'bd_Inventario',
  password: 'Car117849',
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


async function insertarUsuario(identificacion, nombre, email, password_hash) {
  try {
    const query = `
      INSERT INTO usuarios (identificacion, nombre, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING *;   -- Esto devuelve el registro insertado
    `;

    const values = [identificacion, nombre, email, password_hash];

    const result = await pool.query(query, values);
    console.log("✅ Usuario insertado:", result.rows[0]);
  } catch (err) {
    console.error("❌ Error al insertar usuario:", err.message);
  }
}

// Probar la inserción
insertarUsuario("1006198946","Carlos Alegría", "carlos@example.com", "1234hash");