import { RoleEnum } from "@/lib/models/account.model";
import { CommentModel } from "@/lib/models/comment.model";
import { PostModel, PostStatus } from "@/lib/models/post.model";
import accountService from "@/lib/services/account.service";
import { dbService } from "@/lib/services/db.service";
import { getSession } from "@/lib/utils/getSession";

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
  res: Response
) {
  await dbService.connect();
  const payload = await request.json();
  const session = await getSession();
  const account = await accountService.getAccountById(session?.account?._id);

  try {
    if (!payload.content || !params.id) {
      throw Error("Content is required");
    }

    if (!account?._id) throw Error("Unauthorized");

    const comment = await CommentModel.create({
      content: payload.content,
      author: account._id,
      root: payload.root,
      parent: payload.parent,
    });

    await PostModel.findByIdAndUpdate(params.id, {
      $push: {
        comments: comment?._id,
      },
    });

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

    return Response.json({
      success: true,
      data: post,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
  res: Response
) {
  await dbService.connect();
  const { searchParams } = new URL(req.url ?? "");
  const commentId = searchParams.get("commentId");
  await dbService.connect();
  const session = await getSession();
  const account = await accountService.getAccountById(session?.account?._id);

  try {
    if (!account?._id) throw Error("Unauthorized");

    await PostModel.findByIdAndUpdate(params.id, {
      $pull: {
        comments: commentId,
      },
    });

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

    return Response.json({
      success: true,
      data: post,
      message: "Đã xóa bình luận",
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}
