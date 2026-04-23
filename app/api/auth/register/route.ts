import { NextRequest, NextResponse } from 'next/server'
import connectDB, { isDBMockMode } from '@/lib/mongodb'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { fullName, email, password, phone, dateOfBirth, gender, category } = body

    await connectDB()

    if (isDBMockMode()) {
      // Mock mode: just return success without DB
      return NextResponse.json(
        {
          success: true,
          message: 'Registration successful! Please login.',
          user: {
            id: 'mock-user-id',
            fullName: fullName || 'Mock User',
            email: email || 'user@example.com'
          }
        },
        { status: 201 }
      )
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists with this email' },
        { status: 400 }
      )
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phone: phone || '',
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      gender: gender || '',
      category: category || '',
      role: 'user',
      verificationStatus: 'pending'
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Please login.',
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email
        }
      },
      { status: 201 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    )
  }
}
