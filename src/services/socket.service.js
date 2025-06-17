// socket.js

let io; // Variable para almacenar la instancia de Socket.IO

// Función para inicializar Socket.IO
// Recibe el servidor HTTP como parámetro
function init(httpServer) {
    io = require('socket.io')(httpServer, {
        cors: {
            origin: "*", // Permite conexiones desde cualquier origen (cambiar en producción por dominios específicos)
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Un cliente se ha conectado a Socket.IO:', socket.id);

        socket.on('disconnect', () => {
            console.log('Un cliente se ha desconectado de Socket.IO:', socket.id);
        });

        // Puedes añadir más listeners de eventos aquí si tu cliente envía mensajes
        // socket.on('someEvent', (data) => {
        //     console.log('Recibido:', data);
        //     socket.emit('responseEvent', 'Mensaje recibido');
        // });
    });

    console.log('Socket.IO inicializado.');
}

// Función para obtener la instancia de IO
function getIO() {
    if (!io) {
        throw new Error('Socket.IO no está inicializado.');
    }
    return io;
}

// Función para emitir un evento a todos los clientes
function emitEvent(eventName, data) {
    if (io) {
        io.emit(eventName, data);
        console.log(`Evento Socket.IO '${eventName}' emitido con datos:`, data);
    } else {
        console.warn('Socket.IO no está inicializado, no se pudo emitir el evento.');
    }
}

module.exports = {
    init,
    getIO,
    emitEvent
};