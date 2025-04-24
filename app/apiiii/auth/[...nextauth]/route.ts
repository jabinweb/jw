import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// Define the shape of your auth options, and ensure they are type-safe
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string, // Enforce type safety for environment variables
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, // Enforce type safety for environment variables
      authorization: {
        params: {
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`, // Ensure this matches the Google Developer Console
        },
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin", // Custom sign-in page URL
  },
  callbacks: {
    // Optional: add type-safe callbacks for better session handling
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.accessToken) {
        session.user.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
