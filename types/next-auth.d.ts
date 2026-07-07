import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      companyId: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    companyId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string;
    companyId: string;
  }
}