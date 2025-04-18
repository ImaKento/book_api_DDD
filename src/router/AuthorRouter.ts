import express from 'express'
import { IAuthorController } from '../domain/author/IAuthorController.js';

function createAuthorRouter(controller: IAuthorController): express.Router {
    const router = express.Router();
    router.get('/', controller.getAuthors.bind(controller));
    router.get('/:id', controller.getAuthorById.bind(controller));
    router.post('/', controller.createAuthor.bind(controller));
    router.patch('/:id', controller.updateAuthor.bind(controller));
    router.delete('/:id', controller.deleteAuthor.bind(controller));
    return router;
}

export { createAuthorRouter };