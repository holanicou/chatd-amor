import { Server } from 'socket.io';
import { db } from '@/lib/db';

interface UserSocket extends Record<string, any> {
  userId?: string;
  username?: string;
}

export const setupSocket = (io: Server) => {
  // Store connected users
  const connectedUsers = new Map<string, UserSocket>();

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle user authentication
    socket.on('authenticate', async (data: { userId: string; username: string }) => {
      try {
        // Update user online status
        await db.user.update({
          where: { id: data.userId },
          data: { 
            isOnline: true,
            lastSeen: new Date()
          }
        });

        // Store user socket info
        connectedUsers.set(socket.id, {
          userId: data.userId,
          username: data.username
        });

        // Join user to their personal room
        socket.join(`user_${data.userId}`);

        // Broadcast user online status
        socket.broadcast.emit('user_status', {
          userId: data.userId,
          isOnline: true,
          lastSeen: new Date().toISOString()
        });

        console.log(`User ${data.username} authenticated with socket ${socket.id}`);
      } catch (error) {
        console.error('Authentication error:', error);
        socket.emit('error', { message: 'Authentication failed' });
      }
    });

    // Handle sending messages
    socket.on('send_message', async (data: {
      content: string;
      type: 'TEXT' | 'IMAGE' | 'FILE' | 'VOICE' | 'VIDEO';
      userId: string;
      fileUrl?: string;
      fileName?: string;
      fileSize?: number;
    }) => {
      try {
        const user = connectedUsers.get(socket.id);
        if (!user || !user.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Create message in database
        const message = await db.message.create({
          data: {
            content: data.content,
            type: data.type,
            fileUrl: data.fileUrl,
            fileName: data.fileName,
            fileSize: data.fileSize,
            userId: user.userId,
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  }
                }
              }
            }
          }
        });

        // Broadcast message to all connected clients
        io.emit('new_message', message);

        console.log(`Message sent by ${user.username}: ${data.content}`);
      } catch (error) {
        console.error('Message sending error:', error);
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicators
    socket.on('typing', (data: { isTyping: boolean; username: string }) => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        socket.broadcast.emit('user_typing', {
          username: data.username,
          isTyping: data.isTyping
        });
      }
    });

    // Handle adding reactions
    socket.on('add_reaction', async (data: { messageId: string; emoji: string; userId: string }) => {
      try {
        const user = connectedUsers.get(socket.id);
        if (!user || !user.userId) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        // Check if reaction already exists
        const existingReaction = await db.reaction.findUnique({
          where: {
            messageId_userId: {
              messageId: data.messageId,
              userId: user.userId
            }
          }
        });

        if (existingReaction) {
          // Update existing reaction
          await db.reaction.update({
            where: { id: existingReaction.id },
            data: { emoji: data.emoji }
          });
        } else {
          // Create new reaction
          await db.reaction.create({
            data: {
              emoji: data.emoji,
              messageId: data.messageId,
              userId: user.userId
            }
          });
        }

        // Get updated message with reactions
        const updatedMessage = await db.message.findUnique({
          where: { id: data.messageId },
          include: {
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  }
                }
              }
            }
          }
        });

        if (updatedMessage) {
          io.emit('message_updated', updatedMessage);
        }
      } catch (error) {
        console.error('Reaction error:', error);
        socket.emit('error', { message: 'Failed to add reaction' });
      }
    });

    // Handle message editing
    socket.on('edit_message', async (data: { messageId: string; content: string; userId: string }) => {
      try {
        const user = connectedUsers.get(socket.id);
        if (!user || !user.userId || user.userId !== data.userId) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        const updatedMessage = await db.message.update({
          where: { id: data.messageId },
          data: {
            content: data.content,
            isEdited: true,
            editedAt: new Date()
          },
          include: {
            user: {
              select: {
                id: true,
                username: true,
                name: true,
                avatar: true,
              }
            },
            reactions: {
              include: {
                user: {
                  select: {
                    id: true,
                    username: true,
                  }
                }
              }
            }
          }
        });

        io.emit('message_updated', updatedMessage);
      } catch (error) {
        console.error('Message editing error:', error);
        socket.emit('error', { message: 'Failed to edit message' });
      }
    });

    // Handle message deletion
    socket.on('delete_message', async (data: { messageId: string; userId: string }) => {
      try {
        const user = connectedUsers.get(socket.id);
        if (!user || !user.userId || user.userId !== data.userId) {
          socket.emit('error', { message: 'Unauthorized' });
          return;
        }

        await db.message.update({
          where: { id: data.messageId },
          data: { isDeleted: true }
        });

        io.emit('message_deleted', { messageId: data.messageId });
      } catch (error) {
        console.error('Message deletion error:', error);
        socket.emit('error', { message: 'Failed to delete message' });
      }
    });

    // Handle read receipts
    socket.on('mark_read', async (data: { messageId: string; userId: string }) => {
      try {
        const user = connectedUsers.get(socket.id);
        if (!user || !user.userId) {
          return;
        }

        // Check if read receipt already exists
        const existingReceipt = await db.readReceipt.findUnique({
          where: {
            messageId_userId: {
              messageId: data.messageId,
              userId: user.userId
            }
          }
        });

        if (!existingReceipt) {
          await db.readReceipt.create({
            data: {
              messageId: data.messageId,
              userId: user.userId
            }
          });

          // Notify message sender that their message was read
          const message = await db.message.findUnique({
            where: { id: data.messageId },
            include: {
              user: true
            }
          });

          if (message && message.user.id !== user.userId) {
            io.to(`user_${message.user.id}`).emit('message_read', {
              messageId: data.messageId,
              readBy: user.userId
            });
          }
        }
      } catch (error) {
        console.error('Read receipt error:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log('Client disconnected:', socket.id);
      
      const user = connectedUsers.get(socket.id);
      if (user && user.userId) {
        try {
          // Update user offline status
          await db.user.update({
            where: { id: user.userId },
            data: { 
              isOnline: false,
              lastSeen: new Date()
            }
          });

          // Remove user from connected users
          connectedUsers.delete(socket.id);

          // Broadcast user offline status
          socket.broadcast.emit('user_status', {
            userId: user.userId,
            isOnline: false,
            lastSeen: new Date().toISOString()
          });

          console.log(`User ${user.username} disconnected`);
        } catch (error) {
          console.error('Disconnect error:', error);
        }
      }
    });

    // Send welcome message
    socket.emit('connected', {
      message: 'Connected to Love Chat Server!',
      timestamp: new Date().toISOString()
    });
  });
};