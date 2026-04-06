import { authOptions } from "@/app/libs/helper/auth";
import NextAuth from "next-auth";



const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

