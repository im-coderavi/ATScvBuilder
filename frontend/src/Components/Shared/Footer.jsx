import { FileText, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const links = {
        Product: ['Features', 'Pricing', 'Templates', 'ATS Checker'],
        Company: ['About Us', 'Careers', 'Blog', 'Contact'],
        Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy'],
        Social: [
            { icon: Twitter, href: '#' },
            { icon: Github, href: '#' },
            { icon: Linkedin, href: '#' },
        ]
    };

    return (
        <footer className="bg-slate-950 pt-20 pb-10 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12 mb-16">
                    {/* Brand */}
                    <div className="lg:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center">
                                <FileText className="text-white h-5 w-5" />
                            </div>
                            <span className="text-xl font-bold font-display text-white">
                                Resume<span className="text-violet-400">AI</span>
                            </span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                            Build professional, ATS-friendly resumes in minutes with the power of AI.
                            Join 10,000+ professionals landing their dream jobs.
                        </p>
                        <div className="flex gap-4">
                            {links.Social.map(({ icon: Icon, href }, i) => (
                                <a key={i} href={href} className="p-2 bg-white/5 rounded-full text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(links).slice(0, 3).map(([category, items]) => (
                        <div key={category} className="lg:col-span-1"> // Adjusted col-span
                            <h3 className="font-semibold text-white mb-4">{category}</h3>
                            <ul className="space-y-3">
                                {items.map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                                            {item}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter - Optional/Extra col */}
                    <div className="lg:col-span-1">
                        <h3 className="font-semibold text-white mb-4">Stay Updated</h3>
                        <div className="flex flex-col gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="bg-slate-900 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500"
                            />
                            <button className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">
                        © 2026 ATS Resume Builder. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                        <span>for job seekers worldwide</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
