import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Building2, Search, ChevronDown, Check, Plus, Sparkles, Loader2 } from "lucide-react";
import { searchColleges, getCollegesByState, getAllColleges, searchAllColleges } from "../data/collegesData";
import { searchCollegesWithAI, isGeminiConfigured } from "../services/geminiService";

interface CollegeSearchDropdownProps {
  state?: string;
  value: string;
  onChange: (college: string) => void;
  disabled?: boolean;
  isDarkMode?: boolean;
  showAllColleges?: boolean;
}

export function CollegeSearchDropdown({
  state = "",
  value,
  onChange,
  disabled = false,
  isDarkMode = false,
  showAllColleges = false,
}: CollegeSearchDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customCollege, setCustomCollege] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isAiSearching, setIsAiSearching] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const aiSearchTimeout = useRef<NodeJS.Timeout | null>(null);

  // Get filtered colleges based on search
  const filteredColleges = showAllColleges 
    ? searchAllColleges(searchQuery) 
    : searchColleges(state, searchQuery);
  const collegeList = showAllColleges ? getAllColleges() : getCollegesByState(state);
  const hasColleges = collegeList.length > 0;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
        setShowCustomInput(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset highlighted index when search changes
  useEffect(() => {
    setHighlightedIndex(0);
    setAiSuggestions([]);
    
    // Clear previous timeout
    if (aiSearchTimeout.current) {
      clearTimeout(aiSearchTimeout.current);
    }

    // Debounced AI search if query is long enough
    if (searchQuery.length >= 3 && isGeminiConfigured()) {
      aiSearchTimeout.current = setTimeout(async () => {
        setIsAiSearching(true);
        try {
          const suggestions = await searchCollegesWithAI(searchQuery);
          // Filter out suggestions that are already in filteredColleges to avoid duplicates
          const uniqueSuggestions = suggestions.filter(
            s => !filteredColleges.some(fc => fc.toLowerCase() === s.toLowerCase())
          );
          setAiSuggestions(uniqueSuggestions);
        } catch (error) {
          console.error("AI search failed:", error);
        } finally {
          setIsAiSearching(false);
        }
      }, 1000); // Slightly longer debounce for global search
    }

    return () => {
      if (aiSearchTimeout.current) {
        clearTimeout(aiSearchTimeout.current);
      }
    };
  }, [searchQuery, filteredColleges.length]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          Math.min(prev + 1, filteredColleges.length) // +1 for "Other" option
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (showCustomInput) {
          if (customCollege.trim()) {
            onChange(customCollege.trim());
            setIsOpen(false);
            setShowCustomInput(false);
            setCustomCollege("");
          }
        } else if (highlightedIndex === filteredColleges.length) {
          // "Other" option selected
          setShowCustomInput(true);
        } else if (filteredColleges[highlightedIndex]) {
          onChange(filteredColleges[highlightedIndex]);
          setIsOpen(false);
          setSearchQuery("");
        }
        break;
      case "Escape":
        e.preventDefault();
        if (showCustomInput) {
          setShowCustomInput(false);
        } else {
          setIsOpen(false);
          setSearchQuery("");
        }
        break;
    }
  };

  const handleSelectCollege = (college: string) => {
    onChange(college);
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleSelectOther = () => {
    setShowCustomInput(true);
  };

  const handleSubmitCustom = () => {
    if (customCollege.trim()) {
      onChange(customCollege.trim());
      setIsOpen(false);
      setShowCustomInput(false);
      setCustomCollege("");
      setSearchQuery("");
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Main Button */}
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={`w-full pl-12 pr-10 py-3 rounded-2xl border-2 text-left transition-all ${
          disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer"
        } ${
          isDarkMode
            ? "border-gray-100 bg-gray-700 text-gray-100"
            : "border-gray-900 bg-gray-50 text-gray-900"
        } ${
          isOpen
            ? "ring-4 ring-blue-300 dark:ring-blue-600"
            : ""
        }`}
      >
        <Building2 className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
          isDarkMode ? "text-gray-400" : "text-gray-500"
        }`} />
        <span className={value ? "" : (isDarkMode ? "text-gray-400" : "text-gray-500")}>
          {value || (hasColleges ? "Search and select your college" : "Enter your college name")}
        </span>
        <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-transform ${
          isOpen ? "rotate-180" : ""
        } ${isDarkMode ? "text-gray-400" : "text-gray-500"}`} />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-full mt-2 rounded-2xl border-2 shadow-xl overflow-hidden ${
              isDarkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Search Input */}
            {hasColleges && !showCustomInput && (
              <div className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`} />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type to search colleges..."
                    className={`w-full pl-10 pr-4 py-2 rounded-xl text-sm focus:outline-none ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-100 placeholder-gray-400"
                        : "bg-gray-50 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Custom Input */}
            {showCustomInput && (
              <div className={`p-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-100"}`}>
                <p className={`text-sm mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                  Enter your college name:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customCollege}
                    onChange={(e) => setCustomCollege(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Your college name..."
                    autoFocus
                    className={`flex-1 px-4 py-2 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      isDarkMode
                        ? "bg-gray-700 text-gray-100 placeholder-gray-400"
                        : "bg-gray-50 text-gray-900 placeholder-gray-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={handleSubmitCustom}
                    disabled={!customCollege.trim()}
                    className="px-4 py-2 rounded-xl bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}

            {/* College List */}
            {!showCustomInput && (
              <div
                ref={listRef}
                className="max-h-60 overflow-y-auto"
              >
                {hasColleges ? (
                  <>
                    {/* Local Results Section */}
                    {filteredColleges.length > 0 && (
                      <div className="py-1">
                        <div className={`px-4 py-1 text-[10px] font-bold uppercase tracking-wider ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                          Local Colleges ({state || "Global"})
                        </div>
                        {filteredColleges.map((college, index) => (
                          <button
                            key={college}
                            type="button"
                            onClick={() => handleSelectCollege(college)}
                            className={`w-full px-4 py-3 text-left text-sm flex items-center justify-between transition-colors ${
                              highlightedIndex === index
                                ? isDarkMode
                                  ? "bg-blue-600 text-white"
                                  : "bg-blue-50 text-blue-700"
                                : isDarkMode
                                ? "hover:bg-gray-700"
                                : "hover:bg-gray-50"
                            }`}
                          >
                            <span className="truncate pr-2">{college}</span>
                            {value === college && (
                              <Check className="w-4 h-4 flex-shrink-0 text-green-500" />
                            )}
                          </button>
                        ))}
                      </div>
                    )}

                    {filteredColleges.length === 0 && !isAiSearching && aiSuggestions.length === 0 && (
                      <div className={`px-4 py-3 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                        No local colleges found matching "{searchQuery}"
                      </div>
                    )}

                    {/* Global AI Suggestions Section */}
                    {isAiSearching && (
                      <div className="p-3 border-t border-purple-100 dark:border-purple-900/30">
                        <div className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Searching globally using AI...</span>
                        </div>
                      </div>
                    )}

                    {!isAiSearching && aiSuggestions.length > 0 && (
                      <div className={`p-1 bg-purple-50/30 dark:bg-purple-900/10 border-t ${isDarkMode ? "border-purple-900/30" : "border-purple-100"}`}>
                        <div className="flex items-center gap-2 px-3 py-2">
                          <Sparkles className="w-3 h-3 text-purple-500" />
                          <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">AI Global Results</span>
                        </div>
                        {aiSuggestions.map((college) => (
                          <button
                            key={`ai-${college}`}
                            type="button"
                            onClick={() => handleSelectCollege(college)}
                            className={`w-full px-4 py-2 rounded-lg text-left text-sm flex items-center justify-between transition-colors ${
                              isDarkMode
                                ? "hover:bg-purple-900/50 text-gray-200"
                                : "hover:bg-purple-100/50 text-purple-900"
                            }`}
                          >
                            <span className="truncate pr-2">{college}</span>
                            <Plus className="w-3 h-3 opacity-50" />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* "Other" Option */}
                    <button
                      type="button"
                      onClick={handleSelectOther}
                      className={`w-full px-4 py-3 text-left text-sm flex items-center gap-2 border-t transition-colors ${
                        highlightedIndex === filteredColleges.length
                          ? isDarkMode
                            ? "bg-blue-600 text-white border-gray-700"
                            : "bg-blue-50 text-blue-700 border-gray-100"
                          : isDarkMode
                          ? "hover:bg-gray-700 border-gray-700 text-gray-300"
                          : "hover:bg-gray-50 border-gray-100 text-gray-600"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      <span>My college is not listed</span>
                    </button>
                  </>
                ) : (
                  <div className={`p-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    <p className="text-sm mb-3">
                      No colleges available for <strong>{state || "your region"}</strong>.
                    </p>
                    <button
                      type="button"
                      onClick={handleSelectOther}
                      className={`w-full px-4 py-2 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors ${
                        isDarkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-gray-200"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                      Enter college name manually
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
