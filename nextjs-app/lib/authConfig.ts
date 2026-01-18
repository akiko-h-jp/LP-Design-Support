import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const adminEmail = process.env.ADMIN_EMAIL;
        let adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
        
        // 引用符が含まれている場合は削除
        if (adminPasswordHash) {
          if (adminPasswordHash.startsWith('"') && adminPasswordHash.endsWith('"')) {
            adminPasswordHash = adminPasswordHash.slice(1, -1);
          } else if (adminPasswordHash.startsWith("'") && adminPasswordHash.endsWith("'")) {
            adminPasswordHash = adminPasswordHash.slice(1, -1);
          }
          // $がエスケープされている場合は元に戻す（\$ -> $ または $$ -> $）
          adminPasswordHash = adminPasswordHash.replace(/\\\$/g, '$').replace(/\$\$/g, '$');
        }

        if (!adminEmail || !adminPasswordHash) {
          return null;
        }

        if (email !== adminEmail) {
          return null;
        }
        
        const isPasswordValid = await bcrypt.compare(
          password,
          adminPasswordHash
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: '1',
          email: adminEmail,
          name: 'Designer',
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
};

export const { auth, handlers } = NextAuth(authOptions);
