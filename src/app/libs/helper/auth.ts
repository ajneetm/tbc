import { RefreshToken } from "@/types/Auth/types";
import {
  GetServerSidePropsContext,
  NextApiRequest,
  NextApiResponse,
} from "next";
import { AuthOptions, getServerSession, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser, refreshToken } from "../api/auth";

export const REFRESH_INTERVAL_SECONDS = 20;
export const authOptions: AuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  // secret: process.env.SECRET,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        password: { label: "Password", type: "password" },
        username: {
          label: "Username",
          type: "text",
          placeholder: "John Smith",
        },
      },
      async authorize(credentials) {
        // check to see if email and password is there
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }
        // console.log("credentials ==============~~~~~~~~~~~~~~", credentials);
        try {
          return await loginUser(credentials);
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, account }) {
      if (account) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`

        if (account.provider === "credentials") {
          return {
            ...token,
            ...user,
          } as JWT;
        }
        return {
          ...token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
        } as JWT;
      } else if (
        Date.now() <
        new Date(token.access_token_expire_at).getTime() -
          REFRESH_INTERVAL_SECONDS * 1000
      ) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError("Missing refresh_token");

        try {

          // The `token_endpoint` can be found in the provider's documentation. Or if they support OIDC,
          // at their `/.well-known/openid-configuration` endpoint.
          // i.e. https://accounts.google.com/.well-known/openid-configuration

          const refresh_token = token.refresh_token;
          const response = await refreshToken(refresh_token);

          const newTokens: RefreshToken = await response.json();

          if (!response.ok) throw newTokens;

          token.access_token = newTokens.access_token;
          token.refresh_token = newTokens.refresh_token ?? token.refresh_token;
          token.access_token_expire_at = newTokens.access_expires_at;
          token.refresh_token_expire_at = newTokens.refresh_expires_at;

          // Some providers only issue refresh tokens once, so preserve if we did not get a new one
          return { ...token };
        } catch (error) {
          console.error("Error refreshing access_token", error);
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = "RefreshTokenError";
          return token;
        }
      }
    },
    async session({ session, token }) {
      session.error = token.error;
      session.access_token = token.access_token;
      session.user = token as unknown as Session["user"];

      return session;
    },
  },

  debug: true,
};

export async function auth(
  ...args:
    | [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]]
    | [NextApiRequest, NextApiResponse]
    | []
) {
  return await getServerSession(...args, authOptions);
}
