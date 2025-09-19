const Book = require('../models/books.model');
const socketIO = require('../services/socket.service');
const NodeCache =  require("node-cache")

const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

//Create book
const createBook= async (req, res) => {
    try {
        const newBook = await Book.create(req.body);
        if (newBook) {
        socketIO.emitEvent('Book:created', newBook);
        return res.status(201).json({ message: 'Book created successfully', data: newBook });
        } else {
        return res.status(400).json({ message: 'Error creating book', data: null });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error creating book', error: error.message, data: null });
    }


}

//get all books
const getBooks = async (req, res) => {
    try {
        const cacheKey = "books";

        const cachedBooks = cache.get(cacheKey);
        if (cachedBooks) {
            console.log("books cached");
            return res.status(200).json({
                message: "Books retrieved successfully (from cache)",
                data: cachedBooks,
            });
        }
        const books = await Book.findAll();
        if (books.length > 0) {
            cache.set(cacheKey, books);
            return res.status(200).json({ message: 'Books retrieved successfully', data: books });
        } else {
            return res.status(404).json({ message: 'No books found', data: [] });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving books', error: error.message, data: null });
    }
}

//get user by id
const getBookById = async (req, res) => {
    const { id } = req.params;
    try {
        const book = await Book.findByPk(id);
        if (book) {
            return res.status(200).json({ message: 'Book retrieved successfully', data: book });
        } else {
            return res.status(404).json({ message: 'Book not found', data: null });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error retrieving book', error: error.message, data: null });
    }
}

//update book by id
const updateBookById = async(req, res) => {
    const { id } = req.params;
    try {
        const [updated] = await Book.update(req.body, { where: { id } });
        if (updated) {
            const updatedBook = await Book.findByPk(id);
            socketIO.emitEvent('Book:updated', updatedBook);
            return res.status(200).json({ message: 'Book updated successfully', data: updatedBook });
        } else {
            return res.status(404).json({ message: 'Book not found', data: null });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error updating book', error: error.message, data: null });
    }
    

}

//delete book by id
const deleteBookById= async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await Book.destroy({ where: { id } });
        if (deleted) {
            socketIO.emitEvent('Book:deleted', { id });
            return res.status(200).json({ message: 'Book deleted successfully', data: null });
        } else {
            return res.status(404).json({ message: 'Book not found', data: null });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting book', error: error.message, data: null });
    }
}
module.exports = {
createBook,
getBooks,
getBookById,
updateBookById,
deleteBookById
};