# Sistema de Autenticación con Roles (Node.js, Express, PostgreSQL, JWT, Google)

Este proyecto es un sistema completo de autenticación que permite el registro, inicio de sesión y logout de usuarios, con soporte para roles (`user` y `admin`) y autenticación mediante Google OAuth. Implementa autenticación con JWT y cookies para mantener la sesión de los usuarios.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript en el lado del servidor.
- **Express.js**: Framework de Node.js para crear el servidor.
- **Pug**: Motor de plantillas para generar vistas HTML dinámicas.
- **PostgreSQL**: Base de datos relacional para almacenamiento de usuarios y roles.
- **Passport.js**: Middleware para la autenticación, incluyendo Google OAuth.
- **JWT (JSON Web Tokens)**: Para la autenticación segura de usuarios.
- **bcrypt.js**: Para encriptar las contraseñas de los usuarios.
- **cookie-parser**: Middleware para gestionar cookies en Express.

## Requisitos Previos

- [Node.js](https://nodejs.org/en/download/) (v12+)
- [PostgreSQL](https://www.postgresql.org/download/) (v12+)
- Crear una base de datos PostgreSQL para el proyecto y configurar las variables de entorno en el archivo `.env`.

## Sistema de Carpetas

El proyecto está organizado de la siguiente manera:

```
/config
  └── db.js                # Configuración de la conexión a la base de datos PostgreSQL

/controllers
  └── authController.js    # Controladores para manejar la lógica de autenticación

/middlewares
  ├── authMiddleware.js    # Middleware para verificar la autenticación del usuario
  ├── roleMiddleware.js    # Middleware para verificar roles de usuario
  └── errorHandler.js      # Middleware para manejar errores globalmente

/models
  ├── userModel.js         # Modelo para interactuar con la tabla de usuarios
  └── queries.js           # Consultas SQL reutilizables

/routes
  └── authRoutes.js        # Rutas relacionadas con la autenticación

/utils
  └── dbUtils.js           # Función genérica para ejecutar consultas SQL

/views
  ├── layout.pug           # Plantilla base para las vistas
  ├── login.pug            # Vista para el inicio de sesión
  ├── register.pug         # Vista para el registro de usuarios
  ├── userDashboard.pug    # Vista para el panel de usuario
  └── adminDashboard.pug   # Vista para el panel de administrador

.gitignore                 # Archivos y carpetas ignorados por Git
.env.example               # Ejemplo de configuración de variables de entorno
package.json               # Dependencias y scripts del proyecto
server.js                  # Archivo principal para iniciar el servidor
README.md                  # Documentación del proyecto
```

## Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la base de datos:

Crear la tabla `users` en PostgreSQL:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('admin', 'user'))
);
```

4. Crear un archivo `.env` en la raíz del proyecto y añadir las siguientes variables:

```bash
DB_USER=
DB_HOST=
DB_NAME=
DB_PASS=
DB_PORT=
JWT_SECRET=tu_secreto_para_jwt
PORT=3000
CLIENT_ID=tu_client_id
CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/google/callBack
```

5. Iniciar el servidor:
```bash
npm start
```

## Endpoints y Rutas

1. **Registro de Usuario**
   - URL: `/register`
   - Método: `POST`
   - Descripción: Crea un nuevo usuario. Por defecto, los usuarios registrados tienen el rol de `user`. Solo el administrador puede cambiar manualmente el rol a `admin`.

   Ejemplo de Payload:
   ```json
   {
     "username": "user123",
     "email": "user@example.com",
     "password": "mypassword"
   }
   ```

2. **Inicio de Sesión**
   - URL: `/login`
   - Método: `POST`
   - Descripción: Autentica al usuario, devuelve un JWT y establece una cookie de sesión.

   Ejemplo de Payload:
   ```json
   {
     "username": "user123",
     "password": "mypassword"
   }
   ```

3. **Inicio de Sesión con Google**
   - URL: `/auth/google`
   - Método: `GET`
   - Descripción: Redirige al usuario al prompt de Google para seleccionar una cuenta.

4. **Callback de Google**
   - URL: `/google/callBack`
   - Método: `GET`
   - Descripción: Maneja la respuesta de Google después de la autenticación. Busca o crea un usuario en la base de datos, genera un JWT y redirige al dashboard correspondiente según el rol del usuario.

5. **Logout**
   - URL: `/logout`
   - Método: `GET`
   - Descripción: Borra la cookie de sesión y cierra la sesión del usuario.

6. **Panel de Usuario**
   - URL: `/user/dashboard`
   - Método: `GET`
   - Autenticación: Necesaria (Rol: `user`)
   - Descripción: Muestra el panel principal para usuarios con el rol `user`.

7. **Panel de Administrador**
   - URL: `/admin/dashboard`
   - Método: `GET`
   - Autenticación: Necesaria (Rol: `admin`)
   - Descripción: Muestra el panel principal para usuarios con el rol `admin`.

## Flujo de Autenticación con Google

El sistema incluye autenticación con Google mediante Passport.js y la estrategia `passport-google-oauth20`. Esto permite a los usuarios iniciar sesión con sus cuentas de Google de manera segura y eficiente.

### ¿Cómo funciona?

1. **Inicio del flujo**:
   - Cuando un usuario accede a la ruta `/auth/google`, se inicia el flujo de autenticación con Google. Passport redirige al usuario al prompt de Google para seleccionar una cuenta.
   - En esta etapa, se especifican los `scopes` (en este caso, `email` y `profile`) para indicar qué información del usuario se solicita.

2. **Selección de cuenta**:
   - Google muestra un prompt donde el usuario puede seleccionar la cuenta con la que desea iniciar sesión. Esto se fuerza mediante el parámetro `prompt: 'select_account'`.

3. **Callback de Google**:
   - Una vez que el usuario selecciona una cuenta y otorga los permisos necesarios, Google redirige al sistema a la ruta `/google/callBack`.
   - En esta ruta, Passport maneja la respuesta de Google y ejecuta la lógica definida en la estrategia de Google (`auth/googleAuth.js`).

4. **Procesamiento del perfil del usuario**:
   - Passport recibe el perfil del usuario desde Google, que incluye información como el nombre (`displayName`) y el correo electrónico (`emails[0].value`).
   - El sistema verifica si el usuario ya existe en la base de datos:
     - Si el usuario existe, se genera un token JWT y se redirige al dashboard correspondiente según su rol.
     - Si el usuario no existe, se crea un nuevo registro en la base de datos con el rol predeterminado `user`, se genera un token JWT y se redirige al dashboard.

5. **Redirección al dashboard**:
   - Dependiendo del rol del usuario (`admin` o `user`), el sistema redirige al dashboard correspondiente (`/admin/dashboard` o `/user/dashboard`).

### Configuración de Google OAuth

1. **Credenciales de Google**:
   - Ve a la [Google Cloud Console](https://console.cloud.google.com/).
   - Crea un proyecto y configura una pantalla de consentimiento OAuth.
   - Genera un ID de cliente OAuth y un secreto de cliente.
   - Asegúrate de añadir el URI de redirección autorizado: `http://localhost:3000/google/callBack`.

2. **Variables de entorno**:
   - Añade las credenciales generadas al archivo `.env`:
     ```env
     CLIENT_ID=tu_client_id
     CLIENT_SECRET=tu_client_secret
     GOOGLE_CALLBACK_URL=http://localhost:3000/google/callBack
     ```

### Archivos Clave

1. **`auth/googleAuth.js`**:
   - Configura la estrategia de Google con Passport.
   - Define la lógica para buscar o crear usuarios en la base de datos.
   - Genera un token JWT para la sesión del usuario.

2. **`routes/authRoutes.js`**:
   - Define las rutas `/auth/google` y `/google/callBack` para manejar el flujo de autenticación.
   - Redirige al usuario al dashboard correspondiente después de la autenticación.

3. **Base de datos**:
   - La tabla `users` almacena la información de los usuarios, incluyendo su correo electrónico, nombre y rol.
   - Si un usuario inicia sesión con Google por primera vez, se crea un nuevo registro en esta tabla.

### Ejemplo de Uso

1. Accede a `/login` y haz clic en el enlace "Iniciar sesión con Google".
2. Selecciona una cuenta de Google en el prompt.
3. Serás redirigido al dashboard correspondiente según tu rol.
4. Si es la primera vez que inicias sesión con Google, tu cuenta será creada automáticamente en la base de datos con el rol `user` por defecto.

