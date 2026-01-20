import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Menu, X, ChevronRight, LayoutDashboard, LogOut } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import Button from '../UI/Button';
import { cn } from '../../lib/utils';
import AuthContext from '../../Context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Hide navbar on dashboard to allow for sidebar layout
    const isDashboard = location.pathname.includes('/dashboard');

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (isDashboard) return null;

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Pricing', href: '#pricing' },
    ];

    return (
        <nav
            className={cn(
                "fixed top-0 w-full z-50 transition-all duration-300",
                scrolled ? "bg-slate-900/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform duration-300">
                            <FileText className="text-white h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Resume<span className="text-violet-400">AI</span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        {user ? (
                            <>
                                <Link to="/dashboard">
                                    <Button variant="ghost" size="sm">
                                        <LayoutDashboard className="h-4 w-4 mr-2" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button variant="secondary" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button variant="ghost" size="sm">Log in</Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary" size="sm" className="rounded-full">
                                        Get Started <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-400 hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-b border-white/10 overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-4">
                            {navLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="block text-base font-medium text-gray-400 hover:text-white"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </a>
                            ))}
                            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                                {user ? (
                                    <>
                                        <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="primary" className="w-full">
                                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Button variant="ghost" className="w-full justify-start" onClick={() => { handleLogout(); setMobileMenuOpen(false); }}>
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start">Log in</Button>
                                        </Link>
                                        <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                                            <Button variant="primary" className="w-full">Get Started</Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
