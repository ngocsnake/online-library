import accountService from "@/lib/services/account.service";
import { bookService } from "@/lib/services/book.service";
import { dbService } from "@/lib/services/db.service";
import { getSession } from "@/lib/utils/getSession";

export async function GET(req: Request, res: Response) {
  await dbService.connect();
  const session = await getSession();

  const profile = await accountService.getAccountDetail(session.account?._id);
  return Response.json(profile);
}