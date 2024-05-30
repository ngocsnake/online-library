import {ReactNode} from "react";
import AuthLayoutContent from "@/app/AuthLayoutContent";
import {getSession} from "@/lib/utils/getSession";
import {redirect} from "next/navigation";
import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import ClientRedirect from "@/app/auth/ClientRedirect";

interface AuthLayoutProps {
  children: ReactNode;
}
export default async function AuthLayout({children}: AuthLayoutProps) {
  const session = await getSession();
  const {auth} = session;
  if (session.signedIn) {
    if (auth?.mode === 'mobile_redirect' && auth?.redirect_uri) {
      const cookiesString = cookies().toString();
      const targetUri = `${auth?.redirect_uri}#${encodeURIComponent(cookiesString)}`;
      return <ClientRedirect uri={targetUri}/>
    }
    return redirect('/');
  }

  return <AuthLayoutContent>
    {children}
  </AuthLayoutContent>
}
