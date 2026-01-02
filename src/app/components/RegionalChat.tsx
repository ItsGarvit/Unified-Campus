import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Users, MapPin, Settings, Clock } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { ChatInput } from "./ChatInput";
import { ChatMessage } from "./ChatMessage";
import type {
  ChatMessage as ChatMessageType,
  PollData,
  SlowModeSettings,
} from "../types/chat";

// Firebase imports
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../config/firebase";

const REGIONAL_SLOWMODE_KEY = "unifiedcampus_regional_slowmode";

export function RegionalChat({ isDarkMode }: { isDarkMode: boolean }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [onlineCount, setOnlineCount] = useState(1);
  const [slowMode, setSlowMode] = useState<SlowModeSettings>({
    enabled: false,
    interval: 10,
    lastMessageTime: {},
  });
  const [slowModeRemaining, setSlowModeRemaining] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Firebase real-time listener for regional messages
  useEffect(() => {
    // Use state field for regional filtering (fallback to region if state not available)
    const userRegion = user?.state || user?.region;
    if (!userRegion) return;

    // Query messages for this specific region/state
    // Note: Not using orderBy in query to avoid needing a composite index
    // We sort client-side instead
    const q = query(
      collection(db, "regional_chat"),
      where("state", "==", userRegion)
    );

    // Listen for real-time updates
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveMessages = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          userName: data.userName,
          userType: data.userType,
          message: data.message,
          timestamp: data.createdAt?.toMillis() || Date.now(),
          type: data.type,
          mediaUrl: data.mediaUrl,
          pollData: data.pollData,
          region: data.state,
        } as ChatMessageType;
      });
      // Sort messages by timestamp client-side (ascending order - oldest first)
      liveMessages.sort((a, b) => a.timestamp - b.timestamp);
      setMessages(liveMessages);
    }, (error) => {
      console.error("RegionalChat snapshot error:", error);
    });

    loadSlowMode();

    // Timer for slow mode
    const interval = setInterval(() => {
      updateSlowModeTimer();
    }, 1000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [user?.state, user?.region]);

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

    const { scrollTop, scrollHeight, clientHeight } =
      messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShouldAutoScroll(isNearBottom);
  };

  const canSendMessage = () => {
    if (!slowMode.enabled || !user) return true;
    const lastTime = slowMode.lastMessageTime[user.id] || 0;
    const elapsed = (Date.now() - lastTime) / 1000;
    return elapsed >= slowMode.interval;
  };

  // Send message to Firebase
  const handleSendMessage = async (
    messageText: string,
    type: "text" | "image" | "video" | "poll" | "gif",
    mediaUrl?: string,
    pollData?: PollData
  ) => {
    const userRegion = user?.state || user?.region;
    if (!user || !userRegion || !canSendMessage()) return;

    try {
      // Add document to regional_chat collection
      await addDoc(collection(db, "regional_chat"), {
        userId: user.id,
        userName: user.fullName,
        userType: user.userType,
        message: messageText,
        state: userRegion, // Filter key for regional messages
        createdAt: serverTimestamp(),
        type,
        mediaUrl: mediaUrl || null,
        pollData: pollData || null,
      });

      // Update slow mode locally
      if (slowMode.enabled) {
        const newSlowMode = {
          ...slowMode,
          lastMessageTime: {
            ...slowMode.lastMessageTime,
            [user.id]: Date.now(),
          },
        };
        saveSlowMode(newSlowMode);
      }
    } catch (error) {
      console.error("Error sending regional message:", error);
      alert("Failed to send message. Check console for details.");
    }
  };

  // Handle poll voting with Firebase
  const handleVotePoll = async (messageId: string, optionId: string) => {
    if (!user) return;

    const messageToUpdate = messages.find((m) => m.id === messageId);
    if (!messageToUpdate || !messageToUpdate.pollData) return;

    if (messageToUpdate.pollData.votedUsers.includes(user.id)) {
      return; // User already voted
    }

    const newOptions = messageToUpdate.pollData.options.map((opt) =>
      opt.id === optionId ? { ...opt, votes: opt.votes + 1 } : opt
    );

    try {
      const msgRef = doc(db, "regional_chat", messageId);
      await updateDoc(msgRef, {
        "pollData.options": newOptions,
        "pollData.totalVotes": messageToUpdate.pollData.totalVotes + 1,
        "pollData.votedUsers": arrayUnion(user.id),
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  // Edit message handler
  const handleEditMessage = async (messageId: string, newText: string) => {
    if (!user) return;
    
    try {
      const msgRef = doc(db, "regional_chat", messageId);
      await updateDoc(msgRef, {
        message: newText,
        isEdited: true
      });
    } catch (error) {
      console.error("Error editing message:", error);
    }
  };

  // Delete message handler
  const handleDeleteMessage = async (messageId: string) => {
    if (!user) return;
    
    try {
      const msgRef = doc(db, "regional_chat", messageId);
      await deleteDoc(msgRef);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const toggleSlowMode = () => {
    const newSettings = {
      ...slowMode,
      enabled: !slowMode.enabled,
    };
    saveSlowMode(newSettings);
  };

  const updateSlowModeInterval = (interval: number) => {
    const newSettings = {
      ...slowMode,
      interval,
    };
    saveSlowMode(newSettings);
  };

  const userRegion = user?.state || user?.region;

  return (
    <div className="h-full flex flex-col">
      {/* Header - Fixed */}
      <div
        className={`flex-shrink-0 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-b p-6`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Regional Community</h2>
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Connect with students in {userRegion || "your region"}
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
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
            } transition-colors`}
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`mt-4 p-4 rounded-xl ${
              isDarkMode ? "bg-gray-700" : "bg-gray-50"
            }`}
          >
            <h3 className="font-semibold mb-3">Chat Settings</h3>

            {/* Slow Mode Toggle */}
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-medium">Slow Mode</p>
                <p className="text-sm text-gray-500">
                  Limit how often users can send messages
                </p>
              </div>
              <button
                onClick={toggleSlowMode}
                className={`w-14 h-7 rounded-full transition-colors ${
                  slowMode.enabled
                    ? "bg-blue-500"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
                    slowMode.enabled ? "translate-x-8" : "translate-x-1"
                  }`}
                />
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
                  onChange={(e) =>
                    updateSlowModeInterval(parseInt(e.target.value))
                  }
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
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4"
        ref={messagesContainerRef}
        onScroll={handleScroll}
      >
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
              onEditMessage={handleEditMessage}
              onDeleteMessage={handleDeleteMessage}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div
        className={`${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } border-t p-6`}
      >
        <ChatInput
          isDarkMode={isDarkMode}
          onSendMessage={handleSendMessage}
          disabled={!user || !userRegion}
          slowModeActive={slowMode.enabled && slowModeRemaining > 0}
          slowModeRemaining={slowModeRemaining}
        />
      </div>
    </div>
  );
}
