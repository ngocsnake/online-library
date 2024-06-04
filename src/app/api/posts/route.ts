import { paginate } from "mongoose-paginate-v2";
import { message } from "antd";
import { RoleEnum } from "@/lib/models/account.model";
import { PostModel, PostStatus } from "@/lib/models/post.model";
import accountService from "@/lib/services/account.service";
import { dbService } from "@/lib/services/db.service";
import { getSession } from "@/lib/utils/getSession";

export async function POST(req: Request, res: Response) {
  await dbService.connect();
  const payload = await req.json();
  const session = await getSession();
  const account = await accountService.getAccountById(session?.account?._id);

  try {
    if (!payload.title || !payload.content) {
      throw Error("Title and content is required");
    }

    if (!account?._id) throw Error("Unauthorized");

    const res = await PostModel.create({
      pin: false,
      title: payload.title,
      content: payload.content,
      author: account._id,
      status:
        account.role === RoleEnum.USER
          ? PostStatus.PENDING
          : PostStatus.APPROVED,
    });
    return Response.json({
      success: true,
      data: res,
      message:
        account.role === RoleEnum.USER
          ? "Bài viết đang chờ duyệt."
          : "Đang bài viết thành công",
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

export async function GET(req: Request, res: Response) {
  await dbService.connect();
  const { searchParams } = new URL(req.url ?? "");
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const query = searchParams.get("query") ?? "";
  const author = searchParams.get("author") ?? "";

  const filter: any = {
    isDelete: {
      $ne: true,
    },
    status: PostStatus.APPROVED,
  };
  if (query) {
    filter.$or = [
      { title: { $regex: new RegExp(query, "i") } },
      { content: { $regex: new RegExp(query, "i") } },
    ];
  }

  if (author) {
    filter.author = author;
  }

  const options: any = {
    page,
    limit,
    sort: { pin: -1, createdAt: -1 },
    populate: ["author"],
  };

  const data = await (PostModel as any).paginate(filter, options);

  return Response.json(data);
}
