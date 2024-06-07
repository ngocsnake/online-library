import { RoleEnum } from "@/lib/models/account.model";
import { borrowService } from "@/lib/services/borrow.service";
import { dbService } from "@/lib/services/db.service";
import { getSession } from "@/lib/utils/getSession";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
  res: Response
) {
  await dbService.connect();
  const { account } = await getSession();
  const borrowRecord = await borrowService.getById(params.id);

  if (
    account?._id !== borrowRecord?.user?._id &&
    account?.role === RoleEnum.USER
  ) {
    return Response.json(
      { success: false, message: "Không thể hủy phiếu mượn" },
      { status: 403 }
    );
  }

  await borrowService.declineBorrow(params.id);
  return Response.json({ success: true, message: "Đã hủy phiếu mượn" });
}
