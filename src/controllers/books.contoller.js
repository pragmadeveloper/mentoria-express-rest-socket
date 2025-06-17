const books = require('../models/books.model');
const newBooks = books.books; // Simulamos una llamada a la base de datos
const socketIO = require('../services/socket.service'); // Importa el servicio de Socket.IO

//Crear un nuevo libro
const createBook= async (req, res) => {
    const { title, author, year } = req.body;
    if (!title || !author || !year) {
        return res.status(400).json({ message: 'Todos los campos son requeridos: title, author, year' });
    }
    const newBook = {id: String(newBooks.length + 1),title,author,year};
    if(newBook){
       newBooks.push(newBook);
          // ¡Aquí emitimos la notificación!
       socketIO.emitEvent('book:created', newBook);
       return res.status(201).json(newBooks); // 201 Created
    }else{
      return res.status(500).json({ message: 'Error al crear el libro' });
    }
}

//Obtener todos los libros
const getBooks = async (req, res) => {

    if (!newBooks || newBooks.length === 0) {
        return res.status(404).json({ message: 'No se encontraron libros' });
    }
    else {
        return res.status(200).json(newBooks);
    }
}

//Obtener un libro por ID
const getBookById = async (req, res) => {
    const { id } = req.params;
     const book = newBooks.find(b => b.id === id);
 
   if (book) {
       return res.status(200).json(book);
    } else {
       return res.status(404).json({ message: 'Libro no encontrado' });
    }
}

//Actualizar un libro existente por ID
const updateBookById = async(req, res) => {
    const { id } = req.params;
    const { title, author, year } = req.body;

    let bookFound = false;
    newBooks.forEach(book => {
        if (book.id === id) {
            bookFound = true;
            book.title = title || book.title;
            book.author = author || book.author;
            book.year = year || book.year;
        }
    });

    if (bookFound) {
        const updatedBook = newBooks.find(b => b.id === id);
         socketIO.emitEvent('book:updated', updatedBook);
       return res.status(200).json(updatedBook);
    } else {
       return res.status(404).json({ message: 'Libro no encontrado' });
    }
}

//Eliminar un libro por ID
const deleteBookById= async (req, res) => {
    const { id } = req.params;
    const initialLength = newBooks.length;
    const deleteBooks = newBooks.filter(book => book.id !== id);

    if (deleteBooks.length < initialLength) {
        socketIO.emitEvent('book:deleted', { id });
       return res.status(200).json(deleteBooks); // 204 No Content (éxito sin contenido de respuesta)
    } else {
       return res.status(404).json({ message: 'Libro no encontrado' });
    }

}
module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBookById,
    deleteBookById
};