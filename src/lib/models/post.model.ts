import mongoose, { Document, Model } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IComment } from "./comment.model";

export enum PostStatus {
  PENDING = "pending",
  REJECTED = "rejected",
  APPROVED = "approved",
}

export interface IPost {
  _id?: string;
  title: string;
  content: string;
  author: Account;
  status?: PostStatus;
  isDelete?: boolean;
  createdAt?: string;
  likes?: Account[];
  comments: IComment[];
  pin: boolean;
}

const PostSchema = new mongoose.Schema<IPost>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    title: String,
    content: String,
    pin: Boolean,
    status: {
      type: String,
      enum: Object.values(PostStatus),
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
  },
  { timestamps: true }
);

export interface PostDocument extends Document, IPost {}

PostSchema.plugin(paginate);

let model;

try {
  model = mongoose.model("Post");
} catch (e) {
  model = mongoose.model("Post", PostSchema);
}

export const PostModel = model as Model<PostDocument>;
