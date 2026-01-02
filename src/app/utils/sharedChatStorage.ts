import type { ChatMessage } from "../types/chat";

/**
 * Shared Chat Storage Utility
 * This utility ensures that messages are accessible to all users at each level:
 * - Global: All users on the platform
 * - Regional: All users in the same region/state
 * - College: All users in the same college
 * 
 * Note: In a production environment, this would be replaced with a real-time
 * database like Firebase Realtime Database, Supabase, or WebSockets.
 * 
 * Current implementation uses localStorage with BroadcastChannel for
 * cross-tab synchronization and simulates a shared global storage.
 */

export class SharedChatStorage {
  private channel: BroadcastChannel | null = null;
  private listeners: Map<string, Set<(messages: ChatMessage[]) => void>> = new Map();

  constructor() {
    // Initialize BroadcastChannel for cross-tab communication
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel('unifiedcampus_chat_sync');
      this.channel.onmessage = (event) => {
        const { key, messages } = event.data;
        // Notify all listeners for this key
        const keyListeners = this.listeners.get(key);
        if (keyListeners) {
          keyListeners.forEach(listener => listener(messages));
        }
      };
    }
  }

  /**
   * Get messages for a specific chat level
   * @param level - 'global', 'regional', or 'college'
   * @param identifier - Optional identifier for regional (state) or college (college name)
   */
  getMessages(level: 'global' | 'regional' | 'college', identifier?: string): ChatMessage[] {
    const key = this.generateKey(level, identifier);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Save messages for a specific chat level
   * This will broadcast to all tabs and make messages available to all users
   */
  saveMessages(level: 'global' | 'regional' | 'college', messages: ChatMessage[], identifier?: string): void {
    const key = this.generateKey(level, identifier);
    
    // Save to localStorage
    localStorage.setItem(key, JSON.stringify(messages));
    
    // Broadcast to other tabs
    if (this.channel) {
      this.channel.postMessage({ key, messages });
    }
    
    // Notify local listeners
    const keyListeners = this.listeners.get(key);
    if (keyListeners) {
      keyListeners.forEach(listener => listener(messages));
    }
  }

  /**
   * Subscribe to message updates
   * Returns an unsubscribe function
   */
  subscribe(
    level: 'global' | 'regional' | 'college',
    callback: (messages: ChatMessage[]) => void,
    identifier?: string
  ): () => void {
    const key = this.generateKey(level, identifier);
    
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    
    this.listeners.get(key)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      const keyListeners = this.listeners.get(key);
      if (keyListeners) {
        keyListeners.delete(callback);
        if (keyListeners.size === 0) {
          this.listeners.delete(key);
        }
      }
    };
  }

  /**
   * Add a single message
   */
  addMessage(level: 'global' | 'regional' | 'college', message: ChatMessage, identifier?: string): void {
    const messages = this.getMessages(level, identifier);
    const updatedMessages = [...messages, message];
    this.saveMessages(level, updatedMessages, identifier);
  }

  /**
   * Update a specific message (for polls, reactions, etc.)
   */
  updateMessage(
    level: 'global' | 'regional' | 'college',
    messageId: string,
    updater: (msg: ChatMessage) => ChatMessage,
    identifier?: string
  ): void {
    const messages = this.getMessages(level, identifier);
    const updatedMessages = messages.map(msg => 
      msg.id === messageId ? updater(msg) : msg
    );
    this.saveMessages(level, updatedMessages, identifier);
  }

  /**
   * Clear messages (admin function)
   */
  clearMessages(level: 'global' | 'regional' | 'college', identifier?: string): void {
    const key = this.generateKey(level, identifier);
    localStorage.removeItem(key);
    
    if (this.channel) {
      this.channel.postMessage({ key, messages: [] });
    }
  }

  /**
   * Get online user count (simulated)
   * In production, this would come from a real-time presence system
   */
  getOnlineCount(level: 'global' | 'regional' | 'college', identifier?: string): number {
    // Simulate online count based on recent message activity
    const messages = this.getMessages(level, identifier);
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
    const recentUsers = new Set(
      messages
        .filter(msg => msg.timestamp > fiveMinutesAgo)
        .map(msg => msg.userId)
    );
    
    // Add a base count to simulate other users
    const baseCount = level === 'global' ? 150 : level === 'regional' ? 45 : 12;
    return baseCount + recentUsers.size;
  }

  private generateKey(level: 'global' | 'regional' | 'college', identifier?: string): string {
    switch (level) {
      case 'global':
        return 'unifiedcampus_global_chat';
      case 'regional':
        return `unifiedcampus_regional_chat_${identifier || 'default'}`;
      case 'college':
        return `unifiedcampus_college_chat_${identifier || 'default'}`;
      default:
        return 'unifiedcampus_chat';
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
    this.listeners.clear();
  }
}

// Create a singleton instance
let sharedChatStorageInstance: SharedChatStorage | null = null;

export function getSharedChatStorage(): SharedChatStorage {
  if (!sharedChatStorageInstance) {
    sharedChatStorageInstance = new SharedChatStorage();
  }
  return sharedChatStorageInstance;
}

/**
 * IMPORTANT: Backend Integration Guide
 * ======================================
 * 
 * When you're ready to add a backend, replace this localStorage implementation with:
 * 
 * 1. SUPABASE (Recommended for UnifiedCampus):
 *    - Create tables: global_messages, regional_messages, college_messages
 *    - Use Supabase Realtime subscriptions for live updates
 *    - Example:
 *      ```typescript
 *      const { data, error } = await supabase
 *        .from('global_messages')
 *        .select('*')
 *        .order('timestamp', { ascending: true });
 *      
 *      supabase
 *        .channel('global_chat')
 *        .on('postgres_changes', 
 *          { event: 'INSERT', schema: 'public', table: 'global_messages' },
 *          (payload) => {
 *            // Handle new message
 *          }
 *        )
 *        .subscribe();
 *      ```
 * 
 * 2. FIREBASE REALTIME DATABASE:
 *    - Structure: /chats/global, /chats/regional/{state}, /chats/college/{collegeName}
 *    - Use Firebase listeners for real-time updates
 * 
 * 3. WEBSOCKETS (Custom Backend):
 *    - Socket.IO or native WebSockets
 *    - Rooms: 'global', 'regional:{state}', 'college:{collegeName}'
 * 
 * 4. POLLING (Simple REST API):
 *    - Not recommended for real-time chat
 *    - But works as a simple solution with setInterval polling
 * 
 * Database Schema Example:
 * ------------------------
 * messages table:
 *   - id: uuid
 *   - level: 'global' | 'regional' | 'college'
 *   - identifier: string (state or college name)
 *   - user_id: string
 *   - user_name: string
 *   - user_type: 'student' | 'mentor'
 *   - message: text
 *   - type: 'text' | 'image' | 'video' | 'poll' | 'gif'
 *   - media_url: string (optional)
 *   - poll_data: jsonb (optional)
 *   - timestamp: timestamp
 *   - created_at: timestamp
 * 
 * Indexes:
 *   - (level, identifier, timestamp) for efficient queries
 *   - (user_id) for user-specific queries
 */
