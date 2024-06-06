import { createBorrowValidationSchema } from "@/lib/common/validations/borrow.validation";
import { RoleEnum } from "@/lib/models/account.model";
import { BorrowStatus } from "@/lib/models/borrow.model";
import accountService from "@/lib/services/account.service";
import { bookService } from "@/lib/services/book.service";
import { borrowService } from "@/lib/services/borrow.service";
import { dbService } from "@/lib/services/db.service";
import { getSession } from "@/lib/utils/getSession";

export async function GET(req: Request, res: Response) {
  await dbService.connect();
  const session = await getSession();
  return Response.json(session);
}

export async function POST(req: Request, res: Response) {
  await dbService.connect();
  const payload = await req.json();

  const { account } = await getSession();
  const validate = createBorrowValidationSchema.safeParse(payload);

  if (!validate.success) {
    return Response.json(
      { success: false, message: validate.error.issues },
      { status: 400 }
    );
  }

  if (!account?._id) {
    return Response.json({ success: false, message: "403" }, { status: 403 });
  }

  const user = await accountService.getAccountByEmail(payload.email);

  if (!user?._id) {
    return Response.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  try {
    const data = await borrowService.create({
      user: user,
      book: payload.book,
      library: payload.library,
      phoneNumber: payload.phoneNumber,
      borrowDate: payload.borrowDate,
      returnDate: payload.returnDate,
      email: payload.email,
      address: payload.address,
      isDelete: false,
      status:
        account?.role === RoleEnum.USER
          ? BorrowStatus.PENDING
          : BorrowStatus.BORROWING,
    });

    return Response.json({ success: true, data });
  } catch (error: any) {
    return Response.json({ success: false, message: error.message });
  }
}
