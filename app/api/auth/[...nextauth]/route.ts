import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  secret: "hahahihihi",
  providers: [
    CredentialsProvider({
      type: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials){
        const { username, password } = credentials as {
          username: string;
          password: string;
        }
        if (username === "admin" && password === "sua") {
          return {
            id: "1",
            name: "Admin User",
            email: "admin@example.com",
            role: "admin"
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({token, user, account, profile}: any){
      if (user){
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role
      }
      return token;
    },

    async session({session, token}: any){
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      session.user.role = token.role;
      return session;
    }
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };