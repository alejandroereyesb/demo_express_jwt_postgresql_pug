const express = require('express');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const errorHandler = require('./middlewares/errorHandler'); // Importar el middleware
const passport = require('passport');
require('./auth/googleAuth'); // Importar configuración de Google Auth
const session = require('express-session');

dotenv.config();

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true })); // Asegúrate de que esto esté presente
app.use(express.json());
app.use(cookieParser());

// Middleware de sesión y Passport
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Configuración de vistas
app.set('view engine', 'pug');
app.set('views', './views');

// Rutas
app.use(authRoutes);

// Middleware de manejo de errores
app.use(errorHandler); // Usar el middleware al final

// Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
