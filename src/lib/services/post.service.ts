import { IPost } from "../models/post.model";
import { objectToParams } from "../utils/objectToParams";

interface GetPostParams {
  page?: number;
  limit?: number;
  query?: string;
}

interface CreateComment {
  postId: string;
  content: string;
}

interface DeleteComment {
  postId: string;
  commentId: string;
}

class PostService {
  async create(payload: IPost) {
    return fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }

  async get(queries: GetPostParams) {
    return fetch(`/api/posts${objectToParams(queries)}`, {
      body: JSON.stringify(queries),
    }).then((res) => res.json());
  }

  async getByID(id: string) {
    return fetch(`/api/posts/${id}`).then((res) => res.json());
  }

  async delete(postId: string) {
    return fetch(`/api/posts/${postId}`, {
      method: "DELETE",
    }).then((res) => res.json());
  }

  async reaction(postId: string) {
    return fetch(`/api/posts/reaction/${postId}`, {
      method: "PATCH",
    }).then((res) => res.json());
  }

  async pin(postId: string) {
    return fetch(`/api/posts/pin/${postId}`, {
      method: "PATCH",
    }).then((res) => res.json());
  }

  async comment(payload: CreateComment) {
    return fetch(`/api/comment/post/${payload.postId}`, {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((res) => res.json());
  }

  async deleteComment(payload: DeleteComment) {
    return fetch(
      `/api/comment/post/${payload.postId}?commentId=${payload.commentId}`,
      {
        method: "DELETE",
      }
    ).then((res) => res.json());
  }

  async reactionComment(postId: string, commentId: string) {
    return fetch(`/api/comment/reaction/${postId}/${commentId}`, {
      method: "PATCH",
    }).then((res) => res.json());
  }
}
export const postService = new PostService();
