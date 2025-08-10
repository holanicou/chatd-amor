"use client"

import { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { io, Socket } from 'socket.io-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Heart, Send, MoreVertical, Smile, Paperclip, Mic, Image, Edit, Trash2, Download, File } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  username: string
  name?: string
  avatar?: string
  isOnline: boolean
  lastSeen?: string
}

interface Message {
  id: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'VIDEO'
  fileUrl?: string
  fileName?: string
  fileSize?: number
  isEdited: boolean
  isDeleted: boolean
  timestamp: string
  userId: string
  user: User
  reactions?: Reaction[]
}

interface Reaction {
  id: string
  emoji: string
  userId: string
  user: User
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUser, setTypingUser] = useState<string>('')
  const [otherUser, setOtherUser] = useState<User | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [editingMessage, setEditingMessage] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  
  const socketRef = useRef<Socket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Fetch other user (this would be dynamic in a real app)
      const fetchOtherUser = async () => {
        try {
          // For demo purposes, we'll get the first other user
          // In a real app, this would be based on user relationships
          const response = await fetch('/api/users/other')
          if (response.ok) {
            const userData = await response.json()
            setOtherUser(userData)
          } else {
            // Fallback for demo
            setOtherUser({
              id: '2',
              username: 'mi_amor',
              name: 'Mi Amor',
              avatar: '',
              isOnline: true,
              lastSeen: new Date().toISOString()
            })
          }
        } catch (error) {
          console.error('Error fetching other user:', error)
          // Fallback for demo
          setOtherUser({
            id: '2',
            username: 'mi_amor',
            name: 'Mi Amor',
            avatar: '',
            isOnline: true,
            lastSeen: new Date().toISOString()
          })
        }
      }

      fetchOtherUser()

      // Fetch initial messages
      const fetchMessages = async () => {
        try {
          const response = await fetch('/api/messages')
          if (response.ok) {
            const messagesData = await response.json()
            setMessages(messagesData)
          }
        } catch (error) {
          console.error('Error fetching messages:', error)
        }
      }

      fetchMessages()

      // Connect to Socket.IO
      socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000', {
        path: '/api/socketio',
        transports: ['websocket', 'polling']
      })

      const socket = socketRef.current

      socket.on('connect', () => {
        setIsConnected(true)
        if (session.user) {
          socket.emit('authenticate', {
            userId: session.user.id,
            username: session.user.username || session.user.name
          })
        }
        toast({
          title: "Conectado",
          description: "Chat conectado correctamente",
        })
      })

      socket.on('disconnect', () => {
        setIsConnected(false)
        toast({
          title: "Desconectado",
          description: "Conexión perdida",
          variant: "destructive",
        })
      })

      socket.on('new_message', (message: Message) => {
        setMessages(prev => [...prev, message])
        scrollToBottom()
      })

      socket.on('message_updated', (updatedMessage: Message) => {
        setMessages(prev => prev.map(msg => 
          msg.id === updatedMessage.id ? updatedMessage : msg
        ))
      })

      socket.on('message_deleted', (data: { messageId: string }) => {
        setMessages(prev => prev.map(msg => 
          msg.id === data.messageId ? { ...msg, isDeleted: true } : msg
        ))
      })

      socket.on('user_typing', (data: { username: string, isTyping: boolean }) => {
        setIsTyping(data.isTyping)
        setTypingUser(data.username)
      })

      socket.on('user_status', (data: { userId: string, isOnline: boolean, lastSeen?: string }) => {
        if (otherUser && data.userId === otherUser.id) {
          setOtherUser(prev => prev ? { ...prev, isOnline: data.isOnline, lastSeen: data.lastSeen } : null)
        }
      })

      return () => {
        socket.disconnect()
      }
    }
  }, [status, session, router, toast])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (newMessage.trim() && session?.user && socketRef.current) {
      if (editingMessage) {
        // Edit existing message
        socketRef.current.emit('edit_message', {
          messageId: editingMessage,
          content: newMessage,
          userId: session.user.id
        })
        setEditingMessage(null)
        setEditText('')
      } else {
        // Send new message
        socketRef.current.emit('send_message', {
          content: newMessage,
          type: 'TEXT',
          userId: session.user.id
        })
      }
      setNewMessage('')
      setIsTyping(false)
    }
  }

  const handleTyping = () => {
    if (socketRef.current && session?.user) {
      socketRef.current.emit('typing', { 
        isTyping: true, 
        username: session.user.username || session.user.name 
      })
      
      setTimeout(() => {
        if (socketRef.current) {
          socketRef.current.emit('typing', { 
            isTyping: false, 
            username: session.user.username || session.user.name 
          })
        }
      }, 1000)
    }
  }

  const handleEditMessage = (message: Message) => {
    setEditingMessage(message.id)
    setEditText(message.content)
    setNewMessage(message.content)
  }

  const handleDeleteMessage = (messageId: string) => {
    if (socketRef.current && session?.user) {
      socketRef.current.emit('delete_message', {
        messageId,
        userId: session.user.id
      })
    }
  }

  const addReaction = (messageId: string, emoji: string) => {
    if (socketRef.current && session?.user) {
      socketRef.current.emit('add_reaction', { 
        messageId, 
        emoji, 
        userId: session.user.id 
      })
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null // Will redirect to login
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <Card className="border-0 border-b rounded-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={otherUser?.avatar} alt={otherUser?.name} />
                  <AvatarFallback className="bg-pink-500 text-white">
                    {otherUser?.name?.charAt(0) || 'P'}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${otherUser?.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">
                  {otherUser?.name || 'Mi Amor'}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  {otherUser?.isOnline ? (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                      En línea
                    </Badge>
                  ) : (
                    <span className="text-xs text-gray-500">
                      Última vez {otherUser?.lastSeen ? formatTime(otherUser.lastSeen) : 'desconocido'}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 text-red-500" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.userId === session?.user?.id ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.userId === session?.user?.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                  } ${message.isDeleted ? 'opacity-50' : ''}`}
                >
                  <div className="flex items-start space-x-2">
                    <div className="flex-1">
                      {message.isDeleted ? (
                        <p className="text-sm italic">Mensaje eliminado</p>
                      ) : (
                        <>
                          {message.type === 'TEXT' && (
                            <p className="text-sm">{message.content}</p>
                          )}
                          {message.type === 'IMAGE' && message.fileUrl && (
                            <div className="space-y-2">
                              <img
                                src={message.fileUrl}
                                alt={message.fileName || "Imagen"}
                                className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => window.open(message.fileUrl, '_blank')}
                              />
                              {message.fileName && (
                                <p className="text-xs opacity-70">{message.fileName}</p>
                              )}
                            </div>
                          )}
                          {message.type === 'FILE' && message.fileUrl && (
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2 p-2 bg-black/5 rounded-lg">
                                <File className="h-6 w-6 text-blue-500" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">
                                    {message.fileName}
                                  </p>
                                  {message.fileSize && (
                                    <p className="text-xs opacity-70">
                                      {formatFileSize(message.fileSize)}
                                    </p>
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(message.fileUrl, '_blank')}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                          {message.isEdited && (
                            <span className="text-xs opacity-70">editado</span>
                          )}
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-70">
                              {formatTime(message.timestamp)}
                            </span>
                            {message.userId === session?.user?.id && (
                              <div className="flex space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleEditMessage(message)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleDeleteMessage(message.id)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {/* Reactions */}
                  {message.reactions && message.reactions.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {message.reactions.map((reaction) => (
                        <span
                          key={reaction.id}
                          className="text-xs bg-black/10 px-2 py-1 rounded-full cursor-pointer hover:bg-black/20"
                          onClick={() => addReaction(message.id, reaction.emoji)}
                        >
                          {reaction.emoji}
                        </span>
                      ))}
                    </div>
                  )}
                  {/* Quick reactions */}
                  {!message.isDeleted && (
                    <div className="flex gap-1 mt-2 opacity-0 hover:opacity-100 transition-opacity">
                      {['❤️', '😍', '😂', '😭', '👍'].map((emoji) => (
                        <button
                          key={emoji}
                          className="text-xs hover:bg-black/10 px-1 rounded"
                          onClick={() => addReaction(message.id, emoji)}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {isTyping && (
            <div className="text-sm text-gray-500 italic">
              {typingUser} está escribiendo...
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <Card className="border-0 border-t rounded-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Image className="h-5 w-5" />
            </Button>
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleTyping}
              placeholder="Escribe un mensaje..."
              className="flex-1"
            />
            <Button variant="ghost" size="sm">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="sm">
              <Mic className="h-5 w-5" />
            </Button>
            <Button 
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}