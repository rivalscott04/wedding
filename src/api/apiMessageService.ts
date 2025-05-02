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
      // Selalu gunakan API, tidak ada fallback ke localStorage
      const response = await fetch(`/api/wedding/messages`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        console.error(`Failed to fetch messages: ${response.status}`);
        return []; // Return empty array instead of falling back to localStorage
      }

      const data = await response.json();
      console.log('Messages fetched successfully:', data);
      return data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      return []; // Return empty array instead of falling back to localStorage
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
      // Format data sesuai dengan format yang diharapkan API
      const messageData = {
        name: message.name,
        message: message.message,
        is_attending: true // true untuk "Hadir", false untuk "Tidak Hadir"
      };

      console.log('Sending message data to API:', messageData);

      // Selalu gunakan API, tidak ada fallback ke localStorage
      const response = await fetch(`/api/wedding/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(messageData)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to add message: ${response.status}`);
      }

      const data = await response.json();
      console.log('Message added successfully:', data);
      return data;
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
      // Selalu gunakan API, tidak ada fallback ke localStorage
      const response = await fetch(`/api/wedding/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`Failed to delete message: ${response.status}`);
      }

      console.log('Message deleted successfully');
    } catch (error) {
      console.error('Error deleting message:', error);
      throw error;
    }
  }
};
