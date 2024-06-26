// next-auth.d.ts

import NextAuth from "next-auth";

declare module "next-auth" {
  export interface Session {
    accessToken: string;
    refreshToken: string;
    error?: "RefreshAccessTokenError";
    // user: {
    //   image: any;
    //   name: ReactNode;
    //   id: string;
    //   email: string;
    //   emailVerified: null;
    // };
  }

  export interface JWT {
    expires_at: number;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: number;
    error?: string;
  }
}
