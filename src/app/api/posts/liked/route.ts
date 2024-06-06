import { PostModel, PostStatus } from "@/lib/models/post.model";
import { dbService } from "@/lib/services/db.service";
import { getSession } from "@/lib/utils/getSession";

export async function GET(req: Request, res: Response) {
  await dbService.connect();
  const { searchParams } = new URL(req.url ?? "");
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 20);
  const query = searchParams.get("query") ?? "";
  const author = searchParams.get("author") ?? "";
  const { account } = await getSession();

  const filter: any = {
    isDelete: {
      $ne: true,
    },
    status: PostStatus.APPROVED,
    likes: account?._id,
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
