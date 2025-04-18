import express from 'express'
import { ICategoryController } from '../domain/category/ICategoryController.js';

function createCategoryRouter(controller: ICategoryController): express.Router {
    const router = express.Router();
    router.get('/', controller.getCategories.bind(controller));
    router.get('/:id', controller.getCategoryById.bind(controller));
    router.post('/', controller.createCategory.bind(controller));
    router.patch('/:id', controller.updateCategory.bind(controller));
    router.delete('/:id', controller.deleteCategory.bind(controller));
    return router;
}

export { createCategoryRouter };