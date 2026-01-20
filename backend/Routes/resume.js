const express = require('express');
const router = express.Router();
const {
    uploadResume,
    getResumes,
    getResume,
    updateResume,
    regenerateResume,
    generateAIResume,
    deleteResume,
    createResume,
    renameResume,
    analyzeATS
} = require('../Controllers/resumeController');
const { protect } = require('../Middleware/auth');
const upload = require('../Middleware/upload');

// Upload and analyze original resume (Phase 1)
router.post('/upload', protect, upload.single('resume'), uploadResume);

// Create new resume from scratch
router.post('/create', protect, createResume);

// Generate AI-optimized resume (Phase 2 - Optional)
router.post('/:id/generate', protect, generateAIResume);

// Analyze ATS score for a resume
router.post('/:id/analyze', protect, analyzeATS);

// Analyze uploaded file for ATS score (new file comparison)
router.post('/analyze-file', protect, upload.single('resume'), analyzeATS);

// Get all resumes for user
router.get('/', protect, getResumes);

// Get single resume
router.get('/:id', protect, getResume);

// Update resume data (for editing)
router.put('/:id', protect, updateResume);

// Regenerate resume with AI
router.post('/:id/regenerate', protect, regenerateResume);

// Delete resume
router.delete('/:id', protect, deleteResume);
router.patch('/:id/title', protect, renameResume);

module.exports = router;

