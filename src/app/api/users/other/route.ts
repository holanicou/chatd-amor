import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ message: "No autorizado" }, { status: 401 })
    }

    // Get the current user
    const currentUser = await db.user.findUnique({
      where: { id: session.user.id }
    })

    if (!currentUser) {
      return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 })
    }

    // Get the other user (for demo purposes, we'll get the first other user)
    // In a real app, this would be based on user relationships or partnerships
    const otherUser = await db.user.findFirst({
      where: {
        id: {
          not: session.user.id
        }
      },
      select: {
        id: true,
        username: true,
        name: true,
        avatar: true,
        isOnline: true,
        lastSeen: true
      }
    })

    if (!otherUser) {
      // If no other user exists, return a default one for demo
      return NextResponse.json({
        id: '2',
        username: 'mi_amor',
        name: 'Mi Amor',
        avatar: '',
        isOnline: false,
        lastSeen: new Date().toISOString()
      })
    }

    return NextResponse.json(otherUser)
  } catch (error) {
    console.error("Error fetching other user:", error)
    return NextResponse.json(
      { message: "Error al obtener el usuario" },
      { status: 500 }
    )
  }
}