import { authOptions } from "./authOptions";
import NextAuth from "next-auth";

export const Auth = NextAuth(authOptions);

