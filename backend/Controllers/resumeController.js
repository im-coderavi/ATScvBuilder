const Resume = require('../Models/Resume');
const User = require('../Models/User');
const cloudinary = require('../Config/cloudinary');
const { parsePdf } = require('../Services/pdfParser');
const { parseDocx } = require('../Services/docxParser');
const fs = require('fs');
const path = require('path');

// DEBUG LOGGING SETUP
const LOG_FILE = path.join(__dirname, '../upload-debug.log');
const logDebug = (msg, error = null) => {
    const timestamp = new Date().toISOString();
    let logLine = `[${timestamp}] ${msg}\n`;
    if (error) {
        logLine += `ERROR DETAILS: ${error.message}\nSTACK: ${error.stack}\n`;
    }
    console.log(msg); // Keep console output
    if (error) console.error(error);
    try {
        fs.appendFileSync(LOG_FILE, logLine);
    } catch (e) { console.error('Failed to write to log file', e); }
};
// Import Gemini service and verify imports
const GeminiService = require('../Services/geminiService');

// Destructure mostly for cleaner code usage below, but fallback to service object
const { generateATSResume, calculateATSScore, analyzeOriginalResume } = GeminiService;

// Debug log for imports
console.log('ResumeController loaded. GeminiService exports:', Object.keys(GeminiService));

// Background processing function for AI generation
// Defined here to be available for both uploadResume and generateAIResume
const processResumeWithAI = async (resumeId, extractedText, user) => {
    try {
        console.log('==================== PROCESS RESUME WITH AI START ====================');
        console.log(`Resume ID: ${resumeId}`);
        console.log(`User: ${user?.email || 'unknown'}`);
        console.log(`Text length being sent to AI: ${extractedText.length} characters`);

        // Validate inputs
        if (!resumeId || !extractedText) {
            console.error('❌ Invalid inputs for processResumeWithAI');
            return;
        }

        // Call Gemini service
        // Ensure we pass arguments that match what generateATSResume expects
        // But also check if it exists first
        if (typeof generateATSResume !== 'function') {
            throw new Error('generateATSResume is not a function');
        }

        const generationResult = await generateATSResume(
            extractedText,
            user?.email || '',
            user?.name || ''
        );

        if (!generationResult.success) {
            console.error('❌ Resume generation failed:', generationResult.error);
            // Set status to 'analyzed' instead of 'failed' so user can still edit
            // Provide default resumeData structure for editing
            await Resume.findByIdAndUpdate(resumeId, {
                status: 'analyzed',
                resumeData: {
                    personalInfo: {
                        fullName: user?.name || 'Your Name',
                        email: user?.email || '',
                        phone: '',
                        linkedin: '',
                        location: '',
                        portfolio: ''
                    },
                    summary: 'Your professional summary...',
                    experience: [],
                    education: [],
                    skills: { technical: [], tools: [], soft: [], languages: [] },
                    projects: [],
                    certifications: []
                },
                atsScore: {
                    overall: 50,
                    improvements: ['AI generation encountered an issue. You can manually edit your resume.']
                }
            });
            console.log('==================== PROCESS RESUME WITH AI END (FAILED) ====================\n');
            return;
        }

        const { resumeData, atsScore } = generationResult;

        // Log what was successfully extracted
        console.log('==================== EXTRACTION SUMMARY ====================');
        console.log(`✅ Resume data received from AI`);
        console.log(`   Name: ${resumeData.personalInfo?.fullName || 'N/A'}`);
        console.log(`   Email: ${resumeData.personalInfo?.email || 'N/A'}`);
        console.log(`   Experience entries: ${resumeData.experience?.length || 0}`);
        console.log(`   Education entries: ${resumeData.education?.length || 0}`);
        console.log(`   Projects: ${resumeData.projects?.length || 0}`);
        console.log(`   Certifications: ${resumeData.certifications?.length || 0}`);
        console.log(`   ATS Score: ${atsScore.overall || 'N/A'}`);
        console.log('============================================================');

        await Resume.findByIdAndUpdate(resumeId, {
            resumeData: resumeData,
            atsScore: atsScore,
            aiGenerated: true,
            status: 'completed'
        });

        console.log(`✅ Resume ${resumeId} processed and saved to DB successfully`);
        console.log('==================== PROCESS RESUME WITH AI END (SUCCESS) ====================\n');
    } catch (error) {
        console.error(`❌ Error processing resume ${resumeId}:`, error);
        // Even on error, set to 'analyzed' with default data so user can edit
        await Resume.findByIdAndUpdate(resumeId, {
            status: 'analyzed',
            resumeData: {
                personalInfo: {
                    fullName: user?.name || 'Your Name',
                    email: user?.email || '',
                    phone: '',
                    linkedin: '',
                    location: '',
                    portfolio: ''
                },
                summary: 'Your professional summary...',
                experience: [],
                education: [],
                skills: { technical: [], tools: [], soft: [], languages: [] },
                projects: [],
                certifications: []
            },
            atsScore: {
                overall: 50,
                improvements: ['Processing error: ' + error.message + '. You can manually edit your resume.']
            }
        });
        console.log('==================== PROCESS RESUME WITH AI END (ERROR) ====================\n');
    }
};

// Background: Analyze original resume (no AI optimization yet)
const analyzeOriginalResumeBackground = async (resumeId, extractedText) => {
    try {
        console.log(`Analyzing original resume ${resumeId}...`);

        if (typeof analyzeOriginalResume !== 'function') {
            throw new Error('analyzeOriginalResume is not a function');
        }

        const analysisResult = await analyzeOriginalResume(extractedText);

        // Only update the originalAtsScore - DO NOT change status
        // Status is controlled by processResumeWithAI to avoid race conditions
        await Resume.findByIdAndUpdate(resumeId, {
            originalAtsScore: analysisResult.originalScore
            // status: NOT CHANGED HERE - let processResumeWithAI handle it
        });

        console.log(`Original resume ${resumeId} analyzed. Score: ${analysisResult.originalScore.overall}`);
    } catch (error) {
        console.error(`Error analyzing resume ${resumeId}:`, error);
        // Only update the score on error, not the status
        await Resume.findByIdAndUpdate(resumeId, {
            originalAtsScore: {
                overall: 50,
                issues: ['Analysis failed: ' + error.message]
            }
            // status: NOT CHANGED HERE
        });
    }
};

// @desc    Upload resume and analyze ORIGINAL (Phase 1)
// @route   POST /api/resumes/upload
// @access  Private
const uploadResume = async (req, res) => {
    try {
        logDebug('Upload request received');

        // Log request headers and body keys for context
        logDebug(`Headers: ${JSON.stringify(req.headers['content-type'])}`);

        // Robust user check
        if (!req.user || !req.user._id) {
            logDebug('User not attached to request - Auth Failure');
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Check Cloudinary Config
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            logDebug('Cloudinary config missing in .env');
            return res.status(500).json({
                message: 'Server Configuration Error',
                details: 'Cloudinary credentials missing in .env file'
            });
        }

        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const file = req.file;
        logDebug(`File received: ${file.originalname} (${file.mimetype}), Size: ${file.size} bytes`);

        let extractedText = '';

        // Extract text based on file type
        try {
            if (file.mimetype === 'application/pdf') {
                logDebug('Parsing PDF...');
                extractedText = await parsePdf(file.buffer);
            } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                logDebug('Parsing DOCX...');
                extractedText = await parseDocx(file.buffer);
            } else if (file.mimetype === 'text/plain') {
                logDebug('Reading TXT...');
                extractedText = file.buffer.toString('utf8');
            }
        } catch (parseError) {
            logDebug('Parse error', parseError);
            return res.status(400).json({ message: 'Failed to parse file: ' + parseError.message });
        }

        logDebug(`Extracted text length: ${extractedText?.length || 0}`);

        if (!extractedText || extractedText.trim().length < 10) {
            if (file.mimetype === 'application/pdf') {
                extractedText = `Resume from file: ${file.originalname}. Please note this PDF may contain text as images which cannot be extracted.`;
                console.log('Using placeholder text for non-extractable PDF');
            } else {
                return res.status(400).json({
                    message: 'Could not extract text from the file.',
                    hint: 'Try uploading a .docx or .txt file instead'
                });
            }
        }

        // Upload to Cloudinary
        logDebug('STEP 2: Starting Cloudinary upload...');
        let uploadResult;
        try {
            uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { resource_type: 'raw', folder: 'resumes' },
                    (error, result) => {
                        if (error) {
                            logDebug('Cloudinary callback error', error);
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );
                uploadStream.end(file.buffer);
            });
        } catch (cloudError) {
            logDebug('Cloudinary upload failed catch block', cloudError);
            return res.status(500).json({ message: 'Failed to upload file to storage', error: cloudError.message });
        }

        logDebug(`Cloudinary upload success: ${uploadResult.public_id}`);
        logDebug('STEP 3: Cloudinary Success. Creating DB entry...');

        // Create resume entry with 'processing' status
        const resume = await Resume.create({
            userId: req.user._id,
            originalFile: {
                url: uploadResult.secure_url,
                filename: file.originalname,
                publicId: uploadResult.public_id
            },
            title: file.originalname.replace(/\.[^/.]+$/, ""), // Default title is filename without extension
            extractedText: extractedText,
            status: 'processing',
            aiGenerated: false
        });



        logDebug(`Resume created in DB: ${resume._id}`);
        logDebug('STEP 4: DB Entry Created. Updating User...');

        // Add resume to user's list
        await User.findByIdAndUpdate(req.user._id, { $push: { resumes: resume._id } });

        // Process with AI in background (generates new optimized resume automatically)
        processResumeWithAI(resume._id, extractedText, req.user)
            .catch(err => logDebug('Background AI processing initiation failed', err));

        // Use Phase 1: Analyze Original Resume
        console.log('STEP 5: Starting Background Analysis...');
        analyzeOriginalResumeBackground(resume._id, extractedText)
            .catch(err => console.error('Background analysis failed:', err));

        console.log('STEP 6: Sending Response');
        res.status(201).json({
            message: 'Resume uploaded! Analyzing contents...',
            resumeId: resume._id,
            status: 'analyzing'
        });

    } catch (error) {
        logDebug('CRITICAL UPLOAD ERROR', error);
        res.status(500).json({
            message: 'Server error during upload',
            error: error.message,
            details: 'Check server logs for CRITICAL UPLOAD ERROR'
        });
    }
};

// @desc    Create a new resume from scratch
// @route   POST /api/resumes/create
// @access  Private
const createResume = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        // Create blank resume with empty structure (no placeholder data)
        // This ensures the editor shows only labels without pre-filled content
        const blankResumeData = {
            personalInfo: {
                fullName: '',
                title: '',
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                portfolio: '',
                nationality: '',
                dateOfBirth: ''
            },
            summary: '',
            experience: [],
            education: [],
            skills: {
                languages: [],
                frameworks: [],
                databases: [],
                cloud: [],
                tools: [],
                methodologies: [],
                coreCS: [],
                soft: []
            },
            projects: [],
            certifications: [],
            spokenLanguages: [],
            awards: []
        };

        const resume = await Resume.create({
            userId: req.user._id,
            title: 'Untitled Resume',
            resumeData: blankResumeData,
            atsScore: {
                overall: 0,
                keywordOptimization: 0,
                formatting: 0,
                structure: 0,
                improvements: ['Start adding your details to build your resume']
            },
            status: 'completed', // Ready to edit immediately
            aiGenerated: false
        });

        // Add to user's list
        await User.findByIdAndUpdate(req.user._id, { $push: { resumes: resume._id } });

        res.status(201).json({
            message: 'Blank resume created - start filling in your details!',
            resumeId: resume._id,
            resume
        });

    } catch (error) {
        console.error('Create resume error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Generate AI-optimized resume (Phase 2 - Optional)
// @route   POST /api/resumes/:id/generate
// @access  Private
const generateAIResume = async (req, res) => {
    try {
        // Validation check for user
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        if (!resume.extractedText || resume.extractedText.length < 10) {
            return res.status(400).json({ message: 'No resume text to optimize' });
        }

        // Update status to generating
        await Resume.findByIdAndUpdate(resume._id, { status: 'generating' });

        res.json({
            message: 'AI optimization started...',
            status: 'generating'
        });

        // Process in background
        processResumeWithAI(resume._id, resume.extractedText, req.user);

    } catch (error) {
        console.error('Generate error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get all resumes for a user
// @route   GET /api/resumes
// @access  Private
const getResumes = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const resumes = await Resume.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Get a single resume
// @route   GET /api/resumes/:id
// @access  Private
const getResume = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }
        res.json(resume);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Update resume data (for editing)
// @route   PUT /api/resumes/:id
// @access  Private
const updateResume = async (req, res) => {
    try {
        const { resumeData } = req.body;

        if (!resumeData) {
            return res.status(400).json({ message: 'Resume data is required' });
        }

        const resume = await Resume.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { resumeData: resumeData },
            { new: true }
        );

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Recalculate ATS score
        const newScore = await calculateATSScore(resumeData);
        await Resume.findByIdAndUpdate(resume._id, { atsScore: newScore });

        res.json({
            message: 'Resume updated successfully',
            resume: resume,
            atsScore: newScore
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Regenerate resume with AI
// @route   POST /api/resumes/:id/regenerate
// @access  Private
const regenerateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        if (!resume.extractedText) {
            return res.status(400).json({ message: 'No original text to regenerate from' });
        }

        // Update status
        await Resume.findByIdAndUpdate(resume._id, { status: 'generating' });

        // Process in background
        processResumeWithAI(resume._id, resume.extractedText, req.user);

        res.json({
            message: 'Regenerating resume with AI...',
            status: 'generating'
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Delete a resume
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Delete from Cloudinary if exists
        if (resume.originalFile?.publicId) {
            try {
                await cloudinary.uploader.destroy(resume.originalFile.publicId, { resource_type: 'raw' });
            } catch (err) {
                console.error('Cloudinary delete error:', err);
            }
        }

        // Remove from user's list
        await User.findByIdAndUpdate(req.user._id, { $pull: { resumes: resume._id } });

        // Delete resume
        await Resume.findByIdAndDelete(resume._id);

        res.json({ message: 'Resume deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const renameResume = async (req, res) => {
    try {
        const { title } = req.body;

        if (!title || typeof title !== 'string' || !title.trim()) {
            return res.status(400).json({ message: 'Valid title is required' });
        }

        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        resume.title = title.trim();
        await resume.save();

        res.json({ message: 'Resume renamed successfully', resume });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const analyzeATS = async (req, res) => {
    try {
        let extractedText = '';
        let originalFilename = '';
        let resumeTitle = '';
        let resumeId = null;

        // Case 1: Analyzing uploaded file
        if (req.file) {
            logDebug('ATS Analysis: File upload received');
            const file = req.file;
            originalFilename = file.originalname;
            resumeTitle = file.originalname.replace(/\.[^/.]+$/, ""); // Remove extension

            try {
                if (file.mimetype === 'application/pdf') {
                    extractedText = await parsePdf(file.buffer);
                } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                    extractedText = await parseDocx(file.buffer);
                } else if (file.mimetype === 'text/plain') {
                    extractedText = file.buffer.toString('utf8');
                }
            } catch (parseError) {
                return res.status(400).json({ message: 'Failed to parse file: ' + parseError.message });
            }
        }
        // Case 2: Analyzing existing resume from DB
        else if (req.params.id) {
            logDebug(`ATS Analysis: Analyzing existing resume ${req.params.id}`);
            const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

            if (!resume) {
                return res.status(404).json({ message: 'Resume not found' });
            }

            extractedText = resume.extractedText || '';
            originalFilename = resume.originalFile?.filename || 'Existing Resume';
            resumeTitle = resume.title || originalFilename;
            resumeId = resume._id;
        } else {
            return res.status(400).json({ message: 'No file or resume ID provided' });
        }

        if (!extractedText || extractedText.length < 10) {
            return res.status(400).json({ message: 'Could not extract sufficient text for analysis' });
        }

        // Analyze logic
        logDebug('ATS Analysis: Calling Gemini...');
        const analysisResult = await analyzeOriginalResume(extractedText);

        // Save the score to DB for existing resumes so dashboard reflects the updated score
        if (resumeId) {
            await Resume.findByIdAndUpdate(resumeId, {
                originalAtsScore: analysisResult.originalScore
            });
            logDebug(`ATS score saved to DB for resume ${resumeId}: ${analysisResult.originalScore.overall}`);
        }

        res.json({
            message: 'Analysis complete',
            filename: originalFilename,
            title: resumeTitle,
            atsScore: analysisResult.originalScore
        });

    } catch (error) {
        console.error('ATS Analysis Error:', error);
        res.status(500).json({ message: 'Server error during analysis', error: error.message });
    }
};

// @desc    Generate AI Professional Summary
// @route   POST /api/resumes/:id/generate-summary
// @access  Private
const generateAISummary = async (req, res) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });

        if (!resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        const resumeData = resume.resumeData || {};
        const { jobTitle, tone } = req.body; // Optional parameters

        // Build context from resume data
        const context = {
            name: resumeData.personalInfo?.fullName || '',
            title: resumeData.personalInfo?.title || jobTitle || '',
            experience: resumeData.experience || [],
            skills: resumeData.skills || {},
            education: resumeData.education || []
        };

        // Calculate years of experience
        let totalYears = 0;
        if (context.experience.length > 0) {
            context.experience.forEach(exp => {
                if (exp.startDate) {
                    const start = new Date(exp.startDate);
                    const end = exp.current ? new Date() : (exp.endDate ? new Date(exp.endDate) : new Date());
                    totalYears += (end - start) / (1000 * 60 * 60 * 24 * 365);
                }
            });
        }
        const yearsExp = Math.round(totalYears);

        // Get top skills
        const allSkills = [
            ...(context.skills.technical || []),
            ...(context.skills.languages || []),
            ...(context.skills.frameworks || []),
            ...(context.skills.tools || [])
        ].slice(0, 8);

        // Get recent job titles
        const recentTitles = context.experience.slice(0, 3).map(e => e.title).filter(Boolean);

        // Build the prompt
        const prompt = `Generate a professional resume summary (3-4 sentences, 50-80 words) for:

Role: ${context.title || recentTitles[0] || 'Professional'}
Years of Experience: ${yearsExp > 0 ? yearsExp + '+ years' : 'Entry-level'}
Key Skills: ${allSkills.join(', ') || 'Various technical skills'}
Recent Positions: ${recentTitles.join(', ') || 'N/A'}
${tone ? `Tone: ${tone}` : 'Tone: Professional and confident'}

Requirements:
- Start with a strong opening (e.g., "Results-driven...", "Experienced...", "Dynamic...")
- Highlight key achievements and expertise areas
- Include specific technical skills relevant to the role
- End with value proposition or career goal
- Make it ATS-friendly with relevant keywords
- Do NOT use placeholder text or brackets
- Write in third person

Return ONLY the summary text, no quotes or extra formatting.`;

        // Call Gemini API
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent(prompt);
        const summary = result.response.text().trim();

        // Clean up the summary
        let cleanSummary = summary
            .replace(/^["']|["']$/g, '') // Remove quotes
            .replace(/\n+/g, ' ') // Remove newlines
            .trim();

        res.json({
            success: true,
            summary: cleanSummary
        });

    } catch (error) {
        console.error('AI Summary Generation Error:', error);
        res.status(500).json({
            message: 'Failed to generate summary',
            error: error.message
        });
    }
};

module.exports = {
    uploadResume,
    getResumes,
    getResume,
    updateResume,
    regenerateResume,
    generateAIResume,
    deleteResume,
    createResume,
    renameResume,
    analyzeATS,
    generateAISummary
};

