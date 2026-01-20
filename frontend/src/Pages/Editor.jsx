import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Download, Save, Loader, RefreshCw, Edit3, Eye,
    Plus, Trash2, CheckCircle, AlertCircle, Sparkles, Layout, ChevronDown,
    Type, Palette, X, Menu, ChevronLeft, ChevronRight, Cloud, CloudOff
} from 'lucide-react';
import api, { API_BASE_URL } from '../Services/api';
import toast from 'react-hot-toast';

// Import UI Components
import Button from '../Components/UI/Button';
import Input from '../Components/UI/Input';
import TagsInput from '../Components/UI/TagsInput';

// Import templates
import {
    ProfessionalTemplate, ModernTemplate, MinimalTemplate, CreativeTemplate,
    ExecutiveTemplate, TechnicalTemplate, AcademicTemplate, CompactTemplate,
    TEMPLATES, FONTS, ACCENT_COLORS
} from '../Components/Resume/templates';

const Editor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const previewRef = useRef(null);

    const [resume, setResume] = useState(null);
    const [resumeData, setResumeData] = useState(null);
    const [atsScore, setAtsScore] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isRegenerating, setIsRegenerating] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState('professional');
    const [selectedFont, setSelectedFont] = useState('Inter');
    const [accentColor, setAccentColor] = useState('#2563eb');

    // UI States
    const [showSidebar, setShowSidebar] = useState(true);
    const [showMobilePanel, setShowMobilePanel] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [editingSection, setEditingSection] = useState('personal');
    const [sectionVisibility, setSectionVisibility] = useState({
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        awards: true
    });

    // Refs
    const pollIntervalRef = useRef(null);
    const autosaveTimeoutRef = useRef(null);
    const lastSavedDataRef = useRef(null);

    // Autosave states
    const [autoSaveStatus, setAutoSaveStatus] = useState('saved'); // 'saved', 'saving', 'unsaved', 'error'
    const [lastAutoSaved, setLastAutoSaved] = useState(null);
    const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

    // LocalStorage key for draft
    const DRAFT_STORAGE_KEY = `resume_draft_${id}`;
    const DRAFT_TIMESTAMP_KEY = `resume_draft_timestamp_${id}`;

    // Save to localStorage (instant backup)
    const saveDraftToLocalStorage = useCallback((data) => {
        if (!data || !id) return;
        try {
            localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
            localStorage.setItem(DRAFT_TIMESTAMP_KEY, Date.now().toString());
        } catch (e) {
            console.error('Failed to save draft to localStorage:', e);
        }
    }, [id, DRAFT_STORAGE_KEY, DRAFT_TIMESTAMP_KEY]);

    // Load draft from localStorage
    const loadDraftFromLocalStorage = useCallback(() => {
        try {
            const draft = localStorage.getItem(DRAFT_STORAGE_KEY);
            const timestamp = localStorage.getItem(DRAFT_TIMESTAMP_KEY);
            if (draft && timestamp) {
                return {
                    data: JSON.parse(draft),
                    timestamp: parseInt(timestamp, 10)
                };
            }
        } catch (e) {
            console.error('Failed to load draft from localStorage:', e);
        }
        return null;
    }, [DRAFT_STORAGE_KEY, DRAFT_TIMESTAMP_KEY]);

    // Clear draft from localStorage
    const clearDraftFromLocalStorage = useCallback(() => {
        try {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            localStorage.removeItem(DRAFT_TIMESTAMP_KEY);
        } catch (e) {
            console.error('Failed to clear draft:', e);
        }
    }, [DRAFT_STORAGE_KEY, DRAFT_TIMESTAMP_KEY]);

    // Debounced autosave to backend
    const autoSaveToBackend = useCallback(async (data) => {
        if (!data || !id) return;

        // Check if data has actually changed
        const currentDataStr = JSON.stringify(data);
        if (lastSavedDataRef.current === currentDataStr) {
            return; // No changes, skip save
        }

        setAutoSaveStatus('saving');
        try {
            const response = await api.put(`/resumes/${id}`, { resumeData: data }, { baseURL: API_BASE_URL });
            setAtsScore(response.data.atsScore);
            lastSavedDataRef.current = currentDataStr;
            setAutoSaveStatus('saved');
            setLastAutoSaved(new Date());
            // Clear localStorage draft after successful backend save
            clearDraftFromLocalStorage();
        } catch (error) {
            console.error('Autosave failed:', error);
            setAutoSaveStatus('error');
            // Show error toast for debugging
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again.');
            } else if (error.response?.status === 404) {
                toast.error('Resume not found. It may have been deleted.');
            } else {
                toast.error('Auto-save failed. Changes saved locally.');
            }
            // Keep localStorage draft as backup
        }
    }, [id, clearDraftFromLocalStorage]);

    // Effect: Autosave when resumeData changes
    useEffect(() => {
        if (!resumeData || isLoading) return;

        // Save to localStorage immediately (backup)
        saveDraftToLocalStorage(resumeData);
        setAutoSaveStatus('unsaved');

        // Clear any pending autosave timeout
        if (autosaveTimeoutRef.current) {
            clearTimeout(autosaveTimeoutRef.current);
        }

        // Debounced save to backend (2 seconds after user stops typing)
        autosaveTimeoutRef.current = setTimeout(() => {
            autoSaveToBackend(resumeData);
        }, 2000);

        return () => {
            if (autosaveTimeoutRef.current) {
                clearTimeout(autosaveTimeoutRef.current);
            }
        };
    }, [resumeData, isLoading, saveDraftToLocalStorage, autoSaveToBackend]);

    // Fetch resume and poll for updates
    useEffect(() => {
        const fetchResume = async () => {
            try {
                const response = await api.get(`/resumes/${id}`, { baseURL: API_BASE_URL });
                setResume(response.data);

                // Check for local draft
                const localDraft = loadDraftFromLocalStorage();
                const serverData = response.data.resumeData || {};
                const serverTimestamp = new Date(response.data.updatedAt).getTime();

                // Use local draft if it's more recent than server data
                if (localDraft && localDraft.timestamp > serverTimestamp && Object.keys(localDraft.data).length > 0) {
                    setResumeData(localDraft.data);
                    toast.success('Restored your unsaved changes!', { icon: '📝' });
                } else {
                    setResumeData(serverData);
                    // Store the initial server data as "last saved" reference
                    lastSavedDataRef.current = JSON.stringify(serverData);
                }

                setAtsScore(response.data.atsScore || {});

                // Poll for all interim statuses: processing, analyzing, generating
                const interimStatuses = ['processing', 'analyzing', 'generating', 'uploading'];
                if (interimStatuses.includes(response.data.status)) {
                    // Clear any existing interval
                    if (pollIntervalRef.current) {
                        clearInterval(pollIntervalRef.current);
                    }

                    pollIntervalRef.current = setInterval(async () => {
                        try {
                            const pollResponse = await api.get(`/resumes/${id}`, { baseURL: API_BASE_URL });

                            // Always update the resume state
                            setResume(pollResponse.data);

                            // Update data when available - use spread to ensure new object reference
                            if (pollResponse.data.resumeData && Object.keys(pollResponse.data.resumeData).length > 0) {
                                setResumeData({ ...pollResponse.data.resumeData });
                                lastSavedDataRef.current = JSON.stringify(pollResponse.data.resumeData);
                            }
                            if (pollResponse.data.atsScore) {
                                setAtsScore({ ...pollResponse.data.atsScore });
                            }

                            // Stop polling when status is final (completed, analyzed, or failed)
                            if (!interimStatuses.includes(pollResponse.data.status)) {
                                clearInterval(pollIntervalRef.current);
                                pollIntervalRef.current = null;
                                // Show success toast when AI completes
                                if (pollResponse.data.status === 'completed') {
                                    toast.success('AI Resume Generated Successfully!');
                                }
                            }
                        } catch (e) {
                            console.error('Polling error:', e);
                            clearInterval(pollIntervalRef.current);
                            pollIntervalRef.current = null;
                        }
                    }, 1500); // Poll every 1.5 seconds for faster updates
                }
            } catch (error) {
                toast.error('Failed to load resume');
                navigate('/dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        fetchResume();

        // Cleanup on unmount
        return () => {
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
                pollIntervalRef.current = null;
            }
            if (autosaveTimeoutRef.current) {
                clearTimeout(autosaveTimeoutRef.current);
            }
        };
    }, [id, navigate, loadDraftFromLocalStorage]);

    // Warn before leaving with unsaved changes
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (autoSaveStatus === 'unsaved' || autoSaveStatus === 'saving') {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [autoSaveStatus]);

    // Handlers
    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await api.put(`/resumes/${id}`, { resumeData }, { baseURL: API_BASE_URL });
            setAtsScore(response.data.atsScore);
            lastSavedDataRef.current = JSON.stringify(resumeData);
            setAutoSaveStatus('saved');
            setLastAutoSaved(new Date());
            clearDraftFromLocalStorage();
            toast.success('Resume saved!');
        } catch (error) {
            toast.error('Failed to save');
            setAutoSaveStatus('error');
        }
        finally { setIsSaving(false); }
    };

    const handleRegenerate = async () => {
        if (!confirm('This will overwrite your edits. Continue?')) return;
        setIsRegenerating(true);
        toast.loading('Regenerating...', { id: 'regen' });
        try {
            await api.post(`/resumes/${id}/regenerate`, {}, { baseURL: API_BASE_URL });

            // Update status locally to trigger the AI generating view
            setResume(prev => ({ ...prev, status: 'generating' }));

            // Clear any existing polling interval
            if (pollIntervalRef.current) {
                clearInterval(pollIntervalRef.current);
            }

            // Start polling for updates
            const interimStatuses = ['processing', 'analyzing', 'generating', 'uploading'];
            pollIntervalRef.current = setInterval(async () => {
                try {
                    const pollResponse = await api.get(`/resumes/${id}`, { baseURL: API_BASE_URL });
                    setResume(pollResponse.data);

                    if (pollResponse.data.resumeData && Object.keys(pollResponse.data.resumeData).length > 0) {
                        setResumeData({ ...pollResponse.data.resumeData });
                    }
                    if (pollResponse.data.atsScore) {
                        setAtsScore({ ...pollResponse.data.atsScore });
                    }

                    if (!interimStatuses.includes(pollResponse.data.status)) {
                        clearInterval(pollIntervalRef.current);
                        pollIntervalRef.current = null;
                        setIsRegenerating(false);
                        if (pollResponse.data.status === 'completed') {
                            toast.success('AI Resume Regenerated!', { id: 'regen' });
                        }
                    }
                } catch (e) {
                    console.error('Polling error:', e);
                    clearInterval(pollIntervalRef.current);
                    pollIntervalRef.current = null;
                    setIsRegenerating(false);
                    toast.error('Polling failed', { id: 'regen' });
                }
            }, 1500);

        } catch (error) {
            toast.error('Failed to regenerate', { id: 'regen' });
            setIsRegenerating(false);
        }
    };

    const downloadPDF = async () => {
        toast.loading('Generating PDF...', { id: 'pdf' });
        try {
            const { default: html2pdf } = await import('html2pdf.js');
            await html2pdf().set({
                margin: 0,
                filename: `${resumeData?.personalInfo?.fullName || 'resume'}.pdf`,
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    letterRendering: true,
                    logging: false
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak: { mode: 'avoid-all', before: '.page-break-before', after: '.page-break-after' }
            }).from(previewRef.current).save();
            toast.success('Downloaded!', { id: 'pdf' });
        } catch (e) {
            console.error('PDF generation error:', e);
            toast.error('Failed to generate PDF', { id: 'pdf' });
        }
    };

    // Data handlers
    const updatePersonalInfo = (field, value) => {
        setResumeData(prev => ({ ...prev, personalInfo: { ...prev?.personalInfo, [field]: value } }));
    };

    const updateArrayItem = (section, index, field, value) => {
        setResumeData(prev => {
            const newArray = [...(prev?.[section] || [])];
            newArray[index] = { ...newArray[index], [field]: value };
            return { ...prev, [section]: newArray };
        });
    };

    const addArrayItem = (section, initialData) => {
        setResumeData(prev => ({ ...prev, [section]: [...(prev?.[section] || []), initialData] }));
    };

    const removeArrayItem = (section, index) => {
        setResumeData(prev => ({ ...prev, [section]: prev?.[section]?.filter((_, i) => i !== index) || [] }));
    };

    const updateBullet = (section, itemIndex, field, bulletIndex, value) => {
        setResumeData(prev => {
            const newArray = [...(prev?.[section] || [])];
            const items = [...(newArray[itemIndex]?.[field] || [])];
            items[bulletIndex] = value;
            newArray[itemIndex] = { ...newArray[itemIndex], [field]: items };
            return { ...prev, [section]: newArray };
        });
    };

    const addBullet = (section, index, field) => {
        setResumeData(prev => {
            const newArray = [...(prev?.[section] || [])];
            const items = [...(newArray[index]?.[field] || []), 'New item'];
            newArray[index] = { ...newArray[index], [field]: items };
            return { ...prev, [section]: newArray };
        });
    };

    const removeBullet = (section, itemIndex, field, bulletIndex) => {
        setResumeData(prev => {
            const newArray = [...(prev?.[section] || [])];
            const items = newArray[itemIndex]?.[field]?.filter((_, i) => i !== bulletIndex) || [];
            newArray[itemIndex] = { ...newArray[itemIndex], [field]: items };
            return { ...prev, [section]: newArray };
        });
    };

    const updateSkills = (category, value) => {
        setResumeData(prev => ({
            ...prev, skills: { ...prev?.skills, [category]: value.split(',').map(s => s.trim()).filter(s => s) }
        }));
    };

    // Render template with section visibility
    const renderTemplate = () => {
        // Apply section visibility filter
        const filteredData = { ...resumeData };
        Object.keys(sectionVisibility).forEach(key => {
            if (!sectionVisibility[key]) {
                // Handle special case: 'languages' visibility controls 'spokenLanguages' data
                if (key === 'languages') {
                    filteredData.spokenLanguages = [];
                } else {
                    filteredData[key] = key === 'skills' ? {} : [];
                }
            }
        });

        const props = { resumeData: filteredData, fontFamily: selectedFont, accentColor };
        switch (selectedTemplate) {
            case 'modern': return <ModernTemplate {...props} />;
            case 'minimal': return <MinimalTemplate {...props} />;
            case 'creative': return <CreativeTemplate {...props} />;
            case 'executive': return <ExecutiveTemplate {...props} />;
            case 'technical': return <TechnicalTemplate {...props} />;
            case 'academic': return <AcademicTemplate {...props} />;
            case 'compact': return <CompactTemplate {...props} />;
            default: return <ProfessionalTemplate {...props} />;
        }
    };

    const sections = [
        { id: 'personal', label: 'Personal', icon: '👤' },
        { id: 'summary', label: 'Summary', icon: '📝' },
        { id: 'experience', label: 'Experience', icon: '💼' },
        { id: 'education', label: 'Education', icon: '🎓' },
        { id: 'skills', label: 'Skills', icon: '⚡' },
        { id: 'projects', label: 'Projects', icon: '🚀' },
        { id: 'certifications', label: 'Certs', icon: '🏆' },
        { id: 'languages', label: 'Languages', icon: '🌐' },
        { id: 'awards', label: 'Awards', icon: '🎖️' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="h-10 w-10 text-violet-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading resume...</p>
                </div>
            </div>
        );
    }

    // Show AI generating overlay ONLY when resume is actively being processed by AI
    // Blank resumes have status 'completed' so they will skip this overlay
    const isAIGenerating = ['processing', 'analyzing', 'generating', 'uploading'].includes(resume?.status);

    if (isAIGenerating) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center max-w-md px-6">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30 animate-pulse">
                            <Sparkles className="h-10 w-10 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
                            <Loader className="h-3 w-3 text-white animate-spin" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">AI is Analyzing Your Resume</h2>
                    <p className="text-gray-400 mb-4">
                        {resume?.status === 'processing' && 'Processing your document...'}
                        {resume?.status === 'analyzing' && 'Analyzing content and structure...'}
                        {resume?.status === 'generating' && 'Generating ATS-optimized resume...'}
                        {resume?.status === 'uploading' && 'Uploading your file...'}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <div className="w-2 h-2 bg-violet-500 rounded-full animate-pulse"></div>
                        <span>This usually takes 10-30 seconds</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans flex flex-col">
            {/* Top Header */}
            <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between px-3 sm:px-4 py-3 gap-2">
                    {/* Left */}
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="p-2 rounded-xl hover:bg-white/5 transition-colors shrink-0"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-400" />
                        </button>
                        <div className="min-w-0 hidden sm:block">
                            <h1 className="font-semibold text-sm truncate max-w-[180px]">
                                {resumeData?.personalInfo?.fullName || 'Untitled'}
                            </h1>
                            <div className="flex items-center gap-2 text-xs">
                                <span className={`px-2 py-0.5 rounded-full font-medium ${atsScore?.overall >= 80 ? 'bg-green-500/10 text-green-400' :
                                    atsScore?.overall >= 60 ? 'bg-yellow-500/10 text-yellow-400' :
                                        'bg-red-500/10 text-red-400'
                                    }`}>
                                    ATS: {atsScore?.overall || 0}%
                                </span>
                                {/* Autosave Status Indicator */}
                                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium transition-all ${autoSaveStatus === 'saved' ? 'bg-green-500/10 text-green-400' :
                                    autoSaveStatus === 'saving' ? 'bg-blue-500/10 text-blue-400' :
                                        autoSaveStatus === 'unsaved' ? 'bg-yellow-500/10 text-yellow-400' :
                                            'bg-red-500/10 text-red-400'
                                    }`}>
                                    {autoSaveStatus === 'saved' && <><Cloud className="h-3 w-3" /> Saved</>}
                                    {autoSaveStatus === 'saving' && <><Loader className="h-3 w-3 animate-spin" /> Saving...</>}
                                    {autoSaveStatus === 'unsaved' && <><CloudOff className="h-3 w-3" /> Unsaved</>}
                                    {autoSaveStatus === 'error' && <><AlertCircle className="h-3 w-3" /> Error</>}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center - Design Controls */}
                    <div className="hidden md:flex items-center gap-1 bg-slate-800/50 rounded-xl p-1 border border-white/5">
                        {/* Template */}
                        <DropdownButton
                            icon={Layout}
                            label={TEMPLATES.find(t => t.id === selectedTemplate)?.name || 'Template'}
                            isOpen={activeDropdown === 'template'}
                            onClick={() => setActiveDropdown(activeDropdown === 'template' ? null : 'template')}
                        >
                            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                                {TEMPLATES.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setSelectedTemplate(t.id); setActiveDropdown(null); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedTemplate === t.id ? 'bg-violet-600' : 'hover:bg-white/5'
                                            }`}
                                    >
                                        {t.name}
                                    </button>
                                ))}
                            </div>
                        </DropdownButton>

                        <div className="w-px h-5 bg-white/10" />

                        {/* Font */}
                        <DropdownButton
                            icon={Type}
                            label={selectedFont}
                            isOpen={activeDropdown === 'font'}
                            onClick={() => setActiveDropdown(activeDropdown === 'font' ? null : 'font')}
                        >
                            <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                                {FONTS.map(f => (
                                    <button
                                        key={f.id}
                                        onClick={() => { setSelectedFont(f.id); setActiveDropdown(null); }}
                                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedFont === f.id ? 'bg-violet-600' : 'hover:bg-white/5'
                                            }`}
                                        style={{ fontFamily: f.id }}
                                    >
                                        {f.name}
                                    </button>
                                ))}
                            </div>
                        </DropdownButton>

                        <div className="w-px h-5 bg-white/10" />

                        {/* Color */}
                        <DropdownButton
                            icon={() => <div className="w-4 h-4 rounded-full" style={{ backgroundColor: accentColor }} />}
                            isOpen={activeDropdown === 'color'}
                            onClick={() => setActiveDropdown(activeDropdown === 'color' ? null : 'color')}
                        >
                            <div className="p-3 grid grid-cols-5 gap-2">
                                {ACCENT_COLORS.map(c => (
                                    <button
                                        key={c.id}
                                        onClick={() => { setAccentColor(c.value); setActiveDropdown(null); }}
                                        className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${accentColor === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                                            }`}
                                        style={{ backgroundColor: c.value }}
                                        title={c.name}
                                    />
                                ))}
                            </div>
                        </DropdownButton>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        <button
                            onClick={handleRegenerate}
                            disabled={isRegenerating}
                            className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-yellow-400 hover:bg-yellow-500/10 transition-colors disabled:opacity-50"
                            title="Regenerate with AI"
                        >
                            <Sparkles className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
                            <span className="hidden lg:inline text-sm">AI</span>
                        </button>

                        <Button onClick={handleSave} isLoading={isSaving} variant="secondary" size="sm">
                            <Save className="h-4 w-4 sm:mr-1.5" />
                            <span className="hidden sm:inline">Save</span>
                        </Button>

                        <Button onClick={downloadPDF} variant="gradient" size="sm" className="shadow-lg shadow-violet-600/20">
                            <Download className="h-4 w-4 sm:mr-1.5" />
                            <span className="hidden sm:inline">PDF</span>
                        </Button>

                        {/* Mobile menu */}
                        <button
                            onClick={() => setShowMobilePanel(true)}
                            className="lg:hidden p-2 rounded-xl hover:bg-white/5"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Sidebar - Desktop */}
                <aside className={`hidden lg:flex flex-col ${showSidebar ? 'w-96 xl:w-[420px]' : 'w-0'} bg-slate-900 border-r border-white/5 transition-all duration-300`}>
                    {showSidebar && (
                        <>
                            {/* Section Tabs */}
                            <div
                                className="flex items-center gap-1 p-2 border-b border-white/5 overflow-x-auto"
                                style={{
                                    scrollbarWidth: 'thin',
                                    WebkitOverflowScrolling: 'touch',
                                    scrollbarColor: 'rgba(139, 92, 246, 0.3) transparent'
                                }}
                            >
                                {sections.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setEditingSection(s.id)}
                                        className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${editingSection === s.id
                                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/20'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <span className="mr-1.5">{s.icon}</span>
                                        {s.label}
                                    </button>
                                ))}
                            </div>

                            {/* Form Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-5">
                                {editingSection === 'personal' && (
                                    <FormSection title="Personal Details">
                                        <Input label="Full Name" value={resumeData?.personalInfo?.fullName || ''} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} placeholder="John Doe" />
                                        <Input label="Professional Title" value={resumeData?.personalInfo?.title || ''} onChange={(e) => updatePersonalInfo('title', e.target.value)} placeholder="Senior Software Engineer" />
                                        <Input label="Email" type="email" value={resumeData?.personalInfo?.email || ''} onChange={(e) => updatePersonalInfo('email', e.target.value)} placeholder="john@example.com" />
                                        <Input label="Phone" value={resumeData?.personalInfo?.phone || ''} onChange={(e) => updatePersonalInfo('phone', e.target.value)} placeholder="+1 (555) 123-4567" />
                                        <Input label="Location" value={resumeData?.personalInfo?.location || ''} onChange={(e) => updatePersonalInfo('location', e.target.value)} placeholder="New York, NY" />

                                        <div className="pt-3 border-t border-white/10">
                                            <h4 className="text-sm text-gray-400 font-medium mb-3">Social & Links</h4>
                                            <div className="space-y-3">
                                                <Input label="LinkedIn URL" value={resumeData?.personalInfo?.linkedin || ''} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" />
                                                <Input label="GitHub URL" value={resumeData?.personalInfo?.github || ''} onChange={(e) => updatePersonalInfo('github', e.target.value)} placeholder="github.com/johndoe" />
                                                <Input label="Portfolio/Website" value={resumeData?.personalInfo?.portfolio || ''} onChange={(e) => updatePersonalInfo('portfolio', e.target.value)} placeholder="johndoe.dev" />
                                            </div>
                                        </div>

                                        <div className="pt-3 border-t border-white/10">
                                            <h4 className="text-sm text-gray-400 font-medium mb-3">Additional Info (Optional)</h4>
                                            <div className="space-y-3">
                                                <Input label="Nationality" value={resumeData?.personalInfo?.nationality || ''} onChange={(e) => updatePersonalInfo('nationality', e.target.value)} placeholder="American" />
                                                <Input label="Date of Birth" type="date" value={resumeData?.personalInfo?.dateOfBirth || ''} onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)} />
                                            </div>
                                        </div>
                                    </FormSection>
                                )}

                                {editingSection === 'summary' && (
                                    <FormSection title="Professional Summary">
                                        <div className="space-y-3">
                                            <textarea
                                                value={resumeData?.summary || ''}
                                                onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                                                className="w-full h-40 bg-slate-800/50 border border-white/10 rounded-xl p-4 text-sm text-white focus:ring-2 focus:ring-violet-500 outline-none resize-none"
                                                placeholder="Write a compelling professional summary..."
                                            />
                                            <button
                                                onClick={async () => {
                                                    setIsGeneratingSummary(true);
                                                    try {
                                                        const response = await api.post(`/resumes/${id}/generate-summary`, {
                                                            jobTitle: resumeData?.personalInfo?.title || ''
                                                        }, { baseURL: API_BASE_URL });
                                                        if (response.data.success) {
                                                            setResumeData(prev => ({ ...prev, summary: response.data.summary }));
                                                            toast.success('Summary generated!');
                                                        }
                                                    } catch (error) {
                                                        console.error('Generate summary error:', error);
                                                        toast.error('Failed to generate summary');
                                                    } finally {
                                                        setIsGeneratingSummary(false);
                                                    }
                                                }}
                                                disabled={isGeneratingSummary}
                                                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-violet-500/20"
                                            >
                                                {isGeneratingSummary ? (
                                                    <><Loader className="h-4 w-4 animate-spin" /> Generating...</>
                                                ) : (
                                                    <><Sparkles className="h-4 w-4" /> Generate with AI</>
                                                )}
                                            </button>
                                            <p className="text-xs text-gray-500">
                                                AI will create a summary based on your experience and skills
                                            </p>
                                        </div>
                                    </FormSection>
                                )}

                                {editingSection === 'experience' && (
                                    <FormSection
                                        title="Work Experience"
                                        onAdd={() => addArrayItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', current: false, employmentType: 'Full-time', workMode: 'On-site', technologies: [], achievements: [''] })}
                                    >
                                        {resumeData?.experience?.map((exp, i) => (
                                            <ItemCard key={i} index={i} onRemove={() => removeArrayItem('experience', i)}>
                                                <Input label="Job Title" value={exp.title || ''} onChange={(e) => updateArrayItem('experience', i, 'title', e.target.value)} placeholder="Senior Software Engineer" />
                                                <Input label="Company" value={exp.company || ''} onChange={(e) => updateArrayItem('experience', i, 'company', e.target.value)} placeholder="Google" />
                                                <Input label="Location" value={exp.location || ''} onChange={(e) => updateArrayItem('experience', i, 'location', e.target.value)} placeholder="San Francisco, CA" />

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">Employment Type</label>
                                                        <select value={exp.employmentType || 'Full-time'} onChange={(e) => updateArrayItem('experience', i, 'employmentType', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none">
                                                            <option value="Full-time">Full-time</option>
                                                            <option value="Part-time">Part-time</option>
                                                            <option value="Contract">Contract</option>
                                                            <option value="Internship">Internship</option>
                                                            <option value="Freelance">Freelance</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">Work Mode</label>
                                                        <select value={exp.workMode || 'On-site'} onChange={(e) => updateArrayItem('experience', i, 'workMode', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none">
                                                            <option value="On-site">On-site</option>
                                                            <option value="Remote">Remote</option>
                                                            <option value="Hybrid">Hybrid</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input label="Start Date" value={exp.startDate || ''} onChange={(e) => updateArrayItem('experience', i, 'startDate', e.target.value)} placeholder="Jan 2022" />
                                                    <Input label="End Date" value={exp.current ? 'Present' : (exp.endDate || '')} onChange={(e) => updateArrayItem('experience', i, 'endDate', e.target.value)} placeholder="Present" disabled={exp.current} />
                                                </div>

                                                <div className="flex items-center gap-2 p-2 bg-slate-800/30 rounded-lg">
                                                    <input type="checkbox" id={`current-${i}`} checked={exp.current || false} onChange={(e) => updateArrayItem('experience', i, 'current', e.target.checked)} className="w-4 h-4 accent-violet-500" />
                                                    <label htmlFor={`current-${i}`} className="text-sm text-gray-400">I currently work here</label>
                                                </div>

                                                <TagsInput
                                                    label="Technologies Used"
                                                    value={exp.technologies || []}
                                                    onChange={(tags) => updateArrayItem('experience', i, 'technologies', tags)}
                                                    placeholder="React, Node.js, AWS..."
                                                    tagColor="cyan"
                                                />

                                                <BulletList
                                                    items={exp.achievements}
                                                    onUpdate={(j, val) => updateBullet('experience', i, 'achievements', j, val)}
                                                    onAdd={() => addBullet('experience', i, 'achievements')}
                                                    onRemove={(j) => removeBullet('experience', i, 'achievements', j)}
                                                />
                                            </ItemCard>
                                        ))}
                                    </FormSection>
                                )}

                                {editingSection === 'education' && (
                                    <FormSection
                                        title="Education"
                                        onAdd={() => addArrayItem('education', { institution: '', degree: '', fieldOfStudy: '', location: '', graduationDate: '', gpa: '', showGpa: true, coursework: [], honors: '', activities: '' })}
                                    >
                                        {resumeData?.education?.map((edu, i) => (
                                            <ItemCard key={i} index={i} onRemove={() => removeArrayItem('education', i)}>
                                                <Input label="Institution" value={edu.institution || ''} onChange={(e) => updateArrayItem('education', i, 'institution', e.target.value)} placeholder="Harvard University" />
                                                <Input label="Degree" value={edu.degree || ''} onChange={(e) => updateArrayItem('education', i, 'degree', e.target.value)} placeholder="Bachelor of Science" />
                                                <Input label="Field of Study / Major" value={edu.fieldOfStudy || ''} onChange={(e) => updateArrayItem('education', i, 'fieldOfStudy', e.target.value)} placeholder="Computer Science" />
                                                <Input label="Location" value={edu.location || ''} onChange={(e) => updateArrayItem('education', i, 'location', e.target.value)} placeholder="Cambridge, MA" />

                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input label="Graduation Date" value={edu.graduationDate || ''} onChange={(e) => updateArrayItem('education', i, 'graduationDate', e.target.value)} placeholder="May 2024" />
                                                    <div>
                                                        <Input label="GPA" value={edu.gpa || ''} onChange={(e) => updateArrayItem('education', i, 'gpa', e.target.value)} placeholder="3.8/4.0" />
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <input type="checkbox" id={`showGpa-${i}`} checked={edu.showGpa !== false} onChange={(e) => updateArrayItem('education', i, 'showGpa', e.target.checked)} className="w-3 h-3 accent-violet-500" />
                                                            <label htmlFor={`showGpa-${i}`} className="text-xs text-gray-500">Show on resume</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <TagsInput
                                                    label="Relevant Coursework"
                                                    value={edu.coursework || []}
                                                    onChange={(tags) => updateArrayItem('education', i, 'coursework', tags)}
                                                    placeholder="Data Structures, Algorithms, Machine Learning..."
                                                    tagColor="green"
                                                />

                                                <Input label="Honors & Awards" value={edu.honors || ''} onChange={(e) => updateArrayItem('education', i, 'honors', e.target.value)} placeholder="Dean's List, Magna Cum Laude" />

                                                <Input label="Activities & Societies" value={edu.activities || ''} onChange={(e) => updateArrayItem('education', i, 'activities', e.target.value)} placeholder="Computer Science Club, Hackathon Organizer" />
                                            </ItemCard>
                                        ))}
                                    </FormSection>
                                )}

                                {editingSection === 'skills' && (
                                    <FormSection title="Skills">
                                        {/* Technical Skills Section */}
                                        <div className="space-y-4">
                                            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-2xl p-4 border border-violet-500/20">
                                                <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">💻</span>
                                                    Technical Skills
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                                                        <TagsInput
                                                            label="Programming Languages"
                                                            value={resumeData?.skills?.languages || []}
                                                            onChange={(tags) => setResumeData(prev => ({
                                                                ...prev, skills: { ...prev?.skills, languages: tags }
                                                            }))}
                                                            placeholder="JavaScript, Python, Java..."
                                                            tagColor="violet"
                                                        />
                                                    </div>

                                                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                                                        <TagsInput
                                                            label="Frameworks & Libraries"
                                                            value={resumeData?.skills?.frameworks || []}
                                                            onChange={(tags) => setResumeData(prev => ({
                                                                ...prev, skills: { ...prev?.skills, frameworks: tags }
                                                            }))}
                                                            placeholder="React, Next.js, Express..."
                                                            tagColor="cyan"
                                                        />
                                                    </div>

                                                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                                                        <TagsInput
                                                            label="Databases"
                                                            value={resumeData?.skills?.databases || []}
                                                            onChange={(tags) => setResumeData(prev => ({
                                                                ...prev, skills: { ...prev?.skills, databases: tags }
                                                            }))}
                                                            placeholder="MongoDB, PostgreSQL, Redis..."
                                                            tagColor="green"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Tools & Technologies Section - Made Distinct */}
                                            <div className="bg-gradient-to-r from-pink-500/10 to-orange-500/10 rounded-2xl p-4 border border-pink-500/20">
                                                <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">🛠️</span>
                                                    Tools & Technologies
                                                </h4>
                                                <div className="space-y-4">
                                                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                                                        <TagsInput
                                                            label="Development Tools"
                                                            value={resumeData?.skills?.tools || []}
                                                            onChange={(tags) => setResumeData(prev => ({
                                                                ...prev, skills: { ...prev?.skills, tools: tags }
                                                            }))}
                                                            placeholder="Git, VS Code, Figma, Jira..."
                                                            tagColor="pink"
                                                        />
                                                    </div>

                                                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                                                        <TagsInput
                                                            label="Cloud & DevOps"
                                                            value={resumeData?.skills?.cloud || []}
                                                            onChange={(tags) => setResumeData(prev => ({
                                                                ...prev, skills: { ...prev?.skills, cloud: tags }
                                                            }))}
                                                            placeholder="AWS, Docker, Kubernetes, CI/CD..."
                                                            tagColor="orange"
                                                        />
                                                    </div>

                                                    <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                                                        <TagsInput
                                                            label="Methodologies"
                                                            value={resumeData?.skills?.methodologies || []}
                                                            onChange={(tags) => setResumeData(prev => ({
                                                                ...prev, skills: { ...prev?.skills, methodologies: tags }
                                                            }))}
                                                            placeholder="Agile, Scrum, TDD..."
                                                            tagColor="yellow"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Soft Skills Section */}
                                            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl p-4 border border-blue-500/20">
                                                <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                                                    <span className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">🤝</span>
                                                    Soft Skills
                                                </h4>
                                                <div className="bg-slate-800/50 rounded-xl p-3 border border-white/5">
                                                    <TagsInput
                                                        value={resumeData?.skills?.soft || []}
                                                        onChange={(tags) => setResumeData(prev => ({
                                                            ...prev, skills: { ...prev?.skills, soft: tags }
                                                        }))}
                                                        placeholder="Leadership, Communication, Problem Solving..."
                                                        tagColor="blue"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-4 p-3 bg-slate-800/30 rounded-xl border border-dashed border-white/10">
                                            <p className="text-xs text-gray-400 flex items-center gap-2">
                                                <span className="text-violet-400">💡</span>
                                                <span><strong>Pro tip:</strong> Type and press Enter or comma to add skills. Paste comma-separated lists to bulk add. ATS systems parse categorized skills better!</span>
                                            </p>
                                        </div>
                                    </FormSection>
                                )}

                                {editingSection === 'projects' && (
                                    <FormSection
                                        title="Projects"
                                        onAdd={() => addArrayItem('projects', { name: '', description: '', technologies: [], demoUrl: '', repoUrl: '', startDate: '', endDate: '', projectType: 'Personal', teamSize: '', role: '', highlights: [] })}
                                    >
                                        {resumeData?.projects?.map((proj, i) => (
                                            <ItemCard key={i} index={i} onRemove={() => removeArrayItem('projects', i)}>
                                                <Input label="Project Name" value={proj.name || ''} onChange={(e) => updateArrayItem('projects', i, 'name', e.target.value)} placeholder="E-Commerce Platform" />

                                                <div className="grid grid-cols-2 gap-2">
                                                    <div>
                                                        <label className="text-xs text-gray-500 mb-1 block">Project Type</label>
                                                        <select value={proj.projectType || 'Personal'} onChange={(e) => updateArrayItem('projects', i, 'projectType', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none">
                                                            <option value="Personal">Personal</option>
                                                            <option value="Academic">Academic</option>
                                                            <option value="Professional">Professional</option>
                                                            <option value="Open Source">Open Source</option>
                                                            <option value="Freelance">Freelance</option>
                                                        </select>
                                                    </div>
                                                    <Input label="Your Role" value={proj.role || ''} onChange={(e) => updateArrayItem('projects', i, 'role', e.target.value)} placeholder="Full Stack Developer" />
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input label="Start Date" value={proj.startDate || ''} onChange={(e) => updateArrayItem('projects', i, 'startDate', e.target.value)} placeholder="Jan 2024" />
                                                    <Input label="End Date" value={proj.endDate || ''} onChange={(e) => updateArrayItem('projects', i, 'endDate', e.target.value)} placeholder="Mar 2024" />
                                                </div>

                                                <Input label="Team Size" value={proj.teamSize || ''} onChange={(e) => updateArrayItem('projects', i, 'teamSize', e.target.value)} placeholder="Solo / 3 developers" />

                                                <div className="space-y-2">
                                                    <label className="text-xs text-gray-500">Description</label>
                                                    <textarea
                                                        value={proj.description || ''}
                                                        onChange={(e) => updateArrayItem('projects', i, 'description', e.target.value)}
                                                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-sm text-white outline-none resize-none h-24"
                                                        placeholder="Brief description of what the project does and its purpose..."
                                                    />
                                                </div>

                                                <TagsInput
                                                    label="Technologies"
                                                    value={proj.technologies || []}
                                                    onChange={(tags) => updateArrayItem('projects', i, 'technologies', tags)}
                                                    placeholder="React, Node.js, MongoDB..."
                                                    tagColor="violet"
                                                />

                                                <div className="pt-2 border-t border-white/10 space-y-2">
                                                    <h5 className="text-xs text-gray-400 font-medium">🔗 Links</h5>
                                                    <Input label="Live Demo URL" value={proj.demoUrl || ''} onChange={(e) => updateArrayItem('projects', i, 'demoUrl', e.target.value)} placeholder="https://myproject.com" />
                                                    <Input label="GitHub/Repository" value={proj.repoUrl || ''} onChange={(e) => updateArrayItem('projects', i, 'repoUrl', e.target.value)} placeholder="https://github.com/user/project" />
                                                </div>

                                                <BulletList
                                                    items={proj.highlights || []}
                                                    onUpdate={(j, val) => updateBullet('projects', i, 'highlights', j, val)}
                                                    onAdd={() => addBullet('projects', i, 'highlights')}
                                                    onRemove={(j) => removeBullet('projects', i, 'highlights', j)}
                                                />
                                            </ItemCard>
                                        ))}
                                    </FormSection>
                                )}

                                {editingSection === 'certifications' && (
                                    <FormSection
                                        title="Certifications & Licenses"
                                        onAdd={() => addArrayItem('certifications', { name: '', issuer: '', date: '', expiryDate: '', credentialId: '', credentialUrl: '' })}
                                    >
                                        {resumeData?.certifications?.map((cert, i) => (
                                            <ItemCard key={i} index={i} onRemove={() => removeArrayItem('certifications', i)}>
                                                <Input label="Certification Name" value={cert.name || ''} onChange={(e) => updateArrayItem('certifications', i, 'name', e.target.value)} placeholder="AWS Solutions Architect" />
                                                <Input label="Issuing Organization" value={cert.issuer || ''} onChange={(e) => updateArrayItem('certifications', i, 'issuer', e.target.value)} placeholder="Amazon Web Services" />
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Input label="Issue Date" value={cert.date || ''} onChange={(e) => updateArrayItem('certifications', i, 'date', e.target.value)} placeholder="Jan 2024" />
                                                    <Input label="Expiry Date" value={cert.expiryDate || ''} onChange={(e) => updateArrayItem('certifications', i, 'expiryDate', e.target.value)} placeholder="Jan 2027 (or N/A)" />
                                                </div>
                                                <Input label="Credential ID" value={cert.credentialId || ''} onChange={(e) => updateArrayItem('certifications', i, 'credentialId', e.target.value)} placeholder="ABC123XYZ" />
                                                <Input label="Credential URL" value={cert.credentialUrl || ''} onChange={(e) => updateArrayItem('certifications', i, 'credentialUrl', e.target.value)} placeholder="https://www.credly.com/..." />
                                            </ItemCard>
                                        ))}
                                    </FormSection>
                                )}

                                {editingSection === 'languages' && (
                                    <FormSection
                                        title="Languages"
                                        onAdd={() => addArrayItem('spokenLanguages', { language: '', proficiency: 'Professional' })}
                                    >
                                        <p className="text-xs text-gray-500 mb-3">Add languages you speak and your proficiency level</p>
                                        {resumeData?.spokenLanguages?.map((lang, i) => (
                                            <ItemCard key={i} index={i} onRemove={() => removeArrayItem('spokenLanguages', i)}>
                                                <Input label="Language" value={lang.language || ''} onChange={(e) => updateArrayItem('spokenLanguages', i, 'language', e.target.value)} placeholder="English, Spanish, Mandarin..." />
                                                <div>
                                                    <label className="text-xs text-gray-500 mb-1 block">Proficiency Level</label>
                                                    <select value={lang.proficiency || 'Professional'} onChange={(e) => updateArrayItem('spokenLanguages', i, 'proficiency', e.target.value)} className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-2.5 text-sm text-white outline-none">
                                                        <option value="Native">Native / Bilingual</option>
                                                        <option value="Fluent">Fluent</option>
                                                        <option value="Professional">Professional Working</option>
                                                        <option value="Intermediate">Intermediate</option>
                                                        <option value="Basic">Basic / Elementary</option>
                                                    </select>
                                                </div>
                                            </ItemCard>
                                        ))}
                                    </FormSection>
                                )}

                                {editingSection === 'awards' && (
                                    <FormSection
                                        title="Awards & Achievements"
                                        onAdd={() => addArrayItem('awards', { title: '', issuer: '', date: '', description: '' })}
                                    >
                                        {resumeData?.awards?.map((award, i) => (
                                            <ItemCard key={i} index={i} onRemove={() => removeArrayItem('awards', i)}>
                                                <Input label="Award Title" value={award.title || ''} onChange={(e) => updateArrayItem('awards', i, 'title', e.target.value)} placeholder="Employee of the Year" />
                                                <Input label="Issuing Organization" value={award.issuer || ''} onChange={(e) => updateArrayItem('awards', i, 'issuer', e.target.value)} placeholder="Company Name / Organization" />
                                                <Input label="Date Received" value={award.date || ''} onChange={(e) => updateArrayItem('awards', i, 'date', e.target.value)} placeholder="Dec 2023" />
                                                <div className="space-y-1">
                                                    <label className="text-xs text-gray-500">Description (Optional)</label>
                                                    <textarea
                                                        value={award.description || ''}
                                                        onChange={(e) => updateArrayItem('awards', i, 'description', e.target.value)}
                                                        className="w-full bg-slate-800/50 border border-white/10 rounded-lg p-3 text-sm text-white outline-none resize-none h-20"
                                                        placeholder="Brief description of the achievement..."
                                                    />
                                                </div>
                                            </ItemCard>
                                        ))}
                                    </FormSection>
                                )}

                                {editingSection === 'settings' && (
                                    <div className="space-y-6">
                                        <h3 className="font-semibold text-white">Advanced Settings</h3>

                                        {/* Section Visibility */}
                                        <div className="space-y-3">
                                            <h4 className="text-sm text-gray-400 font-medium">Section Visibility</h4>
                                            <p className="text-xs text-gray-500">Toggle sections to show/hide them on your resume</p>
                                            {Object.keys(sectionVisibility).map(key => (
                                                <div key={key} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-white/5">
                                                    <span className="capitalize text-sm">{key}</span>
                                                    <button
                                                        onClick={() => setSectionVisibility(prev => ({ ...prev, [key]: !prev[key] }))}
                                                        className={`w-11 h-6 rounded-full transition-colors relative ${sectionVisibility[key] ? 'bg-violet-600' : 'bg-slate-700'}`}
                                                    >
                                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${sectionVisibility[key] ? 'translate-x-5' : ''}`} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Template Selection */}
                                        <div className="space-y-3">
                                            <h4 className="text-sm text-gray-400 font-medium">Template</h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                {TEMPLATES.map(t => (
                                                    <button
                                                        key={t.id}
                                                        onClick={() => setSelectedTemplate(t.id)}
                                                        className={`p-3 rounded-xl text-left text-sm transition-all ${selectedTemplate === t.id ? 'bg-violet-600 ring-2 ring-violet-400' : 'bg-slate-800/50 hover:bg-slate-700 border border-white/5'}`}
                                                    >
                                                        {t.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Font Selection */}
                                        <div className="space-y-3">
                                            <h4 className="text-sm text-gray-400 font-medium">Font Family</h4>
                                            <select
                                                value={selectedFont}
                                                onChange={(e) => setSelectedFont(e.target.value)}
                                                className="w-full bg-slate-800 border border-white/10 rounded-xl p-3 text-white outline-none"
                                            >
                                                {FONTS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                                            </select>
                                        </div>

                                        {/* Accent Color */}
                                        <div className="space-y-3">
                                            <h4 className="text-sm text-gray-400 font-medium">Accent Color</h4>
                                            <div className="flex gap-2 flex-wrap">
                                                {ACCENT_COLORS.map(c => (
                                                    <button
                                                        key={c.id}
                                                        onClick={() => setAccentColor(c.value)}
                                                        className={`w-9 h-9 rounded-full transition-transform hover:scale-110 ${accentColor === c.value ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''}`}
                                                        style={{ backgroundColor: c.value }}
                                                        title={c.name}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </aside>

                {/* Toggle Sidebar Button */}
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    className="hidden lg:flex items-center justify-center w-6 bg-slate-900 border-r border-white/5 hover:bg-slate-800 transition-colors"
                >
                    {showSidebar ? <ChevronLeft className="h-4 w-4 text-gray-500" /> : <ChevronRight className="h-4 w-4 text-gray-500" />}
                </button>

                {/* Preview Panel */}
                <div className="flex-1 bg-slate-950 overflow-auto p-4 sm:p-6 lg:p-10 flex items-start justify-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white text-slate-900 shadow-2xl shadow-black/50"
                        style={{
                            width: '210mm',
                            minHeight: '297mm',
                            maxWidth: '100%',
                            transformOrigin: 'top center'
                        }}
                    >
                        <div ref={previewRef}>
                            {renderTemplate()}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Mobile Panel */}
            <AnimatePresence>
                {showMobilePanel && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowMobilePanel(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25 }}
                            className="fixed inset-y-0 right-0 w-full max-w-sm bg-slate-900 z-50 lg:hidden flex flex-col"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/5">
                                <h2 className="font-semibold">Edit Resume</h2>
                                <button onClick={() => setShowMobilePanel(false)} className="p-2 rounded-lg hover:bg-white/5">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Section Tabs */}
                            <div className="flex items-center gap-2 p-3 overflow-x-auto no-scrollbar border-b border-white/5">
                                {sections.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => setEditingSection(s.id)}
                                        className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${editingSection === s.id
                                            ? 'bg-violet-600 text-white'
                                            : 'bg-slate-800 text-gray-400'
                                            }`}
                                    >
                                        {s.icon} {s.label}
                                    </button>
                                ))}
                            </div>

                            {/* Form */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {editingSection === 'personal' && (
                                    <>
                                        <Input label="Full Name" value={resumeData?.personalInfo?.fullName || ''} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} />
                                        <Input label="Email" value={resumeData?.personalInfo?.email || ''} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
                                        <Input label="Phone" value={resumeData?.personalInfo?.phone || ''} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
                                        <Input label="Location" value={resumeData?.personalInfo?.location || ''} onChange={(e) => updatePersonalInfo('location', e.target.value)} />
                                    </>
                                )}
                                {editingSection === 'summary' && (
                                    <textarea
                                        value={resumeData?.summary || ''}
                                        onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                                        className="w-full h-48 bg-slate-800/50 border border-white/10 rounded-xl p-4 text-sm text-white outline-none resize-none"
                                        placeholder="Professional summary..."
                                    />
                                )}
                                {editingSection === 'skills' && (
                                    <div className="space-y-4">
                                        <TagsInput
                                            label="Programming Languages"
                                            value={resumeData?.skills?.languages || []}
                                            onChange={(tags) => setResumeData(prev => ({
                                                ...prev, skills: { ...prev?.skills, languages: tags }
                                            }))}
                                            placeholder="JavaScript, Python..."
                                            tagColor="violet"
                                        />
                                        <TagsInput
                                            label="Frameworks"
                                            value={resumeData?.skills?.frameworks || []}
                                            onChange={(tags) => setResumeData(prev => ({
                                                ...prev, skills: { ...prev?.skills, frameworks: tags }
                                            }))}
                                            placeholder="React, Node.js..."
                                            tagColor="cyan"
                                        />
                                        <TagsInput
                                            label="Tools"
                                            value={resumeData?.skills?.tools || []}
                                            onChange={(tags) => setResumeData(prev => ({
                                                ...prev, skills: { ...prev?.skills, tools: tags }
                                            }))}
                                            placeholder="Git, VS Code..."
                                            tagColor="pink"
                                        />
                                        <TagsInput
                                            label="Soft Skills"
                                            value={resumeData?.skills?.soft || []}
                                            onChange={(tags) => setResumeData(prev => ({
                                                ...prev, skills: { ...prev?.skills, soft: tags }
                                            }))}
                                            placeholder="Leadership, Communication..."
                                            tagColor="blue"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="p-4 border-t border-white/5">
                                <Button onClick={handleSave} isLoading={isSaving} variant="gradient" className="w-full">
                                    <Save className="h-4 w-4 mr-2" /> Save Changes
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

// Component: Dropdown Button
const DropdownButton = ({ icon: Icon, label, isOpen, onClick, children }) => (
    <div className="relative">
        <button
            onClick={onClick}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-sm transition-colors"
        >
            {typeof Icon === 'function' ? <Icon /> : <Icon className="h-4 w-4 text-violet-400" />}
            {label && <span className="hidden xl:inline text-gray-300">{label}</span>}
            <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 min-w-[180px] bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50"
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

// Component: Form Section
const FormSection = ({ title, onAdd, children }) => (
    <div className="space-y-4">
        <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">{title}</h3>
            {onAdd && (
                <Button size="sm" variant="secondary" onClick={onAdd}>
                    <Plus className="h-4 w-4 mr-1" /> Add
                </Button>
            )}
        </div>
        <div className="space-y-3">{children}</div>
    </div>
);

// Component: Item Card 
const ItemCard = ({ index, onRemove, children }) => (
    <div className="bg-slate-800/30 border border-white/5 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between mb-2">
            <span className="w-6 h-6 rounded-full bg-violet-500/20 text-violet-400 flex items-center justify-center text-xs font-bold">
                {index + 1}
            </span>
            <button onClick={onRemove} className="text-gray-600 hover:text-red-400 transition-colors">
                <Trash2 className="h-4 w-4" />
            </button>
        </div>
        {children}
    </div>
);

// Component: Bullet List
const BulletList = ({ items, onUpdate, onAdd, onRemove }) => (
    <div className="space-y-2">
        <label className="text-xs text-gray-500">Achievements</label>
        {items?.map((item, i) => (
            <div key={i} className="flex gap-2 items-start">
                <span className="text-gray-600 mt-2">•</span>
                <textarea
                    rows={2}
                    value={item}
                    onChange={(e) => onUpdate(i, e.target.value)}
                    className="flex-1 bg-transparent border-b border-white/10 text-sm text-gray-300 focus:text-white focus:border-violet-500 outline-none resize-none py-1"
                />
                <button onClick={() => onRemove(i)} className="text-gray-600 hover:text-red-400 mt-1">
                    <X className="h-3 w-3" />
                </button>
            </div>
        ))}
        <button onClick={onAdd} className="text-xs text-violet-400 hover:text-violet-300 font-medium">
            + Add Achievement
        </button>
    </div>
);

export default Editor;
