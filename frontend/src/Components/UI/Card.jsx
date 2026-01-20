import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = ({ children, className, hover = false, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-xl",
                hover && "hover:bg-slate-800/60 hover:border-white/10 hover:shadow-2xl hover:shadow-violet-500/5 transition-all duration-300",
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default Card;
