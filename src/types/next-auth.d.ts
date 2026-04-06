import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    error?: "RefreshTokenError";
    access_token: string;
    refresh_token?: string;
    access_token_expire_at: string;
    refresh_token_expire_at: string;
    user: {
      email: string;
      first_name: string;
      last_name: string;
      username: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token: string;
    refresh_token?: string;
    access_token_expire_at: string;
    refresh_token_expire_at: string;
    error?: "RefreshTokenError";
  }
}
