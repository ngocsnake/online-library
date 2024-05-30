import {getSession} from "@/lib/utils/getSession";
import {NextRequest, NextResponse} from "next/server";
import httpStatus from "http-status";
import {headers} from "next/headers";

export async function GET(req: NextRequest) {
  const session = await getSession();
  const hostHeader = headers().get('Host') ?? req.nextUrl.host;
  const url = new URL(req.nextUrl);
  if (url.host !== hostHeader) {
    url.host = hostHeader;
    url.port = '';
  }
  const redirectUri = url.searchParams.get("redirect_uri");
  if (redirectUri) {
    session.auth = {
      mode: 'mobile_redirect',
      redirect_uri: redirectUri,
    };
    console.log('session.auth', session.auth);
    console.log(url.origin);
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
