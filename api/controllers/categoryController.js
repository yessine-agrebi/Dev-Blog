import mongoose from 'mongoose';
import Category from '../models/category.js';
import slugify from 'slugify';
export const getCategories = async (req, res) => {
  try {
    const cat = await Category.find();
    res.json(cat);
} catch (error) {
    res.status(404).send({ message: 'categories not Founds' });
  }
};
export const  createCategorie = async (req, res) => {
    try {
      const { name } = req.body;
      const category = await new Category({
        name,
        slug: slugify(name),
      }).save();
      res.json(category);
    } catch (err) {
      console.log(err);
      res.status(400).send("Duplicate error!");
    }
  };

 export const newestCategorie  = async (req, res) => {
    try {
      const categories = await Category.find().sort({ createdAt: -1 });
      res.json(categories);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  };

  export const updateCategorie = async (req, res) => {
    try {
      const { name } = req.body;
      const category = await Category.findOneAndUpdate(
        { slug: req.params.slug },
        { name, slug: slugify(name) },
        { new: true }
      );
      res.json(category);
    } catch (err) {
      res.status(400).send("Update failed");
      console.log(err);
    }
  };
export const removeCategorie = async (req, res) => {
    try {
      // console.log(req.params.slug);
      let category = await Category.findOneAndRemove({
        slug: req.params.slug,
      }).exec();
      res.json(category);
    } catch (err) {
      res.status(400).send("Delete failed");
      console.log(err);
    }
  };
  
  export const singleCategorie = async (req, res) => {
    try {
      const category = await Category.findOne({
        slug: req.params.slug,
      });
      res.json(category);
    } catch (err) {
      console.log(err);
    //   res.sendStatus(400);
    }
  };