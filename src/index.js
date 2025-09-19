const express = require('express');
const http = require('http');
const socketIO = require('./services/socket.service'); // Importa el servicio de Socket.IO
const PORT = process.env.PORT || 3001; // Puerto para el servidor Express
const app = express();
const booksRoutes = require('./routes/books.route');
const usersRoutes = require('./routes/users.route');

//Middlewares
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));

//settings
app.set('port', process.env.PORT || 3000)

//Routes
app.use('/books', booksRoutes);
app.use('/users', usersRoutes);

// --- Iniciar el servidor ---
const server = http.createServer(app); // Creamos un servidor HTTP a partir de nuestra app Express

// Inicializamos Socket.IO con el servidor HTTP
socketIO.init(server);

server.listen(app.get("port"), "0.0.0.0", () => {
    console.log(`Socket.IO escuchando en el puerto ${PORT}`);
    console.log("Servidor rest en el puerto : ", app.get("port"));
});

