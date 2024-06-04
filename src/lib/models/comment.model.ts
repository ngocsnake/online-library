import mongoose, { Document, Model } from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IComment {
  author: Account;
  content: string;
  likes: Account[];
  parent: IComment;
  root: IComment;
  createdAt: string;
}

const CommentSchema = new mongoose.Schema<IComment>(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
    },
    content: String,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
      },
    ],
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
    root: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  },
  { timestamps: true }
);

export interface CommentDocument extends Document, IComment {}

CommentSchema.plugin(paginate);

let model;

try {
  model = mongoose.model("Comment");
} catch (e) {
  model = mongoose.model("Comment", CommentSchema);
}

export const CommentModel = model as Model<CommentDocument>;
