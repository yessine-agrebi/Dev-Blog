import Post from '../models/post.js';
import User from '../models/user.js';
import Category from '../models/category.js';
import Comment from '../models/comment.js';
import cloudinary from 'cloudinary';
import slugify from 'slugify';
import multer from 'multer';

const upload = multer();

export const uploadImage = async (req, res) => {
  upload.single('file'),
    async (req, res) => {
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
      };
      const result = await streamUpload(req);
      res.send(result);
    };
};
export const createPost = async (request, response) => {
  try {
      const post = await new Post(request.body);
      // try {
      //   const alreadyExist = await Post.findOne({
      //     slug: slugify(title),
      //    }).exec();
      //   if (alreadyExist) return res.json({ error: 'Title is taken' });
      // } catch (error) {
      //   response.status(500).json(error);

      // }
    
      post.save();

      response.status(200).json(post);
  } catch (error) {
    return res.send({message:'Title is taken'}  );  }
}
// export const createPost = async (req, res) => {
//   const post = await new Post(request.body);

//   try {
//    // check if title is taken
//     const alreadyExist = await Post.findOne({
//       slug: slugify(title),
//     }).exec();
//     if (alreadyExist) return res.json({ error: 'Title is taken' });


//     // push post id to user's posts array
//     // await User.findByIdAndUpdate(req.user._id, {
//     //   $addToSet: { posts: newPost._id },
//     // });
//     post.save();
//     response.status(200).json('Post saved successfully');

//   } catch (err) {
//     console.log(err);
//     res.sendStatus(400);
//   }
// };
export const postsByAuthor = async (req, res) => {
  try {
    const posts = await Post.find({ postedBy: req.user._id })
      .populate('postedBy', '_id name')
      .populate('categories', '_id name slug')
      .sort({ createdAt: -1 })
      .exec();
    return res.json(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
export const postsForAdmin = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate('postedBy', '_id name')
      .populate('categories', '_id name slug')
      // .populate("featuredImage", "url")
      .sort({ createdAt: -1 })
      .exec();
    return res.json(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
export const posts = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;

    const posts = await Post.find({})
      .skip((page - 1) * perPage)
      .populate('postedBy', '_id name')
      .populate('categories', '_id name slug')
      // .populate("featuredImage", "url")
      .sort({ createdAt: -1 })
      .limit(perPage)
      .exec();
    return res.json(posts);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const singlePost = async (req, res) => {
  try {
    const { slug } = req.params;
    const post = await Post.findOne({ slug })
      .populate('postedBy', '_id name')
      .populate('categories', '_id name slug');
    // comments
    const comments = await Comment.find({ postId: post._id })
      .populate('postedBy', '_id name')
      .sort({ createdAt: -1 });
    return res.json({ post, comments });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
export const removePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findByIdAndDelete(postId);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
export const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, content, featuredImage, categories } = req.body;
    // get ids for catrgories
    let ids = [];
    for (let i = 0; i < categories.length; i++) {
      Category.findOne({ name: categories[i] }).exec((err, c) => {
        if (err) {
          console.log(err);
        }
        // console.log("c", c._id);
        ids.push(c._id);
      });
    }
    setTimeout(async () => {
      const post = await Post.findByIdAndUpdate(
        postId,
        {
          title,
          slug: slugify(title),
          content,
          categories: ids,
          featuredImage,
        },
        {
          new: true,
        }
      )
        .populate('postedBy', '_id name')
        .populate('categories', '_id name slug');

      return res.json(post);
    }, 1000);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
export const postCount = async (req, res) => {
  try {
    const count = await Post.countDocuments();
    return res.json(count);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
export const createComment = async (req, res) => {
  console.log(req.body);
  try {
    const { postId } = req.params;
    const { comment } = req.body;
    let created = await new Comment({
      content: comment,
      postId,
      postedBy: req.user._id,
    }).save();
    created = await created.populate('postedBy', '_id name');
    res.json(created);
  } catch (err) {
    console.log(err);
  }
};
export const comments = async (req, res) => {
  try {
    console.log(req.params);
    const perPage = 3;
    const page = req.params.page ? req.params.page : 1;

    const comments = await Comment.find({})
      .skip((page - 1) * perPage)
      .populate('postedBy', '_id name')
      .populate('postId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(perPage)
      .exec();
    return res.json(comments);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const commentCount = async (req, res) => {
  try {
    const count = await Comment.countDocuments();
    return res.json(count);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
export const removeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    console.log('commentId', commentId);
    const comment = await Comment.findByIdAndDelete(commentId);
    return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const userComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postedBy: req.user._id })
      .populate('postedBy', '_id name')
      .populate('postId', 'title slug')
      .sort({ createdAt: -1 })
      .exec();
    return res.json(comments);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const updateComment = async (req, res) => {
  // console.log("update comment", req.body);
  try {
    const { commentId } = req.params;
    const { content } = req.body;

    const updated = await Comment.findByIdAndUpdate(
      commentId,
      { content },
      { new: true }
    );
    console.log('comment updated', updated);
    return res.json(updated);
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};
export const getNumbers = async (req, res) => {
  try {
    const posts = await Post.countDocuments();
    const users = await User.countDocuments();
    const comments = await Comment.countDocuments();
    const categories = await Category.countDocuments();
    return res.json({
      posts,
      users,
      comments,
      categories,
    });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};

export const postsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });
    const posts = await Post.find({ categories: category._id }).limit(24);
    // console.log(category, posts);
    res.json({ category, posts });
  } catch (err) {
    console.log(err);
    res.sendStatus(400);
  }
};