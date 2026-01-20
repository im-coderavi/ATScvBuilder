import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, Loader, Sparkles, AlertCircle } from 'lucide-react';
import api from '../../Services/api';
import toast from 'react-hot-toast';
import Button from '../UI/Button';

const FileUpload = ({ onUploadSuccess }) => {
    // Mode state: 'selection' (default), 'upload', 'create'
    const [mode, setMode] = useState('selection');
    const [isCreating, setIsCreating] = useState(false);

    // Upload state
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleCreateFromScratch = async () => {
        setIsCreating(true);
        try {
            const response = await api.post('/resumes/create', {}, { baseURL: 'http://localhost:5000/api' });
            toast.success('New resume created!');
            if (onUploadSuccess) onUploadSuccess(response.data.resumeId);
        } catch (error) {
            toast.error('Failed to create resume');
        } finally {
            setIsCreating(false);
        }
    };

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) validateAndSetFile(droppedFile);
    }, []);

    const validateAndSetFile = (selectedFile) => {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'
        ];
        if (!allowedTypes.includes(selectedFile.type)) {
            toast.error('Invalid file type. Please upload PDF, DOCX, or TXT.');
            return;
        }
        if (selectedFile.size > 5 * 1024 * 1024) {
            toast.error('File size exceeds 5MB limit.');
            return;
        }
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('resume', file);

        try {
            const response = await api.post('/resumes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                baseURL: 'http://localhost:5000/api'
            });
            toast.success('Resume uploaded! Optimizing...');
            setFile(null);
            if (onUploadSuccess) onUploadSuccess(response.data.resumeId);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    // Render Selection Mode
    if (mode === 'selection') {
        return (
            <div className="w-full max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Option 1: Create from Scratch */}
                    <motion.button
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={handleCreateFromScratch}
                        disabled={isCreating}
                        className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-800/50 border border-white/10 hover:bg-slate-800 hover:border-violet-500/50 transition-all duration-300 min-h-[300px]"
                    >
                        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 group-hover:scale-110 transition-transform duration-300">
                            {isCreating ? <Loader className="h-10 w-10 text-violet-400 animate-spin" /> : <FileText className="h-10 w-10 text-violet-400" />}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Create from Scratch</h3>
                        <p className="text-sm text-gray-400 text-center max-w-[200px]">
                            Start with a clean slate and build your resume manually using our editor.
                        </p>
                    </motion.button>

                    {/* Option 2: Upload & AI Analyze */}
                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onClick={() => setMode('upload')}
                        className="group relative flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-800/50 border border-white/10 hover:bg-slate-800 hover:border-cyan-500/50 transition-all duration-300 min-h-[300px]"
                    >
                        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Upload className="h-10 w-10 text-cyan-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Upload Resume</h3>
                        <p className="text-sm text-gray-400 text-center max-w-[200px]">
                            Upload your existing CV. Our AI will analyze it and create a new version for you.
                        </p>
                    </motion.button>
                </div>
            </div>
        );
    }

    // Render Upload Mode
    return (
        <div className="w-full max-w-2xl mx-auto">
            <button
                onClick={() => setMode('selection')}
                className="mb-4 text-sm text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
            >
                ← Back to options
            </button>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${isDragging
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-white/10 bg-slate-800/30 hover:border-violet-500/30 hover:bg-slate-800/50'
                    }`}
            >
                <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => e.target.files[0] && validateAndSetFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                <div className="flex flex-col items-center gap-4 pointer-events-none">
                    <div className={`p-4 rounded-2xl transition-colors ${isDragging ? 'bg-violet-500/20 text-violet-300' : 'bg-white/5 text-gray-400'}`}>
                        <Upload className="h-8 w-8" />
                    </div>
                    <div>
                        <p className="text-lg font-medium text-white">
                            Drag & drop your resume here
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                            or click to browse • PDF, DOCX, TXT (max 5MB)
                        </p>
                    </div>
                </div>
            </motion.div>

            <AnimatePresence>
                {file && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="bg-slate-800 border border-white/10 rounded-xl p-4 flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-violet-500/20 rounded-lg text-violet-400">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-white">{file.name}</p>
                                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setFile(null)}
                                className="p-1 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                            <Button
                                size="sm"
                                variant="gradient"
                                onClick={handleUpload}
                                isLoading={isUploading}
                                className="shadow-lg shadow-violet-500/25"
                            >
                                {isUploading ? 'Processing...' : (
                                    <>
                                        Generate <Sparkles className="h-3 w-3 ml-2" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FileUpload;
