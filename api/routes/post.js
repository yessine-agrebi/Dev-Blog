import express from 'express'
// import formidable from "express-formidable";

const Postroute = express.Router();

// // middlewares
// import {
//   requireSignin,
//   isAdmin,
//   canCreateRead,
//   canUpdateDeletePost,
//   canDeleteMedia,
//   canUpdateDeleteComment,
// } from "../middlewares";

// controllers
import {
  uploadImage,
  createPost,
  posts,

  singlePost,
  removePost,
  editPost,
  postsByAuthor,
  postCount,
  postsForAdmin,
  createComment,
  comments,
  commentCount,
  removeComment,
  userComments,
  updateComment,
  getNumbers,
  postsByCategory,
} from "../controllers/postController.js";

// APPLY canPost MIDDLEWARE (if role is admin or author)
Postroute.post("/upload-image", uploadImage);
// Postroute.post(
//   "/upload-image-file",
//   formidable(),
//   requireSignin,
//   canCreateRead,
//   uploadImageFile
// );
Postroute.post("/create-post",  createPost);
Postroute.get("/", postsForAdmin);
Postroute.get("/posts/:page", posts);
Postroute.get("/post/:slug", singlePost);
Postroute.put("/post/:postId",   editPost);
Postroute.delete("/post/:postId",   removePost);
Postroute.get("/post-count", postCount);
// author
Postroute.get("/posts-by-author",  postsByAuthor);
// comments
Postroute.post("/comment/:postId", createComment);
Postroute.get("/comments/:page", comments);
Postroute.get("/comment-count", commentCount);
Postroute.delete(
  "/comment/:commentId",
  
  removeComment
);
Postroute.get("/user-comments",  userComments);
Postroute.put(
  "/comment/:commentId",

  updateComment
);
Postroute.get("/numbers", getNumbers);
Postroute.get("/posts-by-category/:slug", postsByCategory);

export default Postroute