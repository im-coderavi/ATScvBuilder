import { useState, useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, FileText, ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Check, X } from 'lucide-react';
import AuthContext from '../Context/AuthContext';
import Button from '../Components/UI/Button';
import { cn } from '../lib/utils';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    // Password strength calculation
    const passwordStrength = useMemo(() => {
        if (!password) return { score: 0, label: '', color: '' };

        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        score = Object.values(checks).filter(Boolean).length;

        if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500', textColor: 'text-red-400', checks };
        if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500', textColor: 'text-yellow-400', checks };
        if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500', textColor: 'text-blue-400', checks };
        return { score, label: 'Strong', color: 'bg-green-500', textColor: 'text-green-400', checks };
    }, [password]);

    const validateForm = () => {
        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = 'Full name is required';
        }

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (passwordStrength.score < 3) {
            newErrors.password = 'Please create a stronger password';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsLoading(true);
        const success = await register(name, email, password);
        setIsLoading(false);
        if (success) {
            navigate('/dashboard');
        }
    };

    const benefits = [
        'Unlock all 8 professional templates',
        'Unlimited AI resume optimizations',
        'PDF & LaTeX source downloads',
        'Real-time ATS scoring'
    ];

    const passwordRequirements = [
        { key: 'length', label: 'At least 8 characters', met: passwordStrength.checks?.length },
        { key: 'uppercase', label: 'One uppercase letter', met: passwordStrength.checks?.uppercase },
        { key: 'lowercase', label: 'One lowercase letter', met: passwordStrength.checks?.lowercase },
        { key: 'number', label: 'One number', met: passwordStrength.checks?.number },
        { key: 'special', label: 'One special character', met: passwordStrength.checks?.special },
    ];

    return (
        <div className="min-h-screen grid lg:grid-cols-2 bg-slate-900">
            {/* Left Side - Brand */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-800/50 relative overflow-hidden order-1 lg:order-2">
                <div className="absolute inset-0 bg-gradient-to-bl from-cyan-500/10 to-slate-900/50" />
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px] animate-blob" />
                    <div className="absolute bottom-1/4 left-20 w-96 h-96 bg-violet-600/20 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                </div>

                <div className="relative z-10 flex items-center justify-end gap-2">
                    <span className="text-xl font-bold font-display text-white">ResumeAI</span>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                        <FileText className="text-white h-6 w-6" />
                    </div>
                </div>

                <div className="relative z-10 max-w-lg ml-auto text-right">
                    <h2 className="text-4xl font-bold font-display text-white mb-6">
                        Start your career <br />
                        <span className="text-gradient">Transformation</span>
                    </h2>
                    <div className="space-y-4 mb-8 flex flex-col items-end">
                        {benefits.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-300">
                                <span>{benefit}</span>
                                <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-xs text-gray-500 text-right">
                    © 2026 ResumeAI Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16 bg-slate-950 order-2 lg:order-1 overflow-y-auto">
                <Link to="/" className="absolute top-8 left-8 text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Home
                </Link>

                <div className="w-full max-w-md mx-auto">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold font-display text-white mb-2">Create Account</h1>
                        <p className="text-gray-400">
                            Already a member?{' '}
                            <Link to="/login" className="text-violet-400 hover:text-violet-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-400 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors">
                                    <User className="h-4 w-4" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={cn(
                                        "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200",
                                        errors.name && "border-red-500/50 focus:ring-red-500/20"
                                    )}
                                />
                            </div>
                            {errors.name && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 ml-1">
                                    {errors.name}
                                </motion.p>
                            )}
                        </div>

                        {/* Email Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-400 ml-1">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={cn(
                                        "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pl-10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200",
                                        errors.email && "border-red-500/50 focus:ring-red-500/20"
                                    )}
                                />
                            </div>
                            {errors.email && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 ml-1">
                                    {errors.email}
                                </motion.p>
                            )}
                        </div>

                        {/* Password Input with Toggle */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-400 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={cn(
                                        "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pl-10 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200",
                                        errors.password && "border-red-500/50 focus:ring-red-500/20"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {password && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-2 space-y-2"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className={cn("h-full rounded-full", passwordStrength.color)}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </div>
                                        <span className={cn("text-xs font-medium", passwordStrength.textColor)}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-1">
                                        {passwordRequirements.map((req) => (
                                            <div key={req.key} className="flex items-center gap-1.5 text-xs">
                                                {req.met ? (
                                                    <Check className="h-3 w-3 text-green-400" />
                                                ) : (
                                                    <X className="h-3 w-3 text-gray-500" />
                                                )}
                                                <span className={req.met ? 'text-green-400' : 'text-gray-500'}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {errors.password && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 ml-1">
                                    {errors.password}
                                </motion.p>
                            )}
                        </div>

                        {/* Confirm Password Input */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-gray-400 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors">
                                    <Lock className="h-4 w-4" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={cn(
                                        "w-full bg-slate-900 border border-white/10 rounded-xl px-4 py-3 pl-10 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200",
                                        errors.confirmPassword && "border-red-500/50 focus:ring-red-500/20",
                                        confirmPassword && password === confirmPassword && "border-green-500/50 focus:ring-green-500/20"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {confirmPassword && password === confirmPassword && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-400 ml-1 flex items-center gap-1">
                                    <Check className="h-3 w-3" /> Passwords match
                                </motion.p>
                            )}
                            {errors.confirmPassword && (
                                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400 ml-1">
                                    {errors.confirmPassword}
                                </motion.p>
                            )}
                        </div>

                        <div className="text-xs text-gray-500 leading-relaxed pt-2">
                            By creating an account, you agree to our{' '}
                            <a href="#" className="underline hover:text-gray-400">Terms of Service</a> and{' '}
                            <a href="#" className="underline hover:text-gray-400">Privacy Policy</a>.
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3 shadow-lg shadow-violet-600/20"
                            isLoading={isLoading}
                        >
                            Create Account <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                    </form>

                    <div className="mt-6 relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-950 px-2 text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4">
                        <Button variant="outline" size="sm" className="w-full py-3">
                            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </Button>
                        <Button variant="outline" size="sm" className="w-full py-3">
                            <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
