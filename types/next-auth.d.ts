import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      verificationStatus: string
    }
  }

  interface User {
    role: string
    verificationStatus: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string
    verificationStatus?: string
  }
}
