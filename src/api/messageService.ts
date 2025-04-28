import { Message } from '@/types/message';
import { query, isUsingLocalStorage } from '@/lib/db';
import { getLocalMessages, saveLocalMessages, generateId } from '@/data/mockData';

export const messageService = {
  // Fetch all messages
  getMessages: async (): Promise<Message[]> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        return getLocalMessages();
      }

      const messages = await query(
        'SELECT * FROM messages ORDER BY created_at DESC',
        []
      ) as Message[];

      return messages;
    } catch (error) {
      // Fallback to localStorage
      return getLocalMessages();
    }
  },

  // Add a new message
  addMessage: async (message: Omit<Message, 'id' | 'created_at'>): Promise<Message> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const newMessage: Message = {
          ...message,
          id: generateId(),
          created_at: new Date().toISOString()
        };

        const messages = getLocalMessages();
        saveLocalMessages([newMessage, ...messages]);

        return newMessage;
      }

      const result = await query(
        'INSERT INTO messages (name, message) VALUES (?, ?)',
        [message.name, message.message]
      ) as { insertId: number };

      const newMessage = await query(
        'SELECT * FROM messages WHERE id = ?',
        [result.insertId]
      ) as Message[];

      return newMessage[0];
    } catch (error) {
      // Fallback to localStorage
      const newMessage: Message = {
        ...message,
        id: generateId(),
        created_at: new Date().toISOString()
      };

      const messages = getLocalMessages();
      saveLocalMessages([newMessage, ...messages]);

      return newMessage;
    }
  },

  // Delete a message
  deleteMessage: async (id: number): Promise<void> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const messages = getLocalMessages();
        const filteredMessages = messages.filter(message => message.id !== id);
        saveLocalMessages(filteredMessages);
        return;
      }

      await query(
        'DELETE FROM messages WHERE id = ?',
        [id]
      );
    } catch (error) {
      // Fallback to localStorage
      const messages = getLocalMessages();
      const filteredMessages = messages.filter(message => message.id !== id);
      saveLocalMessages(filteredMessages);
    }
  },

  // Get message count
  getMessageCount: async (): Promise<number> => {
    try {
      // Check if we're using localStorage
      if (isUsingLocalStorage()) {
        const messages = getLocalMessages();
        return messages.length;
      }

      const result = await query(
        'SELECT COUNT(*) as count FROM messages',
        []
      ) as [{ count: number }];

      return result[0].count;
    } catch (error) {
      // Fallback to localStorage
      const messages = getLocalMessages();
      return messages.length;
    }
  }
};
