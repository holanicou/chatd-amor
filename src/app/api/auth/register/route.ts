import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const { username, name, email, password } = await request.json()

    // Check if user already exists
    const existingUser = await db.user.findFirst({
      where: {
        OR: [
          { username },
          { email: email || undefined }
        ]
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "El usuario o email ya existe" },
        { status: 400 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12)

    // Create user
    const user = await db.user.create({
      data: {
        username,
        name,
        email,
        passwordHash,
        isOnline: false,
      },
      select: {
        id: true,
        username: true,
        name: true,
        email: true,
        createdAt: true,
      }
    })

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "Error al crear el usuario" },
      { status: 500 }
    )
  }
}