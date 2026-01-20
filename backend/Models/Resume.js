const mongoose = require('mongoose');

const resumeSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalFile: {
        url: { type: String },
        filename: { type: String },
        publicId: { type: String }
    },
    title: { type: String, default: '' },
    extractedText: { type: String },

    // New JSON-based resume data structure (replacing latexCode)
    resumeData: {
        personalInfo: {
            fullName: { type: String, default: '' },
            email: { type: String, default: '' },
            phone: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            location: { type: String, default: '' },
            portfolio: { type: String, default: '' }
        },
        summary: { type: String, default: '' },
        experience: [{
            company: { type: String },
            title: { type: String },
            location: { type: String },
            startDate: { type: String },
            endDate: { type: String },
            achievements: [{ type: String }]
        }],
        education: [{
            institution: { type: String },
            degree: { type: String },
            field: { type: String },
            graduationDate: { type: String },
            gpa: { type: String },
            achievements: [{ type: String }]
        }],
        skills: {
            technical: [{ type: String }],
            tools: [{ type: String }],
            soft: [{ type: String }],
            languages: [{ type: String }]
        },
        projects: [{
            name: { type: String },
            description: { type: String },
            technologies: [{ type: String }],
            link: { type: String },
            impact: { type: String }
        }],
        certifications: [{
            name: { type: String },
            issuer: { type: String },
            date: { type: String },
            credentialId: { type: String }
        }]
    },

    // Original CV ATS Score (before AI optimization)
    originalAtsScore: {
        overall: { type: Number, default: 0 },
        keywordOptimization: { type: Number, default: 0 },
        formatting: { type: Number, default: 0 },
        structure: { type: Number, default: 0 },
        issues: [{ type: String }]
    },

    // Optimized ATS Score (after AI generation)
    atsScore: {
        overall: { type: Number, default: 0 },
        keywordOptimization: { type: Number, default: 0 },
        formatting: { type: Number, default: 0 },
        structure: { type: Number, default: 0 },
        improvements: [{ type: String }]
    },

    aiGenerated: { type: Boolean, default: false },

    status: {
        type: String,
        enum: ['uploading', 'processing', 'analyzing', 'analyzed', 'generating', 'completed', 'failed'],
        default: 'uploading'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Resume', resumeSchema);
