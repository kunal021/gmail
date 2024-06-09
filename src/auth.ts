import NextAuth, { type User } from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Google({
      authorization: {
        params: {
          access_type: "offline",
          prompt: "consent",
          scope: "openid https://www.googleapis.com/auth/gmail.readonly",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as User;
      }
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token) {
        if (typeof token.access_token === "string") {
          session.accessToken = token.access_token;
        }
        if (typeof token.refresh_token === "string") {
          session.refreshToken = token.refresh_token;
        }
      }

      return session;
    },
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
        const userProfile: User = {
          id: token.sub,
          name: token?.name,
          email: token?.email,
          image: token?.picture,
          emailVerified: null,
        };
        return {
          access_token: account.access_token,
          expires_at: account.expires_at,
          refresh_token: account.refresh_token,
          user: userProfile,
        };
      } else if (Date.now() < token.expires_at * 1000) {
        // Subsequent logins, if the `access_token` is still valid, return the JWT
        return token;
      } else {
        // Subsequent logins, if the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new Error("Missing refresh token");

        try {
          const response = await axios.post(
            "https://oauth2.googleapis.com/token",
            new URLSearchParams({
              client_id: process.env.AUTH_GOOGLE_ID!.toString(),
              client_secret: process.env.AUTH_GOOGLE_SECRET!.toString(),
              grant_type: "refresh_token",
              refresh_token: token.refresh_token! as string,
            }),
            {
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          );

          const responseTokens = response.data;

          if (!responseTokens) throw new Error("Empty response tokens");

          return {
            // Keep the previous token properties
            ...token,
            access_token: responseTokens.access_token,
            expires_at: Math.floor(
              Date.now() / 1000 + (responseTokens.expires_in as number)
            ),
            // Only update the refresh token if a new one is provided in the response
            refresh_token: responseTokens.refresh_token || token.refresh_token,
          };
        } catch (error) {
          console.error("Error refreshing access token", error);
          // The error property can be used client-side to handle the refresh token error
          return { ...token, error: "RefreshAccessTokenError" as const };
        }
      }
    },
  },
});
