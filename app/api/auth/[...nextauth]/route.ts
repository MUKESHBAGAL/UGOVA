import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await connectDB()
        
        const user = await User.findOne({ email: credentials.email }).select('+password')
        
        if (!user) {
          return null
        }

        const isPasswordMatch = await bcrypt.compare(credentials.password, user.password)
        
        if (!isPasswordMatch) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
          verificationStatus: user.verificationStatus,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.verificationStatus = user.verificationStatus
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
        session.user.verificationStatus = token.verificationStatus
      }
      return session
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  }
})

export { handler as GET, handler as POST }
