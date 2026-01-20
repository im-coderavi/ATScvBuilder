import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * TagsInput - A component for editing comma-separated lists as visual tags
 * Much better UX for fields like Technologies, Skills, Coursework, etc.
 */
const TagsInput = ({
    label,
    value = [],
    onChange,
    placeholder = "Type and press Enter to add...",
    tagColor = "violet",
    maxTags = 50,
    suggestions = [],
    className = ""
}) => {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    // Ensure value is always an array
    const tags = Array.isArray(value) ? value : [];

    const colorClasses = {
        violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
        cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        green: 'bg-green-500/20 text-green-300 border-green-500/30',
        orange: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
        pink: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
        yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
        purple: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
        blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    };

    const tagClass = colorClasses[tagColor] || colorClasses.violet;

    const addTag = (tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag) && tags.length < maxTags) {
            const newTags = [...tags, trimmedTag];
            onChange(newTags);
            setInputValue('');
        }
    };

    const removeTag = (indexToRemove) => {
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        onChange(newTags);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
            removeTag(tags.length - 1);
        } else if (e.key === ',') {
            e.preventDefault();
            addTag(inputValue);
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData('text');
        const pastedTags = pastedText.split(',').map(t => t.trim()).filter(t => t);
        if (pastedTags.length > 0) {
            const newTags = [...tags];
            pastedTags.forEach(tag => {
                if (!newTags.includes(tag) && newTags.length < maxTags) {
                    newTags.push(tag);
                }
            });
            onChange(newTags);
            setInputValue('');
        }
    };

    return (
        <div className={`space-y-1.5 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-400 ml-1">
                    {label}
                </label>
            )}
            <div
                className={`
                    w-full min-h-[42px] bg-slate-850 border rounded-xl px-3 py-2 
                    transition-all duration-200 cursor-text
                    ${isFocused
                        ? 'border-violet-500/50 ring-2 ring-violet-500/50'
                        : 'border-white/10 hover:border-white/20'
                    }
                `}
                onClick={() => inputRef.current?.focus()}
            >
                <div className="flex flex-wrap gap-1.5 items-center">
                    <AnimatePresence mode="popLayout">
                        {tags.map((tag, index) => (
                            <motion.span
                                key={`${tag}-${index}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                layout
                                className={`
                                    inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium 
                                    border transition-all hover:brightness-110
                                    ${tagClass}
                                `}
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeTag(index);
                                    }}
                                    className="hover:text-white transition-colors ml-0.5"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </motion.span>
                        ))}
                    </AnimatePresence>

                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onPaste={handlePaste}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setIsFocused(false);
                            if (inputValue.trim()) {
                                addTag(inputValue);
                            }
                        }}
                        placeholder={tags.length === 0 ? placeholder : "Add more..."}
                        className="flex-1 min-w-[120px] bg-transparent text-white text-sm placeholder-gray-600 outline-none"
                    />
                </div>
            </div>
            <p className="text-xs text-gray-500 ml-1">
                Press Enter or comma to add • {tags.length}/{maxTags} items
            </p>
        </div>
    );
};

export default TagsInput;
