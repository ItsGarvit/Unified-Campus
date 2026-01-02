import { motion } from "motion/react";
import { useState } from "react";
import { Check } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  isDarkMode: boolean;
  isOwn: boolean;
  onVotePoll?: (messageId: string, optionId: string) => void;
}

export function ChatMessage({ message, isDarkMode, isOwn, onVotePoll }: ChatMessageProps) {
  const [imageError, setImageError] = useState(false);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleVote = (optionId: string) => {
    if (onVotePoll && message.pollData && !message.pollData.votedUsers.includes(message.userId)) {
      onVotePoll(message.id, optionId);
    }
  };

  const hasVoted = message.pollData?.votedUsers.includes(message.userId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 ${
        message.userType === 'student' ? 'bg-blue-500' : 'bg-green-500'
      }`}>
        {message.userName.charAt(0)}
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-md ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* User Info */}
        <div className={`flex items-center gap-2 mb-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="text-sm font-medium">{message.userName}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            message.userType === 'student' 
              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          }`}>
            {message.userType}
          </span>
          <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
        </div>

        {/* Message Bubble */}
        <div className={`rounded-2xl overflow-hidden ${
          isOwn
            ? 'bg-blue-500 text-white'
            : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {/* Text Message */}
          {message.type === 'text' && (
            <div className="px-4 py-2">
              {message.message}
            </div>
          )}

          {/* Image Message */}
          {message.type === 'image' && message.mediaUrl && (
            <div>
              {!imageError ? (
                <img 
                  src={message.mediaUrl} 
                  alt="Shared image" 
                  className="max-w-full h-auto max-h-96 object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="px-4 py-2 text-red-500">
                  Failed to load image
                </div>
              )}
            </div>
          )}

          {/* Video Message */}
          {message.type === 'video' && message.mediaUrl && (
            <div>
              <video 
                src={message.mediaUrl} 
                controls 
                className="max-w-full h-auto max-h-96"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* GIF Message */}
          {message.type === 'gif' && message.mediaUrl && (
            <div>
              {!imageError ? (
                <img 
                  src={message.mediaUrl} 
                  alt="GIF" 
                  className="max-w-full h-auto max-h-64 object-cover"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="px-4 py-2 text-red-500">
                  Failed to load GIF
                </div>
              )}
            </div>
          )}

          {/* Poll Message */}
          {message.type === 'poll' && message.pollData && (
            <div className="p-4 min-w-[300px]">
              <h4 className="font-semibold mb-3">{message.pollData.question}</h4>
              <div className="space-y-2">
                {message.pollData.options.map((option) => {
                  const percentage = message.pollData!.totalVotes > 0
                    ? Math.round((option.votes / message.pollData!.totalVotes) * 100)
                    : 0;

                  return (
                    <button
                      key={option.id}
                      onClick={() => handleVote(option.id)}
                      disabled={hasVoted}
                      className={`w-full text-left relative overflow-hidden rounded-xl transition-all ${
                        hasVoted
                          ? isDarkMode ? 'bg-gray-600 cursor-default' : 'bg-gray-200 cursor-default'
                          : isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {/* Progress Bar */}
                      {hasVoted && (
                        <div 
                          className="absolute inset-y-0 left-0 bg-blue-500/30 transition-all"
                          style={{ width: `${percentage}%` }}
                        />
                      )}

                      <div className="relative px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span>{option.text}</span>
                          {hasVoted && option.votes > 0 && (
                            <Check className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                        {hasVoted && (
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold">{percentage}%</span>
                            <span className="text-xs text-gray-500">{option.votes} votes</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {message.pollData.totalVotes} total votes
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
