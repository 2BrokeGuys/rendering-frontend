import { saveUserToDB } from "@/app/actions";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user }) {
      const { error } = await saveUserToDB(user);

      if (!error) return true;

      return false;
    },
    /* eslint-disable */
    async session({ session, token }: { session: any; token: JWT }) {
      session.user.id = token.sub;
      return session;
    },
  },
};
