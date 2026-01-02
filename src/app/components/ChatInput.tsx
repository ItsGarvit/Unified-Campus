import { useState, useRef } from "react";
import { Send, Image, Video, BarChart3, Smile, Clock, Search } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import type { PollData } from "../types/chat";

interface ChatInputProps {
  isDarkMode: boolean;
  onSendMessage: (message: string, type: 'text' | 'image' | 'video' | 'poll' | 'gif', mediaUrl?: string, pollData?: PollData) => void;
  disabled?: boolean;
  slowModeActive?: boolean;
  slowModeRemaining?: number;
}

export function ChatInput({ isDarkMode, onSendMessage, disabled, slowModeActive, slowModeRemaining }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiTab, setEmojiTab] = useState<'emoji' | 'gif' | 'sticker'>('emoji');
  const [searchQuery, setSearchQuery] = useState("");
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (!message.trim() || disabled || slowModeActive) return;
    onSendMessage(message.trim(), 'text');
    setMessage("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSendMessage("", 'image', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSendMessage("", 'video', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(message + emoji);
  };

  const handleGifSelect = (gifUrl: string) => {
    onSendMessage("", 'gif', gifUrl);
    setShowEmojiPicker(false);
    setSearchQuery("");
  };

  const handleStickerSelect = (stickerUrl: string) => {
    onSendMessage("", 'gif', stickerUrl);
    setShowEmojiPicker(false);
    setSearchQuery("");
  };

  const handleCreatePoll = () => {
    if (!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2) return;

    const pollData: PollData = {
      question: pollQuestion.trim(),
      options: pollOptions
        .filter(o => o.trim())
        .map((text, index) => ({
          id: `opt-${index}`,
          text: text.trim(),
          votes: 0
        })),
      totalVotes: 0,
      votedUsers: []
    };

    onSendMessage("", 'poll', undefined, pollData);
    setPollQuestion("");
    setPollOptions(["", ""]);
    setShowPollCreator(false);
  };

  const addPollOption = () => {
    if (pollOptions.length < 6) {
      setPollOptions([...pollOptions, ""]);
    }
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, i) => i !== index));
    }
  };

  // All emojis with categories and keywords (open-source unicode emojis)
  const allEmojis = [
    // Smileys & Emotion
    { emoji: "😀", keywords: ["smile", "happy", "grinning", "face"] },
    { emoji: "😃", keywords: ["smile", "happy", "joy", "face"] },
    { emoji: "😄", keywords: ["smile", "happy", "joy", "laughing"] },
    { emoji: "😁", keywords: ["smile", "happy", "grin", "face"] },
    { emoji: "😆", keywords: ["laugh", "happy", "smile", "satisfied"] },
    { emoji: "😅", keywords: ["laugh", "sweat", "smile", "relief"] },
    { emoji: "🤣", keywords: ["laugh", "rolling", "floor", "lol"] },
    { emoji: "😂", keywords: ["laugh", "tears", "joy", "crying"] },
    { emoji: "🙂", keywords: ["smile", "happy", "simple", "face"] },
    { emoji: "🙃", keywords: ["upside", "down", "silly", "face"] },
    { emoji: "😉", keywords: ["wink", "flirt", "smile", "face"] },
    { emoji: "😊", keywords: ["blush", "smile", "happy", "shy"] },
    { emoji: "😇", keywords: ["angel", "innocent", "halo", "smile"] },
    { emoji: "🥰", keywords: ["love", "hearts", "smile", "adore"] },
    { emoji: "😍", keywords: ["love", "heart", "eyes", "smile"] },
    { emoji: "🤩", keywords: ["star", "eyes", "excited", "wow"] },
    { emoji: "😘", keywords: ["kiss", "love", "heart", "face"] },
    { emoji: "😗", keywords: ["kiss", "whistle", "face"] },
    { emoji: "😚", keywords: ["kiss", "blush", "closed", "eyes"] },
    { emoji: "😙", keywords: ["kiss", "smile", "face"] },
    { emoji: "🥲", keywords: ["smile", "tears", "happy", "sad"] },
    { emoji: "😋", keywords: ["yum", "delicious", "tongue", "savoring"] },
    { emoji: "😛", keywords: ["tongue", "out", "playful", "face"] },
    { emoji: "😜", keywords: ["wink", "tongue", "crazy", "face"] },
    { emoji: "🤪", keywords: ["crazy", "zany", "wild", "goofy"] },
    { emoji: "😝", keywords: ["tongue", "squint", "playful", "face"] },
    { emoji: "🤑", keywords: ["money", "rich", "dollar", "greedy"] },
    { emoji: "🤗", keywords: ["hug", "hands", "smile", "embrace"] },
    { emoji: "🤭", keywords: ["oops", "hand", "mouth", "giggle"] },
    { emoji: "🤫", keywords: ["shh", "quiet", "secret", "silence"] },
    { emoji: "🤔", keywords: ["think", "hmm", "consider", "ponder"] },
    { emoji: "🤐", keywords: ["zipper", "mouth", "secret", "quiet"] },
    { emoji: "🤨", keywords: ["raised", "eyebrow", "suspicious", "skeptical"] },
    { emoji: "😐", keywords: ["neutral", "meh", "straight", "face"] },
    { emoji: "😑", keywords: ["expressionless", "blank", "deadpan", "face"] },
    { emoji: "😶", keywords: ["no", "mouth", "silent", "quiet"] },
    { emoji: "😏", keywords: ["smirk", "smug", "confident", "sly"] },
    { emoji: "😒", keywords: ["unamused", "annoyed", "unimpressed", "face"] },
    { emoji: "🙄", keywords: ["eye", "roll", "annoyed", "whatever"] },
    { emoji: "😬", keywords: ["grimace", "awkward", "nervous", "teeth"] },
    { emoji: "😌", keywords: ["relieved", "calm", "peaceful", "content"] },
    { emoji: "😔", keywords: ["sad", "pensive", "down", "dejected"] },
    { emoji: "😪", keywords: ["sleepy", "tired", "drowsy", "yawn"] },
    { emoji: "🤤", keywords: ["drool", "hungry", "desire", "craving"] },
    { emoji: "😴", keywords: ["sleep", "zzz", "tired", "sleeping"] },
    { emoji: "😷", keywords: ["mask", "sick", "doctor", "medical"] },
    { emoji: "🤒", keywords: ["sick", "fever", "thermometer", "ill"] },
    { emoji: "🤕", keywords: ["injured", "bandage", "hurt", "head"] },
    { emoji: "🤢", keywords: ["nauseous", "sick", "gross", "disgusted"] },
    { emoji: "🤮", keywords: ["vomit", "sick", "puke", "ill"] },
    { emoji: "🤧", keywords: ["sneeze", "sick", "tissue", "achoo"] },
    { emoji: "🥵", keywords: ["hot", "heat", "sweat", "burning"] },
    { emoji: "🥶", keywords: ["cold", "freeze", "freezing", "ice"] },
    { emoji: "😵", keywords: ["dizzy", "confused", "knocked", "out"] },
    { emoji: "🤯", keywords: ["mind", "blown", "explode", "shocked"] },
    { emoji: "🤠", keywords: ["cowboy", "hat", "western", "yeehaw"] },
    { emoji: "🥳", keywords: ["party", "celebrate", "birthday", "hat"] },
    { emoji: "🥸", keywords: ["disguise", "glasses", "nose", "incognito"] },
    { emoji: "😎", keywords: ["cool", "sunglasses", "confident", "awesome"] },
    { emoji: "🤓", keywords: ["nerd", "geek", "glasses", "smart"] },
    { emoji: "🧐", keywords: ["monocle", "curious", "inspect", "fancy"] },
    { emoji: "😕", keywords: ["confused", "unsure", "puzzled", "face"] },
    { emoji: "😟", keywords: ["worried", "anxious", "concerned", "face"] },
    { emoji: "🙁", keywords: ["sad", "frown", "unhappy", "disappointed"] },
    { emoji: "☹️", keywords: ["frown", "sad", "unhappy", "face"] },
    { emoji: "😮", keywords: ["wow", "surprised", "shocked", "open"] },
    { emoji: "😯", keywords: ["surprised", "hushed", "quiet", "amazed"] },
    { emoji: "😲", keywords: ["shocked", "astonished", "gasp", "wow"] },
    { emoji: "😳", keywords: ["flushed", "embarrassed", "blush", "shy"] },
    { emoji: "🥺", keywords: ["pleading", "puppy", "eyes", "sad"] },
    { emoji: "😦", keywords: ["frown", "open", "mouth", "shocked"] },
    { emoji: "😧", keywords: ["anguish", "worried", "distressed", "face"] },
    { emoji: "😨", keywords: ["fear", "scared", "fearful", "anxious"] },
    { emoji: "😰", keywords: ["anxious", "sweat", "nervous", "worried"] },
    { emoji: "😥", keywords: ["sad", "relieved", "disappointed", "phew"] },
    { emoji: "😢", keywords: ["cry", "sad", "tears", "weep"] },
    { emoji: "😭", keywords: ["sob", "crying", "tears", "bawl"] },
    { emoji: "😱", keywords: ["scream", "fear", "shocked", "munch"] },
    { emoji: "😖", keywords: ["confounded", "frustrated", "struggle", "face"] },
    { emoji: "😣", keywords: ["persevere", "struggle", "effort", "face"] },
    { emoji: "😞", keywords: ["disappointed", "sad", "down", "face"] },
    { emoji: "😓", keywords: ["sweat", "downcast", "tired", "stressed"] },
    { emoji: "😩", keywords: ["weary", "tired", "exhausted", "fed"] },
    { emoji: "😫", keywords: ["tired", "exhausted", "fed", "up"] },
    { emoji: "🥱", keywords: ["yawn", "tired", "sleepy", "bored"] },
    { emoji: "😤", keywords: ["triumph", "proud", "steam", "nose"] },
    { emoji: "😡", keywords: ["angry", "mad", "rage", "furious"] },
    { emoji: "😠", keywords: ["angry", "mad", "annoyed", "face"] },
    { emoji: "🤬", keywords: ["swear", "cursing", "angry", "symbols"] },
    { emoji: "😈", keywords: ["devil", "evil", "purple", "horns"] },
    { emoji: "👿", keywords: ["devil", "angry", "evil", "imp"] },
    { emoji: "💀", keywords: ["skull", "death", "dead", "skeleton"] },
    { emoji: "☠️", keywords: ["skull", "crossbones", "death", "danger"] },
    // Gestures & Body Parts
    { emoji: "👋", keywords: ["wave", "hello", "hi", "goodbye"] },
    { emoji: "🤚", keywords: ["raised", "back", "hand", "stop"] },
    { emoji: "🖐️", keywords: ["hand", "fingers", "splayed", "stop"] },
    { emoji: "✋", keywords: ["hand", "stop", "raised", "palm"] },
    { emoji: "🖖", keywords: ["vulcan", "spock", "star", "trek"] },
    { emoji: "👌", keywords: ["ok", "okay", "perfect", "hand"] },
    { emoji: "🤌", keywords: ["pinched", "fingers", "italian", "gesture"] },
    { emoji: "🤏", keywords: ["pinch", "small", "tiny", "hand"] },
    { emoji: "✌️", keywords: ["peace", "victory", "two", "fingers"] },
    { emoji: "🤞", keywords: ["cross", "fingers", "luck", "hope"] },
    { emoji: "🤟", keywords: ["love", "you", "hand", "sign"] },
    { emoji: "🤘", keywords: ["rock", "metal", "horns", "hand"] },
    { emoji: "🤙", keywords: ["call", "me", "shaka", "hang"] },
    { emoji: "👈", keywords: ["point", "left", "finger", "direction"] },
    { emoji: "👉", keywords: ["point", "right", "finger", "direction"] },
    { emoji: "👆", keywords: ["point", "up", "finger", "direction"] },
    { emoji: "🖕", keywords: ["middle", "finger", "rude", "offensive"] },
    { emoji: "👇", keywords: ["point", "down", "finger", "direction"] },
    { emoji: "☝️", keywords: ["point", "up", "index", "finger"] },
    { emoji: "👍", keywords: ["thumbs", "up", "like", "yes"] },
    { emoji: "👎", keywords: ["thumbs", "down", "dislike", "no"] },
    { emoji: "✊", keywords: ["fist", "raised", "power", "punch"] },
    { emoji: "👊", keywords: ["fist", "bump", "punch", "bro"] },
    { emoji: "🤛", keywords: ["fist", "left", "bump", "punch"] },
    { emoji: "🤜", keywords: ["fist", "right", "bump", "punch"] },
    { emoji: "👏", keywords: ["clap", "applause", "praise", "hands"] },
    { emoji: "🙌", keywords: ["raised", "hands", "celebrate", "yay"] },
    { emoji: "👐", keywords: ["open", "hands", "hug", "embrace"] },
    { emoji: "🤲", keywords: ["palms", "up", "together", "pray"] },
    { emoji: "🤝", keywords: ["handshake", "deal", "agreement", "shake"] },
    { emoji: "🙏", keywords: ["pray", "thank", "you", "please"] },
    // Hearts & Symbols
    { emoji: "💛", keywords: ["yellow", "heart", "love", "gold"] },
    { emoji: "🧡", keywords: ["orange", "heart", "love"] },
    { emoji: "❤️", keywords: ["red", "heart", "love"] },
    { emoji: "💙", keywords: ["blue", "heart", "love"] },
    { emoji: "💚", keywords: ["green", "heart", "love"] },
    { emoji: "💜", keywords: ["purple", "heart", "love"] },
    { emoji: "🖤", keywords: ["black", "heart", "dark", "evil"] },
    { emoji: "🤍", keywords: ["white", "heart", "pure", "love"] },
    { emoji: "🤎", keywords: ["brown", "heart", "love"] },
    { emoji: "💔", keywords: ["broken", "heart", "sad", "breakup"] },
    { emoji: "❣️", keywords: ["heart", "exclamation", "love", "heavy"] },
    { emoji: "💕", keywords: ["two", "hearts", "love"] },
    { emoji: "💞", keywords: ["revolving", "hearts", "love"] },
    { emoji: "💓", keywords: ["beating", "heart", "love", "pulse"] },
    { emoji: "💗", keywords: ["growing", "heart", "love", "excited"] },
    { emoji: "💖", keywords: ["sparkling", "heart", "love", "shine"] },
    { emoji: "💘", keywords: ["cupid", "arrow", "heart", "love"] },
    { emoji: "💝", keywords: ["heart", "ribbon", "gift", "love"] },
    { emoji: "💟", keywords: ["heart", "decoration", "love"] },
    { emoji: "✨", keywords: ["sparkle", "shine", "stars", "magic"] },
    { emoji: "💫", keywords: ["dizzy", "star", "sparkle", "magic"] },
    { emoji: "⭐", keywords: ["star", "favorite", "rating"] },
    { emoji: "🌟", keywords: ["glowing", "star", "shine", "sparkle"] },
    { emoji: "💥", keywords: ["boom", "collision", "explosion", "bang"] },
    { emoji: "💯", keywords: ["hundred", "points", "100", "perfect"] },
    { emoji: "🔥", keywords: ["fire", "flame", "hot", "lit"] },
    { emoji: "⚡", keywords: ["lightning", "bolt", "electric", "fast"] },
    { emoji: "💨", keywords: ["dash", "fast", "wind", "air"] },
    { emoji: "🎉", keywords: ["party", "popper", "celebrate", "confetti"] },
    { emoji: "🎊", keywords: ["confetti", "ball", "party", "celebrate"] },
    { emoji: "🎈", keywords: ["balloon", "party", "celebrate"] },
    { emoji: "🎁", keywords: ["gift", "present", "birthday", "wrapped"] },
    { emoji: "🏆", keywords: ["trophy", "winner", "award", "champion"] },
    { emoji: "🥇", keywords: ["first", "place", "medal", "gold"] },
    { emoji: "🥈", keywords: ["second", "place", "medal", "silver"] },
    { emoji: "🥉", keywords: ["third", "place", "medal", "bronze"] },
  ];

  // Filter emojis based on search
  const filteredEmojis = searchQuery.trim()
    ? allEmojis.filter(item =>
        item.keywords.some(keyword => keyword.includes(searchQuery.toLowerCase()))
      )
    : allEmojis;

  // GIFs from Giphy API - These URLs are from the free Giphy API
  // In production, use: https://api.giphy.com/v1/gifs/trending?api_key=YOUR_KEY&limit=20
  // For search: https://api.giphy.com/v1/gifs/search?api_key=YOUR_KEY&q=${searchQuery}&limit=20
  const trendingGifs = [
    "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif", // thumbs up
    "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif", // celebration
    "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif", // coding
    "https://media.giphy.com/media/ZdUnQS4AXEl1AERdil/giphy.gif", // thinking
    "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif", // happy
    "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif", // mind blown
    "https://media.giphy.com/media/26FPy3QZQqGtDcrja/giphy.gif", // excited
    "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif", // clapping
    "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif", // laughing
    "https://media.giphy.com/media/3ornka9rAaKRA2Rkac/giphy.gif", // typing
    "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif", // cat typing
    "https://media.giphy.com/media/citBl9yPwnUOs/giphy.gif", // success
    "https://media.giphy.com/media/l0HlRnAWXxn0MhKLK/giphy.gif", // dancing
    "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif", // party
    "https://media.giphy.com/media/xT0xeMA62E1XIlup68/giphy.gif", // fire
    "https://media.giphy.com/media/3o6Zt0hNCfak3QCqsw/giphy.gif", // love
    "https://media.giphy.com/media/26BROrSHlmyzzHf3i/giphy.gif", // wow
    "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif", // shocked
  ];

  // Search results for GIFs (in production, this would be fetched from Giphy API)
  // Example API call: fetch(`https://api.giphy.com/v1/gifs/search?api_key=${GIPHY_KEY}&q=${searchQuery}`)
  const searchGifs = {
    "happy": [
      "https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif",
      "https://media.giphy.com/media/26FPy3QZQqGtDcrja/giphy.gif",
      "https://media.giphy.com/media/l0HlRnAWXxn0MhKLK/giphy.gif",
    ],
    "party": [
      "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
      "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif",
      "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
    ],
    "love": [
      "https://media.giphy.com/media/3o6Zt0hNCfak3QCqsw/giphy.gif",
      "https://media.giphy.com/media/26FPy3QZQqGtDcrja/giphy.gif",
    ],
    "fire": [
      "https://media.giphy.com/media/xT0xeMA62E1XIlup68/giphy.gif",
      "https://media.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.gif",
    ],
    "coding": [
      "https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif",
      "https://media.giphy.com/media/3ornka9rAaKRA2Rkac/giphy.gif",
      "https://media.giphy.com/media/3oKIPnAiaMCws8nOsE/giphy.gif",
    ],
    "think": [
      "https://media.giphy.com/media/ZdUnQS4AXEl1AERdil/giphy.gif",
      "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif",
    ],
    "celebrate": [
      "https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif",
      "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif",
      "https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif",
    ],
    "clap": [
      "https://media.giphy.com/media/3o7btNa0RUYa5E7iiQ/giphy.gif",
    ],
    "laugh": [
      "https://media.giphy.com/media/g9582DNuQppxC/giphy.gif",
    ],
    "thumbs": [
      "https://media.giphy.com/media/3o7abKhOpu0NwenH3O/giphy.gif",
    ],
  };

  // Get GIFs based on search or show trending
  const displayGifs = searchQuery.trim() 
    ? (searchGifs[searchQuery.toLowerCase() as keyof typeof searchGifs] || [])
    : trendingGifs;

  // Stickers from Giphy Stickers API
  // In production: https://api.giphy.com/v1/stickers/trending?api_key=YOUR_KEY&limit=20
  // For search: https://api.giphy.com/v1/stickers/search?api_key=YOUR_KEY&q=${searchQuery}&limit=20
  const trendingStickers = [
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOW5xYzZqdmJ3ZHQ4aWJ3NnpkM3lwZGV4MWI2MWF4ZWp5ZmE3ZGM4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/du3J3cXyzhj75IOgvA/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnpxN3pkZ3h3dzg3dXN5YXRkZmN3YWNkZXJzYnV5dGJzNXE4ZHptbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/YRtsy4I5wAs9Nh3SLD/giphy.gif",
    "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJpZ3V3dDRzNzJ4cGd3ZGFkeTN0b3l3YmhlaTI3cXRnenU5cDZwNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/UO5elnTqo4vSg/giphy.gif",
    "https://media.giphy.com/media/l41lUjUgLLwWrz20w/giphy.gif",
    "https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif",
    "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
    "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
    "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
    "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
    "https://media.giphy.com/media/KztT2c4u8mYYUiMKdJ/giphy.gif",
    "https://media.giphy.com/media/lP8xu5t2DLGG045H8/giphy.gif",
    "https://media.giphy.com/media/KymorXW5NKFJYd5JlC/giphy.gif",
  ];

  // Search results for stickers (in production, this would be fetched from Giphy Stickers API)
  const searchStickers = {
    "happy": [
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOW5xYzZqdmJ3ZHQ4aWJ3NnpkM3lwZGV4MWI2MWF4ZWp5ZmE3ZGM4ZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/du3J3cXyzhj75IOgvA/giphy.gif",
      "https://media.giphy.com/media/KztT2c4u8mYYUiMKdJ/giphy.gif",
    ],
    "love": [
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYnpxN3pkZ3h3dzg3dXN5YXRkZmN3YWNkZXJzYnV5dGJzNXE4ZHptbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/YRtsy4I5wAs9Nh3SLD/giphy.gif",
      "https://media.giphy.com/media/lP8xu5t2DLGG045H8/giphy.gif",
    ],
    "party": [
      "https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif",
      "https://media.giphy.com/media/l41lUjUgLLwWrz20w/giphy.gif",
    ],
    "sad": [
      "https://media.giphy.com/media/MDJ9IbxxvDUQM/giphy.gif",
      "https://media.giphy.com/media/l0MYC0LajbaPoEADu/giphy.gif",
    ],
    "shocked": [
      "https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif",
    ],
    "sleepy": [
      "https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif",
    ],
    "penguin": [
      "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJpZ3V3dDRzNzJ4cGd3ZGFkeTN0b3l3YmhlaTI3cXRnenU5cDZwNyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/UO5elnTqo4vSg/giphy.gif",
    ],
    "cute": [
      "https://media.giphy.com/media/KymorXW5NKFJYd5JlC/giphy.gif",
    ],
  };

  // Get stickers based on search or show trending
  const displayStickers = searchQuery.trim()
    ? (searchStickers[searchQuery.toLowerCase() as keyof typeof searchStickers] || [])
    : trendingStickers;

  return (
    <div>
      {/* Poll Creator Modal */}
      <AnimatePresence>
        {showPollCreator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowPollCreator(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl p-6 max-w-md w-full`}
            >
              <h3 className="text-xl font-bold mb-4">Create a Poll</h3>
              
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Ask a question..."
                className={`w-full px-4 py-3 rounded-xl border mb-4 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                } outline-none focus:ring-2 focus:ring-blue-500`}
              />

              <div className="space-y-2 mb-4">
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      className={`flex-1 px-4 py-2 rounded-xl border ${
                        isDarkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
                      } outline-none focus:ring-2 focus:ring-blue-500`}
                    />
                    {pollOptions.length > 2 && (
                      <button
                        onClick={() => removePollOption(index)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {pollOptions.length < 6 && (
                <button
                  onClick={addPollOption}
                  className={`w-full px-4 py-2 rounded-xl border-2 border-dashed mb-4 ${
                    isDarkMode ? 'border-gray-600 hover:border-gray-500' : 'border-gray-300 hover:border-gray-400'
                  } transition-colors`}
                >
                  + Add Option
                </button>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setShowPollCreator(false)}
                  className={`flex-1 px-4 py-3 rounded-xl ${
                    isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  } transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePoll}
                  disabled={!pollQuestion.trim() || pollOptions.filter(o => o.trim()).length < 2}
                  className="flex-1 px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
                >
                  Create Poll
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emoji/GIF/Sticker Picker */}
      <AnimatePresence>
        {showEmojiPicker && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`absolute bottom-20 left-6 right-6 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } border rounded-2xl shadow-xl z-10 overflow-hidden`}
          >
            {/* Tab Header */}
            <div className={`flex border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => setEmojiTab('emoji')}
                className={`flex-1 px-4 py-3 font-medium transition-colors ${
                  emojiTab === 'emoji'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                😀 Emoji
              </button>
              <button
                onClick={() => setEmojiTab('gif')}
                className={`flex-1 px-4 py-3 font-medium transition-colors ${
                  emojiTab === 'gif'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                🎬 GIF
              </button>
              <button
                onClick={() => setEmojiTab('sticker')}
                className={`flex-1 px-4 py-3 font-medium transition-colors ${
                  emojiTab === 'sticker'
                    ? 'bg-blue-500 text-white'
                    : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                ⭐ Sticker
              </button>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className={`px-4 py-3 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                } transition-colors`}
              >
                ✕
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-4 max-h-80 overflow-y-auto">
              {/* Search Bar (for all tabs) */}
              <div className="mb-4">
                <div className={`relative flex items-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                } rounded-xl`}>
                  <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={
                      emojiTab === 'emoji' 
                        ? 'Search emojis (e.g., smile, love, fire)...'
                        : emojiTab === 'gif'
                        ? 'Search GIFs...'
                        : 'Search stickers...'
                    }
                    className={`w-full pl-10 pr-4 py-2 rounded-xl ${
                      isDarkMode 
                        ? 'bg-gray-700 text-white placeholder-gray-400' 
                        : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                    } outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Emoji Tab */}
              {emojiTab === 'emoji' && (
                <div>
                  {filteredEmojis.length > 0 ? (
                    <>
                      <h4 className="text-sm font-semibold mb-3 text-gray-500">
                        {searchQuery ? `Search Results (${filteredEmojis.length})` : 'All Emojis'}
                      </h4>
                      <div className="grid grid-cols-8 gap-2">
                        {filteredEmojis.map((item, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmojiSelect(item.emoji)}
                            className={`text-2xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors`}
                            title={item.keywords.join(', ')}
                          >
                            {item.emoji}
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No emojis found for "{searchQuery}"</p>
                      <p className="text-sm mt-2">Try: smile, love, fire, party</p>
                    </div>
                  )}
                </div>
              )}

              {/* GIF Tab */}
              {emojiTab === 'gif' && (
                <div>
                  {displayGifs.length > 0 ? (
                    <>
                      <h4 className="text-sm font-semibold mb-3 text-gray-500">
                        {searchQuery ? `Search Results (${displayGifs.length})` : 'Trending GIFs'}
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {displayGifs.map((gif, index) => (
                          <button
                            key={index}
                            onClick={() => handleGifSelect(gif)}
                            className="aspect-square rounded-xl overflow-hidden hover:scale-105 transition-transform border-2 border-transparent hover:border-blue-500"
                          >
                            <img
                              src={gif}
                              alt="GIF"
                              className="w-full h-full"
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No GIFs found for "{searchQuery}"</p>
                      <p className="text-sm mt-2">Try: party, fire, laugh, love</p>
                    </div>
                  )}
                </div>
              )}

              {/* Sticker Tab */}
              {emojiTab === 'sticker' && (
                <div>
                  {displayStickers.length > 0 ? (
                    <>
                      <h4 className="text-sm font-semibold mb-3 text-gray-500">
                        {searchQuery ? `Search Results (${displayStickers.length})` : 'Popular Stickers'}
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {displayStickers.map((sticker, index) => (
                          <button
                            key={index}
                            onClick={() => handleStickerSelect(sticker)}
                            className="aspect-square rounded-xl overflow-hidden hover:scale-110 transition-transform"
                          >
                            <img
                              src={sticker}
                              alt="Sticker"
                              className="w-full h-full"
                            />
                          </button>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      <p>No stickers found for "{searchQuery}"</p>
                      <p className="text-sm mt-2">Try: love, fire, thumbs, cool</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Area */}
      <div className="relative">
        {/* Slow Mode Indicator */}
        {slowModeActive && slowModeRemaining && slowModeRemaining > 0 && (
          <div className="mb-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl flex items-center gap-2 text-sm text-yellow-800 dark:text-yellow-300">
            <Clock className="w-4 h-4" />
            <span>Slow mode: Wait {slowModeRemaining}s before sending another message</span>
          </div>
        )}

        <div className="flex gap-3">
          {/* Media Buttons */}
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled || slowModeActive}
              className={`p-3 rounded-xl ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Upload Image"
            >
              <Image className="w-5 h-5" />
            </button>

            <input
              ref={videoInputRef}
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
            />
            <button
              onClick={() => videoInputRef.current?.click()}
              disabled={disabled || slowModeActive}
              className={`p-3 rounded-xl ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Upload Video"
            >
              <Video className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              disabled={disabled || slowModeActive}
              className={`p-3 rounded-xl ${
                showEmojiPicker 
                  ? 'bg-blue-500 text-white' 
                  : isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Emoji, GIF & Stickers"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              onClick={() => setShowPollCreator(true)}
              disabled={disabled || slowModeActive}
              className={`p-3 rounded-xl ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              } transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Create Poll"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>

          {/* Text Input */}
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={slowModeActive ? `Wait ${slowModeRemaining}s...` : "Type your message..."}
            disabled={disabled || slowModeActive}
            className={`flex-1 px-4 py-3 rounded-xl border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500'
            } outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed`}
          />

          <button
            onClick={handleSend}
            disabled={!message.trim() || disabled || slowModeActive}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            <Send className="w-5 h-5" />
            Send
          </button>
        </div>
      </div>
    </div>
  );
}