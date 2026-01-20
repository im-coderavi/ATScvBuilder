import { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FileText,
    Settings,
    LogOut,
    Plus,
    Search,
    Loader,
    Trash2,
    Edit,
    CheckCircle,
    AlertCircle,
    Clock,
    BarChart3,
    Sparkles,
    Menu,
    X,
    User,
    TrendingUp,
    Eye,
    Download,
    ChevronRight,
    Grid3X3,
    List,
    Edit3,
    AlertTriangle,
    ArrowRight,
    ArrowLeft,
    Upload
} from 'lucide-react';
import AuthContext from '../Context/AuthContext';
import FileUpload from '../Components/Resume/FileUpload';
import api, { API_BASE_URL } from '../Services/api';
import toast from 'react-hot-toast';
import Button from '../Components/UI/Button';
import Card from '../Components/UI/Card';
import Input from '../Components/UI/Input';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [resumes, setResumes] = useState([]);
    const [filteredResumes, setFilteredResumes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showUpload, setShowUpload] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
    const navigate = useNavigate();

    const fetchResumes = async () => {
        try {
            const response = await api.get('/resumes', { baseURL: API_BASE_URL });
            setResumes(response.data);
            setFilteredResumes(response.data);
        } catch (error) {
            toast.error('Failed to fetch resumes');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResumes();
    }, []);

    // Poll for processing resumes
    useEffect(() => {
        const hasProcessing = resumes.some(r => ['processing', 'analyzing', 'generating'].includes(r.status));
        if (!hasProcessing) return;

        const interval = setInterval(() => {
            fetchResumes();
        }, 3000);

        return () => clearInterval(interval);
    }, [resumes]);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = resumes.filter(r =>
            (r.title?.toLowerCase() || '').includes(lowerQuery) ||
            (r.resumeData?.personalInfo?.fullName?.toLowerCase() || '').includes(lowerQuery) ||
            (r.originalFile?.filename?.toLowerCase() || '').includes(lowerQuery)
        );
        setFilteredResumes(filtered);
    }, [searchQuery, resumes]);

    const handleUploadSuccess = (resumeId) => {
        setShowUpload(false);
        if (resumeId) {
            navigate(`/editor/${resumeId}`);
        } else {
            fetchResumes();
            setActiveTab('resumes');
        }
    };

    const handleDelete = async (id) => {
        // Optimistic UI update - delete instantly from state
        const originalResumes = [...resumes];
        setResumes(resumes.filter(r => r._id !== id));
        setFilteredResumes(filteredResumes.filter(r => r._id !== id));

        try {
            await api.delete(`/resumes/${id}`, { baseURL: API_BASE_URL });
            toast.success('Resume deleted');
        } catch (error) {
            // Revert on error
            setResumes(originalResumes);
            setFilteredResumes(originalResumes);
            toast.error('Failed to delete resume');
        }
    };

    const handleRename = async (id, newTitle) => {
        // Optimistic UI update
        const originalResumes = [...resumes];
        const updatedResumes = resumes.map(r =>
            r._id === id ? { ...r, title: newTitle } : r
        );
        setResumes(updatedResumes);
        setFilteredResumes(updatedResumes);

        try {
            await api.patch(`/resumes/${id}/title`, { title: newTitle }, { baseURL: API_BASE_URL });
            toast.success('Resume renamed');
        } catch (error) {
            // Revert on error
            setResumes(originalResumes);
            setFilteredResumes(originalResumes);
            toast.error('Failed to rename resume');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Stats Calculation
    const totalResumes = resumes.length;
    const avgScore = totalResumes > 0
        ? Math.round(resumes.reduce((acc, curr) => acc + (curr.atsScore?.overall || 0), 0) / totalResumes)
        : 0;
    const highScores = resumes.filter(r => (r.atsScore?.overall || 0) >= 80).length;
    const processing = resumes.filter(r => r.status === 'processing').length;

    return (
        <div className="min-h-screen bg-slate-950 flex text-white font-sans">
            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSidebarOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-xl border-r border-white/5 flex flex-col transform transition-transform duration-300 ease-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Logo */}
                <div className="p-5 border-b border-white/5">
                    <Link to="/" className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <FileText className="text-white h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">
                            Resume<span className="text-violet-400">AI</span>
                        </span>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    <NavItem
                        icon={LayoutDashboard}
                        label="Overview"
                        active={activeTab === 'overview'}
                        onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={FileText}
                        label="My Resumes"
                        active={activeTab === 'resumes'}
                        onClick={() => { setActiveTab('resumes'); setSidebarOpen(false); }}
                        badge={totalResumes}
                    />
                    <NavItem
                        icon={Settings}
                        label="Settings"
                        active={activeTab === 'settings'}
                        onClick={() => { setActiveTab('settings'); setSidebarOpen(false); }}
                    />
                    <NavItem
                        icon={CheckCircle}
                        label="ATS Check"
                        active={activeTab === 'ats-check'}
                        onClick={() => { setActiveTab('ats-check'); setSidebarOpen(false); }}
                        badge="New"
                    />
                </nav>

                {/* User Section */}
                <div className="p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/50 mb-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold">
                            {user?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{user?.name || 'User'}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-white/5">
                    <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="lg:hidden p-2 rounded-lg hover:bg-white/5 transition-colors"
                            >
                                <Menu className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-lg sm:text-xl font-bold">
                                    {activeTab === 'overview' && 'Dashboard'}
                                    {activeTab === 'resumes' && 'My Resumes'}
                                    {activeTab === 'ats-check' && 'ATS Score Comparison'}
                                    {activeTab === 'settings' && 'Settings'}
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                                    {activeTab === 'overview' && 'Welcome back! Here\'s your resume overview.'}
                                    {activeTab === 'resumes' && `You have ${totalResumes} resume${totalResumes !== 1 ? 's' : ''}`}
                                    {activeTab === 'ats-check' && 'Compare resumes and check improvements'}
                                    {activeTab === 'settings' && 'Manage your account preferences'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                            {activeTab === 'resumes' && (
                                <>
                                    {/* View Toggle */}
                                    <div className="hidden sm:flex bg-slate-800/50 rounded-lg p-1 border border-white/5">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            <Grid3X3 className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-violet-600 text-white' : 'text-gray-400 hover:text-white'}`}
                                        >
                                            <List className="h-4 w-4" />
                                        </button>
                                    </div>
                                    {/* Search */}
                                    <div className="relative hidden md:block">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Search resumes..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 outline-none transition-all"
                                        />
                                    </div>
                                </>
                            )}
                            <Button
                                variant="gradient"
                                onClick={() => { setActiveTab('resumes'); setShowUpload(true); }}
                                className="shadow-lg shadow-violet-600/20"
                            >
                                <Plus className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">New Resume</span>
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    <AnimatePresence mode="wait">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                    <StatCard
                                        icon={FileText}
                                        label="Total Resumes"
                                        value={totalResumes}
                                        color="violet"
                                    />
                                    <StatCard
                                        icon={BarChart3}
                                        label="Avg ATS Score"
                                        value={`${avgScore}%`}
                                        color="cyan"
                                    />
                                    <StatCard
                                        icon={TrendingUp}
                                        label="High Scores (80+)"
                                        value={highScores}
                                        color="green"
                                    />
                                    <StatCard
                                        icon={Clock}
                                        label="Processing"
                                        value={processing}
                                        color="yellow"
                                    />
                                </div>

                                {/* Quick Actions */}
                                <Card className="p-5">
                                    <h3 className="font-semibold mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <QuickAction
                                            icon={Plus}
                                            label="Create New Resume"
                                            onClick={() => { setActiveTab('resumes'); setShowUpload(true); }}
                                            primary
                                        />
                                        <QuickAction
                                            icon={FileText}
                                            label="View All Resumes"
                                            onClick={() => setActiveTab('resumes')}
                                        />
                                        <QuickAction
                                            icon={Settings}
                                            label="Account Settings"
                                            onClick={() => setActiveTab('settings')}
                                        />
                                    </div>
                                </Card>

                                {/* Recent Resumes */}
                                <Card className="p-5">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-semibold">Recent Resumes</h3>
                                        {resumes.length > 3 && (
                                            <button
                                                onClick={() => setActiveTab('resumes')}
                                                className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
                                            >
                                                View All <ChevronRight className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>
                                    {isLoading ? (
                                        <div className="flex justify-center py-8">
                                            <Loader className="h-6 w-6 text-violet-500 animate-spin" />
                                        </div>
                                    ) : resumes.length > 0 ? (
                                        <div className="space-y-3">
                                            {filteredResumes.slice(0, 3).map(resume => (
                                                <ResumeCard key={resume._id} resume={resume} onDelete={handleDelete} onRename={handleRename} navigate={navigate} compact />
                                            ))}
                                        </div>
                                    ) : (
                                        <EmptyState
                                            message="No resumes yet"
                                            action={() => setShowUpload(true)}
                                        />
                                    )}
                                </Card>
                            </motion.div>
                        )}

                        {/* Resumes Tab */}
                        {activeTab === 'resumes' && (
                            <motion.div
                                key="resumes"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-4"
                            >
                                {/* Upload Modal/Section */}
                                <AnimatePresence>
                                    {showUpload && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <Card className="p-6 mb-4 border-violet-500/30 bg-gradient-to-br from-violet-600/10 to-cyan-600/10">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="font-semibold text-lg">Upload New Resume</h3>
                                                    <button
                                                        onClick={() => setShowUpload(false)}
                                                        className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                                                    >
                                                        <X className="h-5 w-5" />
                                                    </button>
                                                </div>
                                                <FileUpload onUploadSuccess={handleUploadSuccess} />
                                            </Card>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Mobile Search */}
                                <div className="md:hidden">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                                        <input
                                            type="text"
                                            placeholder="Search resumes..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-white/5 rounded-xl text-sm focus:ring-2 focus:ring-violet-500/50 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Resume List/Grid */}
                                {isLoading ? (
                                    <div className="flex justify-center py-16">
                                        <Loader className="h-8 w-8 text-violet-500 animate-spin" />
                                    </div>
                                ) : filteredResumes.length > 0 ? (
                                    <div className={viewMode === 'grid'
                                        ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'
                                        : 'space-y-3'
                                    }>
                                        {filteredResumes.map(resume => (
                                            <ResumeCard
                                                key={resume._id}
                                                resume={resume}
                                                onDelete={handleDelete}
                                                onRename={handleRename}
                                                navigate={navigate}
                                                gridView={viewMode === 'grid'}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <Card className="p-12">
                                        <EmptyState
                                            message={searchQuery ? 'No resumes match your search' : 'Upload your first resume to get started'}
                                            action={() => setShowUpload(true)}
                                        />
                                    </Card>
                                )}
                            </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-2xl space-y-6"
                            >
                                <Card className="p-6">
                                    <h3 className="font-semibold mb-4">Profile Information</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-2xl font-bold">
                                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-medium text-lg">{user?.name || 'User'}</p>
                                                <p className="text-gray-500">{user?.email}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>

                                <Card className="p-6">
                                    <h3 className="font-semibold mb-4">Account</h3>
                                    <div className="space-y-3">
                                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                                            <span>Change Password</span>
                                            <ChevronRight className="h-5 w-5 text-gray-500" />
                                        </button>
                                        <button className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-colors">
                                            <span>Notification Preferences</span>
                                            <ChevronRight className="h-5 w-5 text-gray-500" />
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center justify-between p-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                        >
                                            <span>Sign Out</span>
                                            <LogOut className="h-5 w-5" />
                                        </button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* ATS Check Tab */}
                        {activeTab === 'ats-check' && (
                            <ATSCheckTab resumes={resumes} />
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
};

// Navigation Item Component
const NavItem = ({ icon: Icon, label, active, onClick, badge }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${active
            ? 'bg-violet-600/15 text-violet-400 shadow-sm'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <div className="flex items-center gap-3">
            <Icon className="h-5 w-5" />
            <span>{label}</span>
        </div>
        {badge !== undefined && (
            <span className={`text-xs px-2 py-0.5 rounded-full ${active ? 'bg-violet-500/30' : 'bg-slate-700'}`}>
                {badge}
            </span>
        )}
    </button>
);

// Stat Card Component
const StatCard = ({ icon: Icon, label, value, color }) => {
    const colorClasses = {
        violet: 'from-violet-600/20 to-violet-600/5 border-violet-500/20 text-violet-400',
        cyan: 'from-cyan-600/20 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
        green: 'from-green-600/20 to-green-600/5 border-green-500/20 text-green-400',
        yellow: 'from-yellow-600/20 to-yellow-600/5 border-yellow-500/20 text-yellow-400',
    };

    return (
        <div className={`p-4 rounded-2xl bg-gradient-to-br border ${colorClasses[color]}`}>
            <div className="flex items-center gap-3 mb-2">
                <Icon className="h-5 w-5" />
                <span className="text-xs text-gray-400">{label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    );
};

// Quick Action Component
const QuickAction = ({ icon: Icon, label, onClick, primary }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-3 p-4 rounded-xl transition-all ${primary
            ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-600/20'
            : 'bg-slate-800/50 hover:bg-slate-700 text-gray-300 border border-white/5'
            }`}
    >
        <Icon className="h-5 w-5" />
        <span className="text-sm font-medium">{label}</span>
    </button>
);

// Empty State Component
const EmptyState = ({ message, action }) => (
    <div className="text-center py-8">
        <FileText className="h-12 w-12 text-gray-600 mx-auto mb-3" />
        <p className="text-gray-500 mb-4">{message}</p>
        <Button variant="gradient" onClick={action}>
            <Plus className="h-4 w-4 mr-2" />
            Create Resume
        </Button>
    </div>
);

// Resume Card Component
const ResumeCard = ({ resume, onDelete, onRename, navigate, compact, gridView }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [title, setTitle] = useState(resume.title || resume.resumeData?.personalInfo?.fullName || resume.originalFile?.filename || 'Untitled');

    const handleRenameSubmit = () => {
        if (title.trim()) {
            onRename(resume._id, title);
            setIsRenaming(false);
        }
    };

    const getStatusConfig = (status) => {
        switch (status) {
            case 'completed': return { color: 'bg-green-500/10 text-green-400', icon: CheckCircle, label: 'Completed' };
            case 'analyzed': return { color: 'bg-blue-500/10 text-blue-400', icon: CheckCircle, label: 'Analyzed' };
            case 'analyzing': return { color: 'bg-yellow-500/10 text-yellow-400', icon: Loader, label: 'Analyzing' };
            case 'generating': return { color: 'bg-violet-500/10 text-violet-400', icon: Sparkles, label: 'Generating' };
            case 'processing': return { color: 'bg-yellow-500/10 text-yellow-400', icon: Loader, label: 'Processing' };
            case 'failed': return { color: 'bg-red-500/10 text-red-400', icon: AlertCircle, label: 'Failed' };
            default: return { color: 'bg-gray-500/10 text-gray-400', icon: Clock, label: status };
        }
    };

    const statusConfig = getStatusConfig(resume.status);
    // Use original score if available, otherwise use AI score
    const score = resume.originalAtsScore?.overall || resume.atsScore?.overall || 0;
    const scoreColor = score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
    // Enable edit for analyzed, completed, OR failed status (allow manual editing even on failure)
    const canEdit = ['analyzed', 'completed', 'failed'].includes(resume.status);

    if (gridView) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group bg-slate-900/50 border border-white/5 rounded-2xl p-5 hover:border-violet-500/30 hover:bg-slate-800/50 transition-all duration-300"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-violet-500/30 transition-colors shrink-0">
                            <FileText className="h-6 w-6 text-gray-400 group-hover:text-violet-400 transition-colors" />
                        </div>
                        <div className="min-w-0 flex-1">
                            {isRenaming ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full bg-slate-800 border border-violet-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                                    />
                                    <button onClick={handleRenameSubmit} className="text-green-400 hover:text-green-300">
                                        <CheckCircle className="h-4 w-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 group/title">
                                    <h3 className="font-medium text-white truncate max-w-[150px]">
                                        {title}
                                    </h3>
                                    <button
                                        onClick={() => setIsRenaming(true)}
                                        className="opacity-0 group-hover/title:opacity-100 text-gray-500 hover:text-white transition-opacity"
                                    >
                                        <Edit3 className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                            <p className="text-xs text-gray-500 truncate max-w-[150px]">
                                {resume.originalFile?.filename}
                            </p>
                        </div>
                    </div>
                    <span className={`text-2xl font-bold ${scoreColor}`}>
                        {score}%
                    </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                    <Clock className="h-3 w-3" />
                    <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                    <span className={`ml-auto px-2 py-1 rounded-lg ${statusConfig.color}`}>
                        {statusConfig.label}
                    </span>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => navigate(`/editor/${resume._id}`)}
                        disabled={!canEdit}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-violet-600/10 text-violet-400 hover:bg-violet-600/20 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        <Edit className="h-4 w-4" />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(resume._id)}
                        className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            </motion.div>
        );
    }

    // List view / compact
    return (
        <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="group flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-slate-900/50 border border-white/5 rounded-xl hover:border-violet-500/30 hover:bg-slate-800/50 transition-all duration-300"
        >
            {/* Left Section */}
            <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 group-hover:border-violet-500/20 shrink-0">
                    <FileText className="h-5 w-5 text-gray-400 group-hover:text-violet-400 transition-colors" />
                </div>
                <div className="min-w-0 flex-1">
                    {isRenaming ? (
                        <div className="flex items-center gap-2 max-w-xs">
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-slate-800 border border-violet-500/50 rounded px-2 py-1 text-sm text-white focus:outline-none"
                                autoFocus
                                onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
                            />
                            <button onClick={handleRenameSubmit} className="text-green-400 hover:text-green-300">
                                <CheckCircle className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 group/title">
                            <h3 className="font-medium text-white truncate">
                                {title}
                            </h3>
                            <button
                                onClick={() => setIsRenaming(true)}
                                className="opacity-0 group-hover/title:opacity-100 text-gray-500 hover:text-white transition-opacity"
                            >
                                <Edit3 className="h-3 w-3" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(resume.createdAt).toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-0.5 rounded-lg ${statusConfig.color}`}>
                            {statusConfig.label}
                        </span>
                    </div>
                </div>
            </div>

            {/* Score */}
            {!compact && score > 0 && (
                <div className="flex items-center gap-2 shrink-0">
                    <div className="text-center px-4 py-2 bg-slate-800/50 rounded-xl border border-white/5">
                        <div className="text-xs text-gray-500 mb-0.5">ATS Score</div>
                        <div className={`text-xl font-bold ${scoreColor}`}>{score}%</div>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 sm:ml-auto">
                {compact && score > 0 && (
                    <span className={`text-lg font-bold ${scoreColor} mr-2`}>{score}%</span>
                )}
                <button
                    onClick={() => navigate(`/editor/${resume._id}`)}
                    disabled={!canEdit}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    title="Edit"
                >
                    <Edit className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete(resume._id)}
                    className="p-2.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
};

const ATSCheckTab = ({ resumes }) => {
    const [leftSelection, setLeftSelection] = useState('select');
    const [rightSelection, setRightSelection] = useState('select'); // 'select' or 'upload'
    const [leftResumeId, setLeftResumeId] = useState('');
    const [rightResumeId, setRightResumeId] = useState('');
    const [compareFile, setCompareFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [comparisonResult, setComparisonResult] = useState(null);

    const handleAnalyze = async () => {
        setIsAnalyzing(true);
        setComparisonResult(null);

        try {
            // 1. Fetch Left Resume Analysis
            let leftResult = null;
            if (leftResumeId) {
                const res = await api.post(`/resumes/${leftResumeId}/analyze`, {}, { baseURL: API_BASE_URL });
                leftResult = res.data;
            }

            // 2. Fetch Right Resume Analysis
            let rightResult = null;
            if (rightSelection === 'select' && rightResumeId) {
                const res = await api.post(`/resumes/${rightResumeId}/analyze`, {}, { baseURL: API_BASE_URL });
                rightResult = res.data;
            } else if (rightSelection === 'upload' && compareFile) {
                const formData = new FormData();
                formData.append('resume', compareFile);
                const res = await api.post('/resumes/analyze-file', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    baseURL: API_BASE_URL
                });
                rightResult = res.data;
            }

            setComparisonResult({
                left: leftResult,
                right: rightResult
            });
            toast.success('Analysis Complete');

        } catch (error) {
            toast.error('Analysis failed: ' + (error.response?.data?.message || error.message));
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 max-w-5xl mx-auto"
        >
            <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-lg bg-violet-600/20 text-violet-400">
                        <CheckCircle className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">ATS Score Comparison</h2>
                        <p className="text-gray-400 text-sm">Compare two resumes to see improvements in real-time.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start relative">
                    {/* Divider for desktop */}
                    <div className="hidden md:block absolute left-1/2 top-10 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-x-1/2" />

                    {/* Left Column (Baseline) */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-300 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs border border-white/10">A</span>
                            Original Resume
                        </h3>
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-3">
                            <label className="text-xs text-gray-500 font-medium uppercase">Select from Uploads</label>
                            <select
                                value={leftResumeId}
                                onChange={(e) => setLeftSelection(e.target.value !== '' ? 'select' : 'select') || setLeftResumeId(e.target.value)}
                                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500/50 outline-none"
                            >
                                <option value="">Select a resume...</option>
                                {resumes.map(r => (
                                    <option key={r._id} value={r._id}>
                                        {r.title || r.originalFile?.filename}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Right Column (Comparison) */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-300 flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs border border-white/10">B</span>
                            New Version
                        </h3>
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 space-y-4">
                            <div className="flex bg-slate-800/50 p-1 rounded-lg">
                                <button
                                    onClick={() => setRightSelection('select')}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${rightSelection === 'select' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Select Existing
                                </button>
                                <button
                                    onClick={() => setRightSelection('upload')}
                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${rightSelection === 'upload' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                                >
                                    Upload New File
                                </button>
                            </div>

                            {rightSelection === 'select' ? (
                                <select
                                    value={rightResumeId}
                                    onChange={(e) => setRightResumeId(e.target.value)}
                                    className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:ring-2 focus:ring-violet-500/50 outline-none"
                                >
                                    <option value="">Select a resume...</option>
                                    {resumes.map(r => (
                                        <option key={r._id} value={r._id}>
                                            {r.title || r.originalFile?.filename}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <div className="border border-dashed border-white/10 rounded-lg p-4 text-center hover:bg-slate-800/50 transition-colors relative">
                                    <input
                                        type="file"
                                        onChange={(e) => setCompareFile(e.target.files[0])}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf,.docx,.txt"
                                    />
                                    <div className="space-y-2 pointer-events-none">
                                        <Upload className="h-6 w-6 text-violet-400 mx-auto" />
                                        <div className="text-xs text-gray-400">
                                            {compareFile ? (
                                                <span className="text-green-400 font-medium">{compareFile.name}</span>
                                            ) : (
                                                <span>Click to browse or drop file</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <Button
                        variant="gradient"
                        onClick={handleAnalyze}
                        isLoading={isAnalyzing}
                        disabled={!leftResumeId || (rightSelection === 'select' && !rightResumeId) || (rightSelection === 'upload' && !compareFile)}
                        className="px-8 shadow-lg shadow-violet-600/25"
                    >
                        Analyze & Compare <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </Card>

            {/* Results Section */}
            <AnimatePresence>
                {comparisonResult && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Overall Score Comparison */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Score A */}
                            <ScoreCard
                                title="Resume A"
                                score={comparisonResult.left?.atsScore?.overall || 0}
                                filename={comparisonResult.left?.title || comparisonResult.left?.filename}
                                color="slate"
                            />

                            {/* Comparison Result */}
                            <div className="md:col-span-1 flex flex-col justify-center items-center text-center p-6 bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-white/5">
                                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Difference</span>
                                {(() => {
                                    const diff = (comparisonResult.right?.atsScore?.overall || 0) - (comparisonResult.left?.atsScore?.overall || 0);
                                    let textColor = 'text-gray-400';
                                    if (diff > 0) textColor = 'text-green-400';
                                    else if (diff < 0) textColor = 'text-red-400';

                                    return (
                                        <div className="space-y-2">
                                            <div className={`text-4xl font-bold ${textColor}`}>
                                                {diff > 0 ? '+' : ''}{diff}%
                                            </div>
                                            <p className="text-xs text-gray-400">
                                                {diff > 0 ? 'Great improvement!' : diff < 0 ? 'Score decreased' : 'No change'}
                                            </p>
                                        </div>
                                    );
                                })()}
                            </div>

                            {/* Score B */}
                            <ScoreCard
                                title="Resume B"
                                score={comparisonResult.right?.atsScore?.overall || 0}
                                filename={comparisonResult.right?.title || comparisonResult.right?.filename}
                                color="violet"
                                highlight
                            />
                        </div>

                        {/* Detailed Breakdown */}
                        <Card className="p-6">
                            <h3 className="font-semibold mb-6 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-violet-400" />
                                Detailed Breakdown
                            </h3>
                            <div className="space-y-6">
                                <ComparisonRow
                                    label="Keyword Optimization"
                                    scoreA={comparisonResult.left?.atsScore?.keywordOptimization}
                                    scoreB={comparisonResult.right?.atsScore?.keywordOptimization}
                                />
                                <ComparisonRow
                                    label="Formatting & Layout"
                                    scoreA={comparisonResult.left?.atsScore?.formatting}
                                    scoreB={comparisonResult.right?.atsScore?.formatting}
                                />
                                <ComparisonRow
                                    label="Structure & Content"
                                    scoreA={comparisonResult.left?.atsScore?.structure}
                                    scoreB={comparisonResult.right?.atsScore?.structure}
                                />
                            </div>
                        </Card>

                        {/* Issues / Improvements */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <IssuesCard
                                title="Issues in Resume A"
                                items={comparisonResult.left?.atsScore?.issues || []}
                            />
                            <IssuesCard
                                title="Issues in Resume B"
                                items={comparisonResult.right?.atsScore?.issues || []}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

const ScoreCard = ({ title, score, filename, color, highlight }) => {
    const getColor = (s) => s >= 80 ? 'text-green-400' : s >= 60 ? 'text-yellow-400' : 'text-red-400';
    return (
        <div className={`p-6 rounded-2xl border ${highlight ? 'bg-violet-600/10 border-violet-500/30' : 'bg-slate-900 border-white/5'} flex flex-col items-center justify-center text-center relative overflow-hidden`}>
            {highlight && <div className="absolute top-0 right-0 p-2 bg-violet-600 rounded-bl-xl text-[10px] font-bold text-white">NEW</div>}
            <h4 className="text-sm text-gray-400 font-medium mb-1">{title}</h4>
            <p className="text-xs text-gray-500 mb-4 truncate max-w-[150px]">{filename}</p>
            <div className={`text-5xl font-bold mb-2 ${getColor(score)}`}>{score}</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">ATS Score</div>
        </div>
    );
};

const ComparisonRow = ({ label, scoreA = 0, scoreB = 0 }) => (
    <div className="space-y-2">
        <div className="flex justify-between text-sm">
            <span className="text-gray-400">{label}</span>
            <div className="flex gap-8 font-mono text-xs">
                <span className="text-gray-500">A: {scoreA}</span>
                <span className="text-violet-400">B: {scoreB}</span>
            </div>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden flex">
            {/* Split bar visualisation sort of */}
            <div className="h-full bg-gray-600/30 rounded-l-full" style={{ width: '50%' }}>
                <div className="h-full bg-gray-500 ml-auto" style={{ width: `${scoreA}%` }}></div>
            </div>
            <div className="w-0.5 bg-black"></div>
            <div className="h-full bg-violet-600/20 rounded-r-full" style={{ width: '50%' }}>
                <div className="h-full bg-violet-500 mr-auto" style={{ width: `${scoreB}%` }}></div>
            </div>
        </div>
    </div>
);

const IssuesCard = ({ title, items }) => (
    <Card className="p-6">
        <h4 className="font-semibold mb-4 text-sm text-gray-400 uppercase tracking-widest">{title}</h4>
        {items.length > 0 ? (
            <ul className="space-y-3">
                {items.map((item, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
                <CheckCircle className="h-8 w-8 text-green-500/50 mx-auto mb-2" />
                No major issues found
            </div>
        )}
    </Card>
);

export default Dashboard;
