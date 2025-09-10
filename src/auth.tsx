import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider  from "next-auth/providers/github"
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/login",
  },
  
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  debug: false,


  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

     async authorize(credentials): Promise<User | null> {
  try {
    const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: credentials?.email,
        password: credentials?.password,
      }),
    });

    const payload = await res.json();

    if (payload.message === "success" && payload.token) {
      const decode = JSON.parse(
        Buffer.from(payload.token.split(".")[1], "base64").toString()
      );

      return {
        id: String(decode.id),
        name: payload.user?.name ?? "",
        email: payload.user?.email ?? "",
        token: payload.token, // هيتسجل في jwt callback
      } as User;
    }

    // لو login فشل
    return null;
  } catch (error) {
    console.error("Authorize error:", error);
    return null; // مهم: عشان TypeScript ما يشتكيش
  }
}





    }),

   GithubProvider({
    clientId :  process.env.GITHUB_ID    as string  , 
    clientSecret  :process.env.GITHUB_SECRET   as  string 

  
  
  })

  ],
  secret: process.env.NEXTAUTH_SECRET,

  
  callbacks: {
async jwt({ token, user, account }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('JWT Callback - User:', user)
    console.log('JWT Callback - Account:', account)
    console.log('JWT Callback - Token before:', token)
  }
  
  // On first login (when user is provided)
  if (user) {
    token.id = user.id;
    token.name = user.name;
    token.email = user.email;
    token.role = user.role;
    token.image = user.image;
    
    // Only set token if it exists (for credentials provider)
    if (user.token) {
      token.token = user.token;
    }
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('JWT Callback - Token after:', token)
  }
  // Keep the token for subsequent requests
  return token;
},


    async session({ session, token }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('Session Callback - Token:', token)
    console.log('Session Callback - Session before:', session)
  }
  
  if (token) {
    session.user = {
      id: token.id as string,
      name: token.name as string,
      email: token.email as string,
      role: token.role as string | "",
      image: token.image as string | undefined,
      token: token.token as string | undefined,
    };
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log('Session Callback - Session after:', session)
  }
  return session;
}

  
  },
};


