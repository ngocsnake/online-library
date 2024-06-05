import { RoleEnum } from "@/lib/models/account.model";
import { CommentModel } from "@/lib/models/comment.model";
import { PostModel } from "@/lib/models/post.model";
import { dbService } from "@/lib/services/db.service";
import { getSession } from "@/lib/utils/getSession";

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
  res: Response
) {
  await dbService.connect();
  await CommentModel.find();

  const post = await PostModel.findById(params.id).populate([
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

  if (!post?._id) {
    return Response.json(
      {
        success: false,
      },
      {
        status: 404,
      }
    );
  }

  return Response.json({
    success: true,
    data: post,
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
  res: Response
) {
  await dbService.connect();
  const postId = params.id;
  const post = await PostModel.findById(postId);

  if (!postId || !post?._id) {
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
  const hasPermission =
    account?._id === post?.author._id ||
    account?.role == RoleEnum.ADMIN ||
    account?.role === RoleEnum.MANAGER;

  if (!hasPermission) {
    if (!post) {
      return Response.json(
        {
          success: false,
        },
        {
          status: 403,
        }
      );
    }
  }

  await PostModel.findByIdAndUpdate(
    postId,
    {
      isDelete: true,
    },
    { new: true }
  );

  return Response.json({ success: true });
}
