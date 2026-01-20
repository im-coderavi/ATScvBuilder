import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { cn } from '../../lib/utils';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading,
    disabled,
    icon: Icon,
    ...props
}) => {
    const variants = {
        primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20 border border-transparent',
        secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md',
        outline: 'bg-transparent border border-white/20 text-white hover:bg-white/5',
        ghost: 'bg-transparent hover:bg-white/5 text-gray-300 hover:text-white',
        gradient: 'bg-gradient-to-r from-violet-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white shadow-lg shadow-violet-500/25 border-none',
        danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20',
        success: 'bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/20',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-5 py-2.5 text-sm',
        lg: 'px-8 py-3.5 text-base',
        icon: 'p-2',
    };

    return (
        <motion.button
            whileHover={!disabled && !isLoading ? { scale: 1.02 } : {}}
            whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
            className={cn(
                'relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader className="h-4 w-4 animate-spin" />
            ) : Icon ? (
                <Icon className="h-4 w-4" />
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;
