import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Title from '../UI/Title';

const FAQSection = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const faqData = [
        {
            question: 'What is ATS and why does it matter?',
            answer: 'ATS (Applicant Tracking System) is software used by 99% of Fortune 500 companies to screen resumes before human review. If your resume isn\'t ATS-friendly, it may never be seen by a recruiter. Our AI ensures your resume passes these systems with a 95%+ success rate.'
        },
        {
            question: 'How does the AI optimization work?',
            answer: 'Our system uses Google Gemini AI to analyze your resume content, identify weak areas, and suggest improvements. It compares your resume against job descriptions, adds relevant keywords, and restructures content for maximum impact—all while keeping your authentic voice.'
        },
        {
            question: 'Can I edit my resume after AI generation?',
            answer: 'Absolutely! After AI generates your optimized resume, you get full access to our LaTeX editor. Make any changes you want, preview in real-time, and download whenever you\'re satisfied. You have complete control over the final output.'
        },
        {
            question: 'What file formats can I export to?',
            answer: 'You can export your resume as a high-quality PDF (recommended for job applications), the original LaTeX source code (for further customization in tools like Overleaf), or keep it in our system for future edits and updates.'
        },
        {
            question: 'Is my data secure and private?',
            answer: 'Your privacy is our priority. All data is encrypted end-to-end, we never sell your information to third parties, and you can delete your account and all associated data instantly with one click. We\'re fully GDPR compliant.'
        }
    ];

    return (
        <section id="faq" className="py-20 2xl:py-32">
            <div className="max-w-3xl mx-auto px-4">
                <Title
                    title="FAQ"
                    heading="Frequently asked questions"
                    description="Got questions? We've got answers. Here are the most common things people ask about our resume builder."
                />

                <div className="space-y-4">
                    {faqData.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: 50, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: i * 0.1 }}
                            className="rounded-xl border border-white/10 bg-white/5 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                            >
                                <span className="font-medium pr-4">{faq.question}</span>
                                <ChevronDown
                                    className={`size-5 text-gray-400 transition-transform flex-shrink-0 ${openIndex === i ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="overflow-hidden"
                                    >
                                        <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
