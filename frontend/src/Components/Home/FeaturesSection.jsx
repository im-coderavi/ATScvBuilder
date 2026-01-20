import { useRef } from 'react';
import Title from '../UI/Title';
import { motion } from 'framer-motion';
import { Cpu, Target, FileText, Zap, Shield, Download } from 'lucide-react';

const FeaturesSection = () => {
    const refs = useRef([]);

    const featuresData = [
        {
            icon: <Cpu className="w-6 h-6 text-indigo-400" />,
            title: 'AI-Powered Analysis',
            desc: 'Google Gemini AI analyzes your resume against job descriptions, suggesting powerful improvements.'
        },
        {
            icon: <Target className="w-6 h-6 text-green-400" />,
            title: 'ATS Optimization',
            desc: 'Our system ensures 95%+ pass rate through major Applicant Tracking Systems like Taleo & Workday.'
        },
        {
            icon: <FileText className="w-6 h-6 text-violet-400" />,
            title: 'LaTeX Templates',
            desc: 'Professional-grade templates built with LaTeX for pixel-perfect, print-ready documents.'
        },
        {
            icon: <Zap className="w-6 h-6 text-yellow-400" />,
            title: 'Instant Generation',
            desc: 'Get your optimized resume in under 30 seconds. No waiting, no hassle—just results.'
        },
        {
            icon: <Shield className="w-6 h-6 text-cyan-400" />,
            title: 'Privacy First',
            desc: 'Your data is encrypted and never sold. Delete your account and data anytime with one click.'
        },
        {
            icon: <Download className="w-6 h-6 text-pink-400" />,
            title: 'Multiple Formats',
            desc: 'Export your resume as PDF, LaTeX source, or editable format. Your resume, your choice.'
        }
    ];

    return (
        <section id="features" className="py-20 2xl:py-32">
            <div className="max-w-6xl mx-auto px-4">
                <Title
                    title="Features"
                    heading="Everything you need to land your dream job"
                    description="From AI analysis to professional templates, we've got you covered at every step of your job search."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {featuresData.map((feature, i) => (
                        <motion.div
                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            key={i}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-300", "hover:border-white/15", "hover:-translate-y-1");
                                }
                            }}
                            className="rounded-2xl p-6 bg-white/5 border border-white/10"
                        >
                            <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4">
                                {feature.icon}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {feature.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
