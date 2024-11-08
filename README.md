# Sistema de Autenticación con Roles (Node.js, Express, PostgreSQL)

Este proyecto es un sistema básico de autenticación que permite el registro, inicio de sesión y logout de usuarios, con roles de `user` y `admin` para restringir el acceso a diferentes secciones. Implementa autenticación con JWT y cookies para mantener la sesión de los usuarios.

## Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript en el lado del servidor.
- **Express.js**: Framework de Node.js para crear el servidor.
- **Pug**: Motor de plantillas para generar vistas HTML dinámicas.
- **PostgreSQL**: Base de datos relacional para almacenamiento de usuarios y roles.
- **JWT (JSON Web Tokens)**: Para la autenticación segura de usuarios.
- **bcrypt.js**: Para encriptar las contraseñas de los usuarios.
- **cookie-parser**: Middleware para gestionar cookies en Express.

## Requisitos Previos

- [Node.js](https://nodejs.org/en/download/) (v12+)
- [PostgreSQL](https://www.postgresql.org/download/) (v12+)
- Crear una base de datos PostgreSQL para el proyecto y configurar las variables de entorno en el archivo `.env`.

## Instalación

2. Instalar dependencias
```bash
npm install
```
3. Configurar la base de datos:

Crear la tabla users en PostgreSQL:
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    role VARCHAR(10) DEFAULT 'user' CHECK (role IN ('admin', 'user'))
);

```
4. Crear un archivo .env en la raíz del proyecto y añadir las siguientes variables:

```bash
DB_USER=
DB_HOST=
DB_NAME=
DB_PASS=
DB_PORT=
JWT_SECRET=tu_secreto_para_jwt
PORT=3000
```

5. Iniciar el servidor:

```bash
npm start
```

### Endpoints y Rutas
1. Registro de Usuario
- URL: /register
- Método: POST
- Descripción: Crea un nuevo usuario. Por defecto, los usuarios registrados tienen el rol de user. Solo el administrador puede cambiar manualmente el rol a admin.

Ejemplo de Payload:
```bash
{
  "username": "user123",
  "email": "user@example.com",
  "password": "mypassword"
}
```

2. Inicio de Sesión
- URL: /login
- Método: POST
- Descripción: Autentica al usuario, devuelve un JWT y establece una cookie de sesión.
Ejemplo de Payload:
```bash
{
  "username": "user123",
  "password": "mypassword"
}
```
3. Logout
- URL: /logout
- Método: GET
- Descripción: Borra la cookie de sesión y cierra la sesión del usuario.

4. Panel de Usuario
- /user/dashboard
- Método: GET
- Autenticación: Necesaria (Rol: user)
- Descripción: Muestra el panel principal para usuarios con el rol user.

5. Panel de Administrador
- URL: /admin/dashboard
- Método: GET
- Autenticación: Necesaria (Rol: admin)
- Descripción: Muestra el panel principal para usuarios con el rol admin.

