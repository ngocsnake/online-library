import {getSession} from "@/lib/utils/getSession";
import {NextRequest, NextResponse} from "next/server";
import httpStatus from "http-status";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const url = new URL(req.url);
  console.log('url', url);
  const redirectUri = url.searchParams.get("redirect_uri");
  if (redirectUri) {
    session.auth = {
      mode: 'mobile_redirect',
      redirect_uri: redirectUri,
    };
    await session.save();
    return NextResponse.redirect(`${url.origin}/auth/login`);
  } else {
    return NextResponse.json({
      message: "Invalid Auth Request"
    }, {
      status: httpStatus.FORBIDDEN
    });
  }
}
