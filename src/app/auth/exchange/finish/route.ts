import {getSession} from "@/lib/utils/getSession";
import {NextRequest, NextResponse} from "next/server";
import httpStatus from "http-status";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.signedIn || !session.auth || session.auth.mode !== 'mobile_redirect') {
    return NextResponse.json({
      finished: false,
    }, {
      status: httpStatus.UNAUTHORIZED,
    });
  }
  session.auth = undefined;
  await session.save();

  return NextResponse.json({
    finished: true,
  });
}
