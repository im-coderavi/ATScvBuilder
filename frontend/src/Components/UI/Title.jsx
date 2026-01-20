import { motion } from 'framer-motion';

const Title = ({ title, heading, description }) => {
    return (
        <div className="text-center mb-16">
            <motion.span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4"
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
            >
                {title}
            </motion.span>

            <motion.h2
                className="text-3xl md:text-4xl font-bold mb-4"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
            >
                {heading}
            </motion.h2>

            <motion.p
                className="text-gray-400 max-w-xl mx-auto"
                initial={{ y: 40, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
            >
                {description}
            </motion.p>
        </div>
    );
};

export default Title;
