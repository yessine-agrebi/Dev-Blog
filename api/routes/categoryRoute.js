import express from 'express';
import { createCategorie, getCategories, newestCategorie, removeCategorie, singleCategorie, updateCategorie } from '../controllers/categoryController.js';

const categoryRoute = express.Router();

categoryRoute.get('/',getCategories)
categoryRoute.get('/',newestCategorie)
categoryRoute.post('/',createCategorie)
categoryRoute.put('/:slug',updateCategorie)
categoryRoute.delete('/:slug',removeCategorie)
categoryRoute.get('/:slug',singleCategorie)


 

export default categoryRoute