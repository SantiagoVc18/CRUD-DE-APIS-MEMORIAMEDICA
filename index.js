// Descripción: Este archivo contiene la configuración del servidor Express y las rutas para manejar las solicitudes HTTP.
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const db = require('./backend/persistencia/db.js');
const pool = require('./backend/persistencia/db.js');

// Configuración de CORS
app.use(cors());

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//RUTAS de la carpeta ROUTES
const apisRoutes = require("./routes/api.js");
const empleadoRoutes = require("./routes/empleado.js");
const medicamentosRoutes = require("./routes/medicamentos.js");

// Rutas API en la carpeta Controller
app.use("/api", apisRoutes);
app.use("/empleado", empleadoRoutes); 
app.use("/medicamentos", medicamentosRoutes);


// Configuración de archivos estáticos
app.use('/website', express.static(path.join(__dirname, '/views')));
app.use(express.static("views"));



/**
 * Redirige la solicitud raíz al archivo index.html dentro de la carpeta /website.
 * @name GET /
 * @function
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 */
app.get('/', (req, res) => {
    res.redirect('/website/index.html');
});

app.use(express.static(path.join(__dirname, "views")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/** 
* Middleware para manejar rutas no encontradas.
* @name Middleware 404
* @function
* @param {Object} request - Objeto de solicitud HTTP.
* @param {Object} response - Objeto de respuesta HTTP.
*/
app.use((request, response) => {
    response.status(404);
    response.send(`<h1>Error 404: Resource not found</h1>`)
})


/**
 * Middleware para manejar errores internos del servidor.
 * @name Middleware Error
 * @function
 * @param {Object} err - Objeto de error.
 * @param {Object} req - Objeto de solicitud HTTP.
 * @param {Object} res - Objeto de respuesta HTTP.
 * @param {Function} next - Función para pasar al siguiente middleware.
 */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});