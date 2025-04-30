import { Message } from '@/types/message';
import { getLocalMessages, saveLocalMessages, generateId } from '@/data/mockData';

// Using proxy to avoid CORS issues

// Check if API is available
const isApiAvailable = async (): Promise<boolean> => {
  try {
    const response = await fetch(`/api/wedding/messages`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      // Add a timeout to avoid long waits
      signal: AbortSignal.timeout(3000)
    });
    return response.ok;
  } catch (error) {
    console.warn('API not available, falling back to localStorage:', error);
    return false;
  }
};

export const apiMessageService = {
  // Fetch all messages
  getMessages: async (): Promise<Message[]> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/messages`);
          if (!response.ok) {
            throw new Error(`Failed to fetch messages: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for getMessages');
      return getLocalMessages();
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Fallback to localStorage in case of any error
      return getLocalMessages();
    }
  },

  // Get a single message by ID
  getMessageById: async (id: number): Promise<Message | null> => {
    try {
      const response = await fetch(`/api/wedding/messages/${id}`);
      if (response.status === 404) {
        return null;
      }
      if (!response.ok) {
        throw new Error(`Failed to fetch message: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching message by ID:', error);
      throw error;
    }
  },

  // Get messages by guest ID
  getMessagesByGuestId: async (guestId: number): Promise<Message[]> => {
    try {
      const response = await fetch(`/api/wedding/messages/guest/${guestId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch messages: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching messages by guest ID:', error);
      throw error;
    }
  },

  // Add a new message
  addMessage: async (message: Omit<Message, 'id' | 'created_at'>): Promise<Message> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/messages`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
          });
          if (!response.ok) {
            throw new Error(`Failed to add message: ${response.status}`);
          }
          const data = await response.json();
          return data;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for addMessage');
      const newMessage: Message = {
        ...message,
        id: generateId(),
        created_at: new Date().toISOString()
      };

      const messages = getLocalMessages();
      saveLocalMessages([newMessage, ...messages]);

      return newMessage;
    } catch (error) {
      console.error('Error adding message:', error);
      throw error;
    }
  },

  // Update a message
  updateMessage: async (message: Message): Promise<Message> => {
    try {
      const response = await fetch(`/api/wedding/messages/${message.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });
      if (!response.ok) {
        throw new Error(`Failed to update message: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating message:', error);
      throw error;
    }
  },

  // Delete a message
  deleteMessage: async (id: number): Promise<void> => {
    try {
      // Check if API is available
      const apiAvailable = await isApiAvailable();

      if (apiAvailable) {
        // Try to use the API
        try {
          const response = await fetch(`/api/wedding/messages/${id}`, {
            method: 'DELETE'
          });
          if (!response.ok) {
            throw new Error(`Failed to delete message: ${response.status}`);
          }
          return;
        } catch (apiError) {
          console.warn('API call failed, falling back to localStorage:', apiError);
          // Fall back to localStorage if API call fails
        }
      }

      // Fallback to localStorage
      console.log('Using localStorage fallback for deleteMessage');
      const messages = getLocalMessages();
      const index = messages.findIndex(m => m.id === id);

      if (index === -1) {
        throw new Error('Message not found');
      }

      messages.splice(index, 1);
      saveLocalMessages(messages);
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};
