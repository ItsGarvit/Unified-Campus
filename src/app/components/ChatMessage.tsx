import { motion, AnimatePresence } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Check, MoreVertical, Pencil, Trash2, X } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "../types/chat";

interface ChatMessageProps {
  message: ChatMessageType;
  isDarkMode: boolean;
  isOwn: boolean;
  onVotePoll?: (messageId: string, optionId: string) => void;
  onEditMessage?: (messageId: string, newText: string) => void;
  onDeleteMessage?: (messageId: string) => void;
}

const EDIT_TIME_LIMIT_MS = 3 * 60 * 1000; // 3 minutes in milliseconds

export function ChatMessage({ 
  message, 
  isDarkMode, 
  isOwn, 
  onVotePoll,
  onEditMessage,
  onDeleteMessage 
}: ChatMessageProps) {
  const [imageError, setImageError] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(message.message);
  const menuRef = useRef<HTMLDivElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // Check if message can be edited (within 3 minutes)
  const canEdit = () => {
    const timeSinceSent = Date.now() - message.timestamp;
    return timeSinceSent < EDIT_TIME_LIMIT_MS && message.type === 'text';
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

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

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(message.message);
    setShowMenu(false);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== message.message && onEditMessage) {
      onEditMessage(message.id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(message.message);
  };

  const handleDelete = () => {
    if (onDeleteMessage) {
      onDeleteMessage(message.id);
    }
    setShowMenu(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const hasVoted = message.pollData?.votedUsers.includes(message.userId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''} group`}
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
          <span className="text-xs text-gray-400">
            {formatTime(message.timestamp)}
            {message.isEdited && <span className="ml-1 italic">(edited)</span>}
          </span>
        </div>

        {/* Message Bubble with Actions */}
        <div className="relative">
          <div className={`rounded-2xl overflow-hidden ${
            isOwn
              ? 'bg-blue-500 text-white'
              : isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          }`}>
            {/* Text Message */}
            {message.type === 'text' && !isEditing && (
              <div className="px-4 py-2">
                {message.message}
              </div>
            )}

            {/* Edit Mode */}
            {message.type === 'text' && isEditing && (
              <div className="px-2 py-2 flex items-center gap-2">
                <input
                  ref={editInputRef}
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 px-3 py-1 rounded-lg text-sm ${
                    isDarkMode 
                      ? 'bg-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-400`}
                />
                <button
                  onClick={handleSaveEdit}
                  className="p-1 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
                  title="Save"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                  title="Cancel"
                >
                  <X className="w-4 h-4" />
                </button>
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

          {/* Actions Menu (only for own messages) */}
          {isOwn && !isEditing && (onEditMessage || onDeleteMessage) && (
            <div 
              ref={menuRef}
              className={`absolute ${isOwn ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-0 pl-2`}
            >
              <button
                onClick={() => setShowMenu(!showMenu)}
                className={`p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                  isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                }`}
              >
                <MoreVertical className="w-4 h-4 text-gray-400" />
              </button>

              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`absolute ${isOwn ? 'right-0' : 'left-0'} top-full mt-1 py-1 rounded-lg shadow-lg z-10 min-w-[120px] ${
                      isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-white border border-gray-200'
                    }`}
                  >
                    {canEdit() && onEditMessage && (
                      <button
                        onClick={handleEdit}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 ${
                          isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Pencil className="w-4 h-4" />
                        Edit
                      </button>
                    )}
                    {onDeleteMessage && (
                      <button
                        onClick={handleDelete}
                        className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-red-500 ${
                          isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100'
                        }`}
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
