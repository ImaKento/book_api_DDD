import express from 'express';
import { IBookController } from '../interface/book/IBookController.js';

function createBookRouter(controller: IBookController): express.Router {
    const router = express.Router();
    router.get('/', controller.getBooks.bind(controller));
    router.get('/:id', controller.getBookById.bind(controller));
    router.post('/', controller.createBook.bind(controller));
    router.patch('/:id', controller.updateBook.bind(controller));
    router.delete('/:id', controller.deleteBook.bind(controller));
    return router;
}

export { createBookRouter };