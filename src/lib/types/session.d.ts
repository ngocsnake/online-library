interface SessionData {
  signedIn: boolean;
  account?: Account;
  auth?: {
    mode: 'mobile_redirect' | 'sso';
    redirect_uri?: string;
  }
}

