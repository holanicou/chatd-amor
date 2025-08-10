"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Heart, MessageCircle, Users, Lock, Sparkles, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/chat')
    }
  }, [status, router])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 via-purple-400/20 to-indigo-400/20"></div>
        <div className="relative container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <Heart className="h-20 w-20 text-pink-500 animate-pulse" />
                <div className="absolute inset-0 bg-pink-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
              Chat del Amor
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Un espacio privado y especial solo para ustedes 💕
            </p>
            <p className="text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
              Crea un chat romántico y privado con todas las funciones modernas para compartir momentos especiales con tu pareja.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-semibold px-8 py-4 text-lg">
                  Crear Nuestro Chat
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-4 text-lg">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Todo lo que necesitan para su chat privado
            </h2>
            <p className="text-xl text-gray-600">
              Diseñado especialmente para parejas 💖
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-pink-100 rounded-full">
                    <MessageCircle className="h-8 w-8 text-pink-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Mensajes en tiempo real</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Chatea instantáneamente con tu pareja. Ve cuando están escribiendo y recibe notificaciones al instante.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Lock className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Totalmente privado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Solo ustedes dos tienen acceso. Su chat es seguro y privado, sin intrusos ni anuncios.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <Sparkles className="h-8 w-8 text-indigo-600" />
                  </div>
                </div>
                <CardTitle className="text-xl">Funciones modernas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Comparte fotos, archivos, reacciones con emojis, edita mensajes y mucho más.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Fácil y rápido en 3 pasos 💝
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-3">Regístrate tú</h3>
                <p className="text-gray-600">
                  Crea tu cuenta con tu nombre de usuario y contraseña. Solo toma un minuto.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-3">Tu pareja se registra</h3>
                <p className="text-gray-600">
                  Comparte el enlace con tu pareja para que también cree su cuenta.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-3">¡A chatear!</h3>
                <p className="text-gray-600">
                  Comiencen a compartir mensajes, fotos y momentos especiales privados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            ¿Listos para crear su chat privado?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Es hora de tener un espacio especial solo para ustedes 💕
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="bg-white text-pink-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg">
              Crear nuestro chat ahora
              <Heart className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <Heart className="h-8 w-8 text-pink-500" />
          </div>
          <p className="text-gray-400">
            Hecho con ❤️ para parejas que quieren mantener su conexión especial
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 Chat del Amor. Privado y seguro para ustedes.
          </p>
        </div>
      </footer>
    </div>
  )
}