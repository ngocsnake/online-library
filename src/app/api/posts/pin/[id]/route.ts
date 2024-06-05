import { CommentModel } from "@/lib/models/comment.model";
import { PostModel } from "@/lib/models/post.model";
import { dbService } from "@/lib/services/db.service";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
  res: Response
) {
  await dbService.connect();
  await CommentModel.find();
  const postId = params.id;
  const post = await PostModel.findById(postId);

  if (!postId || !post?._id) {
    Response.json(
      {
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  await PostModel.findByIdAndUpdate(
    postId,
    {
      pin: post?.pin ? false : true,
    },
    {
      new: true,
    }
  );

  const data = await PostModel.findById(params.id).populate([
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
