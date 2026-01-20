import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Input = ({ label, error, className, id, icon: Icon, ...props }) => {
    return (
        <div className="space-y-1.5 ">
            {label && (
                <label htmlFor={id} className="block text-sm font-medium text-gray-400 ml-1">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-violet-400 transition-colors">
                        <Icon className="h-4 w-4" />
                    </div>
                )}
                <input
                    id={id}
                    className={cn(
                        "w-full bg-slate-850 border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all duration-200",
                        Icon && "pl-10",
                        error && "border-red-500/50 focus:ring-red-500/20 focus:border-red-500/50",
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-red-400 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
};

export default Input;
