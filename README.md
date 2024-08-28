# Proyecto EasyRide

## Descripción del Proyecto

**Descripción del Problema**  
Este proyecto busca conectar a personas que desean contratar un servicio de transporte privado con quienes lo ofrecen. Actualmente, no existe ninguna plataforma que facilite esta conexión.

**Propuesta**  
- **Para los usuarios**: Ofrecer una opción sencilla para reservar un viaje hacia un destino específico.
- **Para las empresas**: Brindar una plataforma donde puedan publicitar sus servicios y construir una reputación en el mercado.

**Solución**  
- **Usuarios**: Podrán buscar y reservar un viaje de manera eficiente.
- **Proveedores de servicios**: Tendrán la posibilidad de ofrecer sus servicios a un público más amplio, incrementando su clientela.

## Estructura del Proyecto

El proyecto está organizado en la siguiente estructura dentro de la carpeta `ProyectoV2`:

- **`charterv2`**: Carpeta que contiene todo lo referente al frontend, desarrollado con Angular, Angular Material y Firebase.
- **`server`**: Carpeta que contiene el backend, desarrollado con Node.js, Express, TypeScript, y MySQL. Incluye el archivo de base de datos `EasyRide.sql` para inicializar la base de datos.

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalados los siguientes programas:

- [Node.js](https://nodejs.org/en)
- [Angular CLI](https://angular.io/cli)  
  Se puede instalar con el siguiente comando:
  ```bash
  npm install -g @angular/cli
- [XAMPP o MySQL Workbench](https://www.apachefriends.org/es/index.html) o (https://www.mysql.com/products/workbench/)

## Instalación

### Clona el repositorio
```bash
git clone https://github.com/MariM01/ProyectoV2.git
cd ProyectoV2
```

### Instala la base de datos

Importa el archivo `EasyRide.sql` ubicado en `ProyectoV2/server/src/db`. Usa el nombre `EasyRide`, con el usuario `root` y sin contraseña.

### Configura y ejecuta el backend

- Posiciónate en la carpeta `server`:
```bash
cd server
```

- Instala las dependencias necesarias:
```bash
npm install bcrypt
npm install --save-dev @types/bcrypt
```

- Compila TypeScript en tiempo real:
```bash
tsc --watch
```

- Inicia el servidor:
```bash
npm run dev
```

### Configura y ejecuta el frontend

- Posiciónate en la carpeta `charterv2`:
```bash
cd charterv2
```

- Instala las dependencias necesarias:
```bash
npm install firebase
ng add @angular/fire
npm install jspdf html2canvas
npm install --save-dev @types/jspdf @types/html2canvas
```

- Inicia el servidor de desarrollo de Angular y abre la aplicación en tu navegador:
```bash
ng serve --o
```

## Uso del Proyecto
Una vez que ambos servidores (frontend y backend) estén en ejecución, podrás acceder a la plataforma a través de tu navegador en la dirección http://localhost:4200/. Desde allí, podrás explorar las funcionalidades disponibles tanto para usuarios que desean reservar un viaje como para empresas que desean ofrecer sus servicios.
