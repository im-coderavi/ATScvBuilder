import { ArrowRightIcon, Sparkles } from 'lucide-react';
import { PrimaryButton } from '../UI/Buttons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="py-20 2xl:pb-32 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="rounded-3xl bg-gradient-to-b from-indigo-900/30 to-violet-900/10 border border-indigo-500/20 p-12 md:p-16 text-center relative overflow-hidden">
                    {/* Noise texture overlay */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

                    <div className="relative z-10">
                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1 }}
                            className="inline-block mb-6"
                        >
                            <Sparkles className="size-12 text-indigo-400 mx-auto" />
                        </motion.div>

                        <motion.h2
                            className="text-2xl sm:text-4xl font-bold mb-6"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 }}
                        >
                            Ready to Land Your{' '}
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
                                Dream Job?
                            </span>
                        </motion.h2>

                        <motion.p
                            className="max-sm:text-sm text-gray-400 mb-10 max-w-xl mx-auto"
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.2 }}
                        >
                            Join 50,000+ professionals who've improved their resumes and landed interviews at top companies using our AI-powered builder.
                        </motion.p>

                        <motion.div
                            initial={{ y: 60, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.3 }}
                        >
                            <Link to="/signup">
                                <PrimaryButton className="px-8 py-3.5 text-base gap-2">
                                    Start Building Now — It's Free
                                    <ArrowRightIcon size={18} />
                                </PrimaryButton>
                            </Link>
                        </motion.div>

                        <motion.p
                            className="mt-6 text-sm text-gray-500"
                            initial={{ y: 40, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.4 }}
                        >
                            No credit card required • Free forever
                        </motion.p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
