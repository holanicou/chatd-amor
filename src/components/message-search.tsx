"use client"

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

interface Message {
  id: string
  content: string
  type: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'VIDEO'
  fileUrl?: string
  fileName?: string
  timestamp: string
  user: {
    id: string
    username: string
    name?: string
  }
}

interface MessageSearchProps {
  messages: Message[]
  onMessageSelect: (messageId: string) => void
}

export function MessageSearch({ messages, onMessageSelect }: MessageSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredMessages([])
    } else {
      const filtered = messages.filter(message =>
        message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.fileName && message.fileName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setFilteredMessages(filtered)
    }
  }, [searchTerm, messages])

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMessagePreview = (message: Message) => {
    if (message.type === 'IMAGE') {
      return `📷 ${message.fileName || 'Imagen'}`
    }
    if (message.type === 'FILE') {
      return `📎 ${message.fileName || 'Archivo'}`
    }
    return message.content.length > 50 
      ? message.content.substring(0, 50) + '...' 
      : message.content
  }

  const highlightSearchTerm = (text: string, term: string) => {
    if (!term) return text
    
    const regex = new RegExp(`(${term})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </span>
      ) : part
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Search className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Buscar mensajes</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar en mensajes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              autoFocus
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="text-sm text-gray-500">
            {searchTerm && (
              <>
                {filteredMessages.length} resultado{filteredMessages.length !== 1 ? 's' : ''} 
                para "{searchTerm}"
              </>
            )}
          </div>

          <ScrollArea className="max-h-96">
            {filteredMessages.length > 0 ? (
              <div className="space-y-2">
                {filteredMessages.map((message) => (
                  <Card 
                    key={message.id} 
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => {
                      onMessageSelect(message.id)
                      setIsOpen(false)
                    }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start justify-between space-x-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="secondary" className="text-xs">
                              {message.user.name || message.user.username}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-gray-100">
                            {highlightSearchTerm(getMessagePreview(message), searchTerm)}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          {message.type === 'IMAGE' && (
                            <span className="text-lg">📷</span>
                          )}
                          {message.type === 'FILE' && (
                            <span className="text-lg">📎</span>
                          )}
                          {message.type === 'TEXT' && (
                            <span className="text-lg">💬</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No se encontraron mensajes</p>
                <p className="text-sm">Intenta con otras palabras clave</p>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Busca en tus conversaciones</p>
                <p className="text-sm">Escribe una palabra o frase para encontrar mensajes</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}