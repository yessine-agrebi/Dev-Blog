import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    content: {},
    categories: [{ type: ObjectId, ref: "Category" }],
    featuredImage: { type: ObjectId, ref: "Media" },
    published: {
      type: Boolean,
      default: true,
    },
    postedBy: {
      type: ObjectId,
      ref: "User",
    },
    rating:{
      type:Number,
      min:1,
      max:5
    }
  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
