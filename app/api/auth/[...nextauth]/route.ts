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
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username dan password diperlukan");
        }

        try {
          const res = await fetch("http://localhost:2000/api/auth-employe", {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password
            })
          })
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.massage || "Login gagal");
          }

          // Data dari Express API
          const userData = data.data;

          // Return user data yang akan disimpan di token
          return {
            id: userData.id.toString(),
            username: userData.username,
            role: userData.role,
            karyawan: userData.karyawan // Simpan seluruh data karyawan
          };
        } catch (error: any) {
          console.error("Authorize error:", error);
          throw new Error(error.message || "Terjadi kesalahan saat login");
        }
        
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
        token.karyawan = user.karyawan;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.karyawan = token.karyawan as any;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/login'
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };