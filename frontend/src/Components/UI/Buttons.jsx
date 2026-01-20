export const PrimaryButton = ({ children, className = '', ...props }) => (
    <button
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium bg-gradient-to-br from-indigo-500 to-violet-600 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-indigo-500/25 ${className}`}
        {...props}
    >
        {children}
    </button>
);

export const GhostButton = ({ children, className = '', ...props }) => (
    <button
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-sm active:scale-95 transition-all ${className}`}
        {...props}
    >
        {children}
    </button>
);
