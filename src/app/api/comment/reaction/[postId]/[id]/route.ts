import { CommentModel } from "@/lib/models/comment.model";
import { PostModel } from "@/lib/models/post.model";
import { dbService } from "@/lib/services/db.service";
import { getSession } from "@/lib/utils/getSession";

export async function PATCH(request: Request, { params }: any, res: Response) {
  await dbService.connect();
  await CommentModel.find();
  const commentId = params.id;
  const comment = await CommentModel.findById(commentId);

  if (!commentId || !comment?._id) {
    return Response.json(
      {
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  const { account } = await getSession();
  const liked = !!comment?.likes?.find(
    (item) => item?.toString() === account?._id || item._id === account?._id
  );

  await CommentModel.findByIdAndUpdate(
    commentId,
    liked
      ? {
          $pull: {
            likes: account?._id,
          },
        }
      : {
          $push: {
            likes: account?._id,
          },
        }
  );

  const data = await PostModel.findById(params.postId).populate([
    "author",
    "comments",
    "likes",
    {
      path: "comments",
      populate: {
        path: "author",
        model: "Account",
      },
    },
  ]);

  return Response.json(JSON.parse(JSON.stringify(data)));
}
