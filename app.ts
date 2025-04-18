import express, { application } from "express";
import { prisma } from './src/db/prisma.js';
import { BookRepository } from './src/repository/BookRepository.js';
import { CategoryRepository } from './src/repository/CategoryRepository.js';
import { AuthorRepository } from './src/repository/AuthorRepository.js';
import { BookUsecase } from './src/usecase/BookUsecase.js';
import { CategoryUsecase } from './src/usecase/CategoryUsecase.js';
import { AuthorUsecase } from './src/usecase/AuthorUsecase.js';
import { BookController } from "./src/controller/BookController.js";
import { CategoryController } from "./src/controller/CategoryController.js";
import { AuthorController } from "./src/controller/AuthorController.js";
import { createBookRouter } from './src/router/BookRouter.js';
import { createCategoryRouter } from "./src/router/CategoryRouter.js";
import { createAuthorRouter } from "./src/router/AuthorRouter.js";

const app = express();
const db = prisma;

const bookRepository = new BookRepository(db);
const bookUsecase = new BookUsecase(bookRepository);
const bookController = new BookController(bookUsecase);
const bookRouter = createBookRouter(bookController);

const categoryRepository = new CategoryRepository(db);
const categoryUsecase = new CategoryUsecase(categoryRepository);
const categoryController = new CategoryController(categoryUsecase);
const categoryRouter = createCategoryRouter(categoryController);

const authorRepository = new AuthorRepository(db);
const authorUsecase = new AuthorUsecase(authorRepository);
const authorController = new AuthorController(authorUsecase);
const authorRouter = createAuthorRouter(authorController);


app.use(express.json());
app.use('/api/books', bookRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/authors', authorRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at PORT: http://localhost:${PORT}`);
}).on('error', (error: Error) => {
    throw new Error(error.message);
});