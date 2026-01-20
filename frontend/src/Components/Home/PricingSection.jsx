import { useRef } from 'react';
import { Check, Sparkles } from 'lucide-react';
import { PrimaryButton, GhostButton } from '../UI/Buttons';
import Title from '../UI/Title';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PricingSection = () => {
    const refs = useRef([]);

    const plansData = [
        {
            id: 'free',
            name: 'Free',
            price: '$0',
            period: 'forever',
            desc: 'Perfect for getting started',
            features: [
                '3 Resume generations',
                'Basic ATS optimization',
                '2 Premium templates',
                'PDF export',
                'Email support'
            ]
        },
        {
            id: 'pro',
            name: 'Pro',
            price: '$9',
            period: 'per month',
            desc: 'For active job seekers',
            features: [
                'Unlimited resume generations',
                'Advanced AI optimization',
                'All premium templates',
                'LaTeX source export',
                'Priority support',
                'Resume analytics'
            ],
            popular: true
        },
        {
            id: 'lifetime',
            name: 'Lifetime',
            price: '$49',
            period: 'one-time',
            desc: 'Best value for professionals',
            features: [
                'Everything in Pro',
                'Lifetime access',
                'Future templates included',
                'API access',
                'Custom branding',
                '1-on-1 resume review'
            ]
        }
    ];

    return (
        <section id="pricing" className="py-20 2xl:py-32 bg-white/[0.02] border-t border-white/5">
            <div className="max-w-6xl mx-auto px-4">
                <Title
                    title="Pricing"
                    heading="Simple, transparent pricing"
                    description="Choose the plan that fits your job search. No hidden fees, cancel anytime."
                />

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plansData.map((plan, i) => (
                        <motion.div
                            key={plan.id}
                            ref={(el) => {
                                refs.current[i] = el;
                            }}
                            initial={{ y: 100, opacity: 0 }}
                            whileInView={{ y: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.1 + i * 0.1 }}
                            onAnimationComplete={() => {
                                const card = refs.current[i];
                                if (card) {
                                    card.classList.add("transition", "duration-500", "hover:scale-[1.02]");
                                }
                            }}
                            className={`relative p-6 rounded-2xl border backdrop-blur ${plan.popular
                                    ? 'border-indigo-500/50 bg-gradient-to-b from-indigo-900/40 to-indigo-950/20 shadow-xl shadow-indigo-500/10'
                                    : 'border-white/10 bg-white/5'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full text-xs font-medium flex items-center gap-1.5">
                                    <Sparkles className="size-3" />
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-6">
                                <p className="text-sm text-gray-400 mb-1">{plan.name}</p>
                                <div className="flex items-end gap-2">
                                    <span className="text-4xl font-bold">{plan.price}</span>
                                    <span className="text-sm text-gray-400 pb-1">
                                        / {plan.period}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-400 mt-2">
                                    {plan.desc}
                                </p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feat, j) => (
                                    <li
                                        key={j}
                                        className="flex items-center gap-3 text-sm text-gray-300"
                                    >
                                        <Check className={`size-4 flex-shrink-0 ${plan.popular ? 'text-indigo-400' : 'text-green-400'}`} />
                                        {feat}
                                    </li>
                                ))}
                            </ul>

                            <Link to="/signup">
                                {plan.popular ? (
                                    <PrimaryButton className="w-full py-3">
                                        Get Started
                                    </PrimaryButton>
                                ) : (
                                    <GhostButton className="w-full justify-center py-3">
                                        Get Started
                                    </GhostButton>
                                )}
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Trust indicators */}
                <motion.div
                    className="mt-12 text-center"
                    initial={{ y: 40, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 250, damping: 70, mass: 1, delay: 0.4 }}
                >
                    <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                            <Check className="size-4 text-green-400" />
                            No credit card required
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="size-4 text-green-400" />
                            Cancel anytime
                        </span>
                        <span className="flex items-center gap-2">
                            <Check className="size-4 text-green-400" />
                            7-day money-back guarantee
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default PricingSection;
