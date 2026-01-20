import { ArrowRightIcon, PlayIcon, ZapIcon, CheckIcon, Sparkles } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../UI/Buttons';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// MacBook Mockup with Live Data Component
const MacBookMockup = () => {
    const [currentScore, setCurrentScore] = useState(72);
    const [isOptimizing, setIsOptimizing] = useState(true);
    const [currentSection, setCurrentSection] = useState(0);
    const [typingText, setTypingText] = useState('');

    const resumeData = {
        name: 'Sarah Johnson',
        title: 'Senior Software Engineer',
        email: 'sarah.johnson@email.com',
        phone: '+1 (555) 123-4567',
        sections: [
            { title: 'Experience', content: 'Led development of microservices architecture serving 2M+ users' },
            { title: 'Skills', content: 'React, Node.js, Python, AWS, Docker, Kubernetes, GraphQL' },
            { title: 'Education', content: 'M.S. Computer Science, Stanford University, 2019' }
        ]
    };

    const aiSuggestions = [
        'Adding quantified achievements...',
        'Optimizing keywords for ATS...',
        'Enhancing action verbs...',
        'Improving formatting...',
        'Finalizing resume...'
    ];

    // Animate score increase
    useEffect(() => {
        if (currentScore < 95) {
            const timer = setTimeout(() => {
                setCurrentScore(prev => Math.min(prev + 1, 95));
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsOptimizing(false);
        }
    }, [currentScore]);

    // Cycle through sections
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSection(prev => (prev + 1) % 3);
        }, 2500);
        return () => clearInterval(interval);
    }, []);

    // Typing animation
    useEffect(() => {
        const suggestions = aiSuggestions;
        let suggestionIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const type = () => {
            const current = suggestions[suggestionIndex];

            if (!isDeleting) {
                setTypingText(current.slice(0, charIndex + 1));
                charIndex++;

                if (charIndex === current.length) {
                    isDeleting = true;
                    setTimeout(type, 1500);
                    return;
                }
            } else {
                setTypingText(current.slice(0, charIndex));
                charIndex--;

                if (charIndex === 0) {
                    isDeleting = false;
                    suggestionIndex = (suggestionIndex + 1) % suggestions.length;
                }
            }

            setTimeout(type, isDeleting ? 30 : 50);
        };

        const timer = setTimeout(type, 500);
        return () => clearTimeout(timer);
    }, []);

    const getScoreColor = (score) => {
        if (score >= 90) return 'text-green-400';
        if (score >= 70) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreBarColor = (score) => {
        if (score >= 90) return 'bg-green-500';
        if (score >= 70) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="relative w-full max-w-lg mx-auto">
            {/* MacBook Frame */}
            <div className="relative">
                {/* Screen Bezel */}
                <div className="bg-gray-800 rounded-t-xl p-2 pt-3">
                    {/* Camera Notch */}
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-gray-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-600" />
                    </div>

                    {/* Screen Content */}
                    <div className="bg-slate-900 rounded-lg overflow-hidden shadow-2xl">
                        {/* macOS Title Bar */}
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-800 border-b border-slate-700">
                            <div className="flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 cursor-pointer" />
                                    <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer" />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-700/50 rounded-md">
                                <Sparkles className="size-3 text-indigo-400" />
                                <span className="text-xs text-gray-300">ResumeAI Pro</span>
                            </div>
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-green-500/20 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-green-400 text-[10px] font-medium">LIVE</span>
                            </div>
                        </div>

                        {/* App Content */}
                        <div className="flex min-h-[280px]">
                            {/* Sidebar */}
                            <div className="w-16 bg-slate-800/50 border-r border-slate-700 p-2 flex flex-col items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                                    <Sparkles className="size-5 text-white" />
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center">
                                    <span className="text-xs">📄</span>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                                    <span className="text-xs">📊</span>
                                </div>
                                <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center">
                                    <span className="text-xs">⚙️</span>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 p-4 flex gap-4">
                                {/* Resume Preview */}
                                <div className="flex-1 bg-white rounded-lg p-4 shadow-lg overflow-hidden">
                                    {/* Resume Header */}
                                    <div className="border-b border-gray-200 pb-3 mb-3">
                                        <motion.div
                                            className="text-gray-900 font-bold text-base"
                                            animate={{ opacity: [0.8, 1, 0.8] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            {resumeData.name}
                                        </motion.div>
                                        <div className="text-gray-600 text-xs">{resumeData.title}</div>
                                        <div className="text-gray-400 text-[10px] mt-1">{resumeData.email} • {resumeData.phone}</div>
                                    </div>

                                    {/* Animated Sections */}
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={currentSection}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-2"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className="w-1 h-4 bg-indigo-500 rounded-full" />
                                                <span className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                                                    {resumeData.sections[currentSection].title}
                                                </span>
                                            </div>
                                            <div className="text-[11px] text-gray-600 leading-relaxed pl-3">
                                                {resumeData.sections[currentSection].content}
                                            </div>
                                        </motion.div>
                                    </AnimatePresence>

                                    {/* Animated Lines */}
                                    <div className="mt-4 space-y-2">
                                        <motion.div
                                            className="h-2 bg-gray-100 rounded-full"
                                            animate={{ width: ['50%', '85%', '70%'] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />
                                        <motion.div
                                            className="h-2 bg-gray-100 rounded-full"
                                            animate={{ width: ['70%', '55%', '90%'] }}
                                            transition={{ duration: 3.5, repeat: Infinity }}
                                        />
                                        <motion.div
                                            className="h-2 bg-gray-100 rounded-full"
                                            animate={{ width: ['60%', '80%', '65%'] }}
                                            transition={{ duration: 2.5, repeat: Infinity }}
                                        />
                                    </div>
                                </div>

                                {/* Right Panel - AI Status */}
                                <div className="w-40 space-y-3">
                                    {/* ATS Score */}
                                    <div className="bg-slate-800 rounded-lg p-3 border border-slate-700">
                                        <div className="text-gray-400 text-[10px] font-medium mb-2">ATS SCORE</div>
                                        <div className="flex items-center justify-between mb-2">
                                            <motion.span
                                                className={`text-2xl font-bold ${getScoreColor(currentScore)}`}
                                                key={currentScore}
                                                initial={{ scale: 1.1 }}
                                                animate={{ scale: 1 }}
                                            >
                                                {currentScore}%
                                            </motion.span>
                                            {currentScore >= 90 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="bg-green-500/20 p-1 rounded-full"
                                                >
                                                    <CheckIcon className="size-4 text-green-400" />
                                                </motion.div>
                                            )}
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full rounded-full ${getScoreBarColor(currentScore)}`}
                                                animate={{ width: `${currentScore}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                    </div>

                                    {/* AI Status */}
                                    <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <motion.div
                                                animate={{ rotate: isOptimizing ? 360 : 0 }}
                                                transition={{ duration: 2, repeat: isOptimizing ? Infinity : 0, ease: "linear" }}
                                            >
                                                <Sparkles className="size-4 text-indigo-400" />
                                            </motion.div>
                                            <span className="text-indigo-300 text-[10px] font-medium">
                                                {isOptimizing ? 'AI Optimizing' : 'Complete!'}
                                            </span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 h-4 flex items-center">
                                            <span className="truncate">{typingText}</span>
                                            <motion.span
                                                className="w-0.5 h-3 bg-indigo-400 ml-0.5 flex-shrink-0"
                                                animate={{ opacity: [1, 0] }}
                                                transition={{ duration: 0.8, repeat: Infinity }}
                                            />
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                            <div className="text-green-400 text-sm font-bold">12</div>
                                            <div className="text-gray-500 text-[8px]">Keywords</div>
                                        </div>
                                        <div className="bg-slate-800/50 rounded-lg p-2 text-center">
                                            <div className="text-indigo-400 text-sm font-bold">8</div>
                                            <div className="text-gray-500 text-[8px]">Sections</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* MacBook Base/Keyboard */}
                <div className="bg-gray-700 h-4 rounded-b-xl mx-auto" style={{ width: '90%' }}>
                    <div className="bg-gray-600 h-1 w-16 rounded-full mx-auto mt-1" />
                </div>

                {/* MacBook Stand Shadow */}
                <div className="bg-gray-800/50 h-2 rounded-b-xl mx-auto blur-sm" style={{ width: '70%' }} />
            </div>

            {/* Floating Badges */}
            <motion.div
                className="absolute -right-6 top-8 bg-green-500 text-white text-[10px] font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <CheckIcon className="size-3" />
                ATS Optimized
            </motion.div>

            <motion.div
                className="absolute -left-6 top-24 bg-indigo-500 text-white text-[10px] font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
                animate={{ y: [0, 5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }}
            >
                <Sparkles className="size-3" />
                AI Enhanced
            </motion.div>

            <motion.div
                className="absolute -right-4 bottom-16 bg-violet-500 text-white text-[10px] font-medium px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
            >
                <ZapIcon className="size-3" />
                Real-time
            </motion.div>
        </div>
    );
};

const HeroSection = () => {
    const trustedUserImages = [
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop'
    ];

    const trustedLogosText = [
        '50,000+ Resumes Created',
        '95% ATS Pass Rate',
        'AI-Powered',
        'Professional Templates',
        'Instant PDF Export'
    ];

    return (
        <>
            <section id="home" className="relative z-10">
                <div className="max-w-6xl mx-auto px-4 min-h-screen max-md:w-screen max-md:overflow-hidden pt-32 md:pt-28 flex items-center justify-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                        <div className="text-left">
                            <motion.div
                                className="inline-flex items-center gap-3 pl-3 pr-4 py-1.5 rounded-full bg-white/10 mb-6 justify-start"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                            >
                                <div className="flex -space-x-2">
                                    {trustedUserImages.map((src, i) => (
                                        <img
                                            key={i}
                                            src={src}
                                            alt={`User ${i + 1}`}
                                            className="size-6 rounded-full border border-black/50"
                                            width={40}
                                            height={40}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-200/90">
                                    Trusted by 50,000+ professionals
                                </span>
                            </motion.div>

                            <motion.h1
                                className="text-4xl md:text-5xl font-bold leading-tight mb-6 max-w-xl"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                Build Your <br />
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                                    ATS-Optimized Resume
                                </span>
                            </motion.h1>

                            <motion.p
                                className="text-gray-300 max-w-lg mb-8"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                            >
                                Stop getting rejected by ATS bots. Our AI-powered builder creates
                                perfectly optimized resumes that get you interviews at top companies.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row items-center gap-4 mb-8"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
                            >
                                <Link to="/signup" className="w-full sm:w-auto">
                                    <PrimaryButton className="max-sm:w-full py-3 px-7">
                                        Start Building Free
                                        <ArrowRightIcon className="size-4" />
                                    </PrimaryButton>
                                </Link>

                                <Link to="/login">
                                    <GhostButton className="max-sm:w-full max-sm:justify-center py-3 px-5">
                                        <PlayIcon className="size-4" />
                                        View Templates
                                    </GhostButton>
                                </Link>
                            </motion.div>

                            <motion.div
                                className="flex sm:inline-flex overflow-hidden items-center max-sm:justify-center text-sm text-gray-200 bg-white/10 rounded"
                                initial={{ y: 60, opacity: 0 }}
                                whileInView={{ y: 0, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                            >
                                <div className="flex items-center gap-2 p-2 px-3 sm:px-6 hover:bg-white/5 transition-colors">
                                    <ZapIcon className="size-4 text-indigo-400" />
                                    <div>
                                        <div>AI-Powered Analysis</div>
                                        <div className="text-xs text-gray-400">
                                            Gemini AI optimization
                                        </div>
                                    </div>
                                </div>

                                <div className="hidden sm:block h-6 w-px bg-white/10" />

                                <div className="flex items-center gap-2 p-2 px-3 sm:px-6 hover:bg-white/5 transition-colors">
                                    <CheckIcon className="size-4 text-green-400" />
                                    <div>
                                        <div>95% ATS Pass Rate</div>
                                        <div className="text-xs text-gray-400">
                                            Beat tracking systems
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Right: MacBook Mockup with Live Data */}
                        <motion.div
                            className="mx-auto w-full flex justify-center lg:justify-end"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.5 }}
                        >
                            <MacBookMockup />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Logo Marquee */}
            <motion.section
                className="border-y border-white/10 bg-white/5 max-md:mt-10"
                initial={{ y: 60, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="w-full overflow-hidden py-6">
                        <div className="flex gap-14 items-center justify-center animate-marquee whitespace-nowrap">
                            {trustedLogosText.concat(trustedLogosText).map((text, i) => (
                                <span
                                    key={i}
                                    className="mx-6 text-sm md:text-base font-semibold text-gray-400 hover:text-gray-300 tracking-wide transition-colors"
                                >
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.section>
        </>
    );
};

export default HeroSection;
