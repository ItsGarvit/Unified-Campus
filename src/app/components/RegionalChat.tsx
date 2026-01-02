import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Users, MapPin, Settings, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import { getSharedChatStorage } from "../utils/sharedChatStorage";
import type { ChatMessage as ChatMessageType, PollData, SlowModeSettings } from "../types/chat";

const REGIONAL_SLOWMODE_KEY = 'unifiedcampus_regional_slowmode';

export function RegionalChat({ isDarkMode }: { isDarkMode: boolean }) {
  const { user } = useAuth();
  const chatStorage = getSharedChatStorage();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [slowMode, setSlowMode] = useState<SlowModeSettings>({
    enabled: false,
    interval: 10,
    lastMessageTime: {}
  });
  const [slowModeRemaining, setSlowModeRemaining] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  useEffect(() => {
    if (!user?.region) return;

    // Load initial messages for this region
    const initialMessages = chatStorage.getMessages('regional', user.region);
    setMessages(initialMessages);
    
    // Subscribe to message updates for this region (works across all users in this region)
    const unsubscribe = chatStorage.subscribe('regional', (updatedMessages) => {
      setMessages(updatedMessages);
    }, user.region);
    
    loadSlowMode();
    
    // Update online count and slow mode timer
    const interval = setInterval(() => {
      if (user?.region) {
        setOnlineCount(chatStorage.getOnlineCount('regional', user.region));
      }
      updateSlowModeTimer();
    }, 1000);
    
    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user?.region]);

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  const loadSlowMode = () => {
    const stored = localStorage.getItem(REGIONAL_SLOWMODE_KEY);
    if (stored) {
      setSlowMode(JSON.parse(stored));
    }
  };

  const saveSlowMode = (newSettings: SlowModeSettings) => {
    localStorage.setItem(REGIONAL_SLOWMODE_KEY, JSON.stringify(newSettings));
    setSlowMode(newSettings);
  };

  const updateSlowModeTimer = () => {
    if (!slowMode.enabled || !user) {
      setSlowModeRemaining(0);
      return;
    }

    const lastTime = slowMode.lastMessageTime[user.id] || 0;
    const elapsed = (Date.now() - lastTime) / 1000;
    const remaining = Math.max(0, Math.ceil(slowMode.interval - elapsed));
    setSlowModeRemaining(remaining);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    
    setShouldAutoScroll(isNearBottom);
  };

  const canSendMessage = () => {
    if (!slowMode.enabled || !user) return true;
    const lastTime = slowMode.lastMessageTime[user.id] || 0;
    const elapsed = (Date.now() - lastTime) / 1000;
    return elapsed >= slowMode.interval;
  };

  const handleSendMessage = (
    messageText: string, 
    type: 'text' | 'image' | 'video' | 'poll' | 'gif', 
    mediaUrl?: string, 
    pollData?: PollData
  ) => {
    if (!user || !user.region || !canSendMessage()) return;

    const message: ChatMessageType = {
      id: `${Date.now()}_${Math.random()}`,
      userId: user.id,
      userName: user.fullName,
      userType: user.userType,
      message: messageText,
      timestamp: Date.now(),
      type,
      mediaUrl,
      pollData,
      region: user.region
    };

    chatStorage.addMessage('regional', message, user.region);
    
    // Update slow mode timer
    if (slowMode.enabled) {
      const newSlowMode = {
        ...slowMode,
        lastMessageTime: {
          ...slowMode.lastMessageTime,
          [user.id]: Date.now()
        }
      };
      saveSlowMode(newSlowMode);
    }
  };

  const handleVotePoll = (messageId: string, optionId: string) => {
    if (!user || !user.region) return;

    chatStorage.updateMessage('regional', messageId, (msg) => {
      if (msg.pollData) {
        // Check if user already voted
        if (msg.pollData.votedUsers.includes(user.id)) {
          return msg;
        }

        // Update poll data
        const updatedPollData = {
          ...msg.pollData,
          options: msg.pollData.options.map(opt =>
            opt.id === optionId
              ? { ...opt, votes: opt.votes + 1 }
              : opt
          ),
          totalVotes: msg.pollData.totalVotes + 1,
          votedUsers: [...msg.pollData.votedUsers, user.id]
        };

        return { ...msg, pollData: updatedPollData };
      }
      return msg;
    }, user.region);
  };

  const toggleSlowMode = () => {
    const newSettings = {
      ...slowMode,
      enabled: !slowMode.enabled
    };
    saveSlowMode(newSettings);
  };

  const updateSlowModeInterval = (interval: number) => {
    const newSettings = {
      ...slowMode,
      interval
    };
    saveSlowMode(newSettings);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div className={`flex-shrink-0 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Regional Community</h2>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Connect with students in {user?.region || 'your region'}
                {slowMode.enabled && (
                  <span className="ml-2 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Slow mode: {slowMode.interval}s
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-lg ${
              isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            } transition-colors`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-4 p-4 rounded-xl ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}
          >
            <h3 className="font-semibold mb-3">Chat Settings</h3>
            
            {/* Slow Mode Toggle */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">Slow Mode</p>
                <p className="text-sm text-gray-500">Limit how often users can send messages</p>
              </div>
              <button
                onClick={toggleSlowMode}
                className={`w-14 h-7 rounded-full transition-colors ${
                  slowMode.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                  slowMode.enabled ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* Slow Mode Interval */}
            {slowMode.enabled && (
              <div>
                <label className="block text-sm font-medium mb-2">
                  Message Interval: {slowMode.interval} seconds
                </label>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={slowMode.interval}
                  onChange={(e) => updateSlowModeInterval(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5s</span>
                  <span>60s</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4" ref={messagesContainerRef} onScroll={handleScroll}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MapPin className="w-16 h-16 mb-4 opacity-20" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              isDarkMode={isDarkMode}
              isOwn={msg.userId === user?.id}
              onVotePoll={handleVotePoll}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-6`}>
        <ChatInput
          isDarkMode={isDarkMode}
          onSendMessage={handleSendMessage}
          disabled={!user || !user.region}
          slowModeActive={slowMode.enabled && slowModeRemaining > 0}
          slowModeRemaining={slowModeRemaining}
        />
      </div>
    </div>
  );
}