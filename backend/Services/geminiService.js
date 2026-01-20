const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Master ATS Resume Optimization Prompt
const ATS_RESUME_MASTER_PROMPT = (resumeContent) => `
You are an expert resume parser. Your ONLY job is to EXTRACT real information from the resume text below.

## CRITICAL: YOUR ONE AND ONLY TASK
Parse the resume text and extract REAL DATA into the JSON format specified.

## ABSOLUTE RULES - VIOLATING ANY RULE IS A FAILURE

### RULE 1: NEVER USE PLACEHOLDERS
❌ NEVER output things like:
- "[ADD: description]"  
- "EXACT Full Name"
- "Your Name Here"
- "email@example.com"
- Any placeholder text

✅ ONLY output REAL data found in the resume text, for example:
- "John Doe" (actual name from resume)
- "johndoe@gmail.com" (actual email from resume)
- "Software Engineer at Google" (actual job from resume)

### RULE 2: IF DATA IS NOT IN THE RESUME, USE NULL OR EMPTY
- If no phone number found → use null, NOT a placeholder
- If no LinkedIn found → use null, NOT a fake URL
- If no projects section → use empty array [], NOT placeholder projects

### RULE 3: EXTRACT EVERYTHING YOU CAN FIND
Look carefully in the resume text for:
- NAME: Usually at the top
- EMAIL: Look for text with @ symbol
- PHONE: Look for digits formatted as phone number
- LINKEDIN: Look for linkedin.com URLs
- LOCATION/ADDRESS: City, state, country mentions
- JOB TITLES & COMPANIES: Under Experience, Work History, Employment
- EDUCATION: Degree, University/College names, graduation dates
- SKILLS: Technical skills, tools, languages, frameworks
- PROJECTS: Project names and descriptions

## JSON OUTPUT FORMAT (fill with REAL extracted data only)

{
  "personalInfo": {
    "fullName": "REAL NAME extracted from resume",
    "email": "real@email.com or null",
    "phone": "real phone or null",
    "linkedin": "real linkedin URL or null",
    "location": "real location or null",
    "portfolio": "real URL or null"
  },
  "summary": "Write a 2-3 sentence summary based on the person's ACTUAL experience and skills from the resume.",
  "experience": [
    {
      "company": "Real company name",
      "title": "Real job title", 
      "location": "Real location or null",
      "startDate": "Real date",
      "endDate": "Real date or Present",
      "achievements": ["Real achievement 1", "Real achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "Real university/college name",
      "degree": "Real degree (B.Tech, BSc, MBA, etc)",
      "field": "Real field of study",
      "graduationDate": "Real date",
      "gpa": "Real GPA or null",
      "achievements": []
    }
  ],
  "skills": {
    "technical": ["Real skill 1", "Real skill 2"],
    "tools": ["Real tool 1", "Real tool 2"],
    "soft": ["real soft skill"],
    "languages": ["English", "Hindi", etc]
  },
  "projects": [
    {
      "name": "Real project name",
      "description": "Real description",
      "technologies": ["real tech"],
      "link": "real URL or null",
      "impact": "real impact or null"
    }
  ],
  "certifications": [
    {
      "name": "Real certification name",
      "issuer": "Real issuer",
      "date": "Real date",
      "credentialId": "real ID or null"
    }
  ],
  "atsScore": {
    "overall": 85,
    "keywordOptimization": 85,
    "formatting": 90,
    "structure": 85,
    "improvements": ["improvement 1", "improvement 2"]
  }
}

## BEFORE YOU RESPOND, ASK YOURSELF:
1. Did I use ANY placeholder text? If yes, REDO.
2. Is every piece of data from the ACTUAL resume? If no, REDO.
3. Did I extract the real person's name, not "EXACT Full Name"? 
4. Did I find the real email, not "exact@email.com"?
5. Are the experience entries REAL jobs from this resume?

## RETURN ONLY JSON, NO EXPLANATION

---
RESUME TEXT TO PARSE (extract REAL information from this):

${resumeContent}

---
RETURN ONLY VALID JSON WITH REAL DATA EXTRACTED FROM THE ABOVE TEXT.
`;

/**
 * Generate ATS-optimized resume from extracted text
 * @param {string} extractedText - Text extracted from uploaded resume
 * @param {string} userEmail - User's email for personalization
 * @param {string} userName - User's name for personalization
 * @returns {Object} - { success, resumeData, atsScore, error }
 */
const generateATSResume = async (extractedText, userEmail = '', userName = '') => {
  try {
    // Safety settings to prevent blocking legitimate resume content
    const safetySettings = [
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
    ];

    // Use gemini-2.0-flash (best paid version) as primary model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      safetySettings,
      generationConfig: {
        temperature: 0.2, // Lowered from 0.4 for more faithful extraction
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    const prompt = ATS_RESUME_MASTER_PROMPT(extractedText);

    // Log extraction details
    console.log('==================== AI RESUME EXTRACTION START ====================');
    console.log(`Extracted text length: ${extractedText.length} characters`);
    console.log(`Text preview (first 300 chars): ${extractedText.substring(0, 300)}...`);
    console.log('Calling Gemini API (gemini-2.0-flash) for ATS Resume generation...');

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();

    // Clean the response - remove any markdown formatting
    responseText = responseText
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();

    // Log raw AI response for debugging
    console.log(`AI Response length: ${responseText.length} characters`);
    console.log(`AI Response preview: ${responseText.substring(0, 400)}...`);

    // Parse the JSON response
    let resumeData;
    try {
      resumeData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response as JSON:', parseError);
      console.log('Raw response:', responseText.substring(0, 500));

      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        resumeData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response as JSON');
      }
    }

    // Validate extraction completeness
    console.log('==================== EXTRACTION VALIDATION ====================');
    console.log(`Personal Info: ${resumeData.personalInfo?.fullName || 'MISSING'}`);
    console.log(`Email: ${resumeData.personalInfo?.email || 'MISSING'}`);
    console.log(`Phone: ${resumeData.personalInfo?.phone || 'MISSING'}`);
    console.log(`LinkedIn: ${resumeData.personalInfo?.linkedin || 'MISSING'}`);
    console.log(`Summary length: ${resumeData.summary?.length || 0} characters`);
    console.log(`Experience entries: ${resumeData.experience?.length || 0}`);
    console.log(`Education entries: ${resumeData.education?.length || 0}`);
    console.log(`Technical skills: ${resumeData.skills?.technical?.length || 0}`);
    console.log(`Tools: ${resumeData.skills?.tools?.length || 0}`);
    console.log(`Soft skills: ${resumeData.skills?.soft?.length || 0}`);
    console.log(`Languages: ${resumeData.skills?.languages?.length || 0}`);
    console.log(`Projects: ${resumeData.projects?.length || 0}`);
    console.log(`Certifications: ${resumeData.certifications?.length || 0}`);

    // Warn about empty sections
    if (!resumeData.experience || resumeData.experience.length === 0) {
      console.warn('⚠️  WARNING: No experience entries extracted!');
    }
    if (!resumeData.education || resumeData.education.length === 0) {
      console.warn('⚠️  WARNING: No education entries extracted!');
    }
    if (!resumeData.skills?.technical || resumeData.skills.technical.length === 0) {
      console.warn('⚠️  WARNING: No technical skills extracted!');
    }
    console.log('================================================================');

    // Extract ATS score from response or use default
    const atsScore = resumeData.atsScore || {
      overall: 95,
      keywordOptimization: 95,
      formatting: 100,
      structure: 95,
      improvements: ['Resume optimized for ATS compatibility']
    };

    // Remove atsScore from resumeData to keep it separate
    delete resumeData.atsScore;

    console.log('✅ ATS Resume generated successfully');
    console.log('==================== AI RESUME EXTRACTION END ====================\n');

    return {
      success: true,
      resumeData,
      atsScore
    };

  } catch (error) {
    console.error('Gemini API Error:', error);

    // Fallback to gemini-1.5-pro if 2.0-flash fails
    try {
      console.log('Falling back to gemini-1.5-pro...');
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: { temperature: 0.3 }
      });

      const result = await fallbackModel.generateContent(ATS_RESUME_MASTER_PROMPT(extractedText));
      const response = await result.response;
      let responseText = response.text()
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .trim();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const resumeData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
      const atsScore = resumeData.atsScore || { overall: 90, improvements: ['Generated with fallback model'] };
      delete resumeData.atsScore;

      return { success: true, resumeData, atsScore };
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return {
        success: false,
        error: error.message || 'AI Generation Failed'
      };
    }
  }
};

/**
 * Calculate ATS score for a resume
 * @param {Object} resumeData - The structured resume data
 * @returns {Object} - ATS score breakdown
 */
const calculateATSScore = async (resumeData) => {
  try {
    let score = 0;
    const breakdown = {
      overall: 0,
      keywordOptimization: 0,
      formatting: 100, // HTML-based is always well formatted
      structure: 0,
      improvements: []
    };

    // Check personal info completeness (20 points)
    const personalInfo = resumeData?.personalInfo || {};
    let personalScore = 0;
    if (personalInfo.fullName) personalScore += 4;
    if (personalInfo.email) personalScore += 4;
    if (personalInfo.phone) personalScore += 4;
    if (personalInfo.linkedin) personalScore += 4;
    if (personalInfo.location) personalScore += 4;

    // Check experience section (30 points)
    const experience = resumeData?.experience || [];
    let expScore = 0;
    if (experience.length > 0) {
      expScore += 15;
      const hasQuantifiedAchievements = experience.some(exp =>
        exp.achievements?.some(a => /\d+/.test(a))
      );
      if (hasQuantifiedAchievements) expScore += 15;
    }

    // Check skills section (20 points)
    const skills = resumeData?.skills || {};
    let skillsScore = 0;
    if ((skills.technical?.length || 0) > 0) skillsScore += 10;
    if ((skills.tools?.length || 0) > 0) skillsScore += 5;
    if ((skills.soft?.length || 0) > 0) skillsScore += 5;

    // Check education (15 points)
    const education = resumeData?.education || [];
    let eduScore = education.length > 0 ? 15 : 0;

    // Check summary (15 points)
    const summary = resumeData?.summary || '';
    let summaryScore = summary.length > 50 ? 15 : (summary.length > 0 ? 8 : 0);

    // Calculate totals
    breakdown.keywordOptimization = skillsScore + (expScore > 20 ? 10 : 5);
    breakdown.structure = personalScore + eduScore;
    breakdown.overall = personalScore + expScore + skillsScore + eduScore + summaryScore;

    // Generate improvements
    if (!personalInfo.linkedin) breakdown.improvements.push('Add LinkedIn profile URL');
    if (experience.length === 0) breakdown.improvements.push('Add work experience');
    if ((skills.technical?.length || 0) < 5) breakdown.improvements.push('Add more technical skills');
    if (summary.length < 50) breakdown.improvements.push('Expand professional summary');

    return breakdown;
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    return {
      overall: 75,
      keywordOptimization: 75,
      formatting: 100,
      structure: 75,
      improvements: ['Score calculation encountered an error']
    };
  }
};

/**
 * Analyze original resume WITHOUT optimization
 * Returns ATS score and issues found
 * @param {string} extractedText - Raw text from uploaded resume
 * @returns {Object} - { success, originalScore, issues }
 */
const analyzeOriginalResume = async (extractedText) => {
  const ANALYSIS_PROMPT = `
You are an expert ATS (Applicant Tracking System) Resume Analyst. Analyze the following resume and provide:

1. An overall ATS compatibility score (0-100)
2. Detailed breakdown scores for:
   - Keyword Optimization (are industry keywords present?)
   - Formatting (is it ATS-parseable?)
   - Structure (are standard sections present?)
3. A list of specific issues that would hurt ATS parsing

Return ONLY valid JSON (no markdown, no explanation):
{
  "overall": 65,
  "keywordOptimization": 70,
  "formatting": 60,
  "structure": 65,
  "issues": [
    "Missing quantified achievements in experience section",
    "No LinkedIn URL provided",
    "Skills section not categorized",
    "Summary is too brief",
    "Non-standard date format used"
  ]
}

Be REALISTIC with scoring - most raw resumes score 50-75. Only perfect resumes get 90+.

RESUME TO ANALYZE:
${extractedText}
`;

  try {
    // Use gemini-2.0-flash for better analysis (best paid version)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: { temperature: 0.2 }
    });

    const result = await model.generateContent(ANALYSIS_PROMPT);
    const response = await result.response;
    let responseText = response.text()
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/gi, '')
      .trim();

    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    const analysisData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

    console.log('Original resume analyzed. Score:', analysisData.overall);

    return {
      success: true,
      originalScore: {
        overall: analysisData.overall || 60,
        keywordOptimization: analysisData.keywordOptimization || 60,
        formatting: analysisData.formatting || 70,
        structure: analysisData.structure || 65,
        issues: analysisData.issues || ['Analysis incomplete']
      }
    };
  } catch (error) {
    console.error('Original resume analysis failed (Gemini 2.0 Flash):', error);

    // Fallback to 1.5-pro
    try {
      console.log('Falling back to gemini-1.5-pro for analysis...');
      const fallbackModel = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: { temperature: 0.2 }
      });
      const result = await fallbackModel.generateContent(ANALYSIS_PROMPT);
      const response = await result.response;
      let responseText = response.text()
        .replace(/```json\n?/gi, '')
        .replace(/```\n?/gi, '')
        .trim();

      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const analysisData = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

      return {
        success: true,
        originalScore: {
          overall: analysisData.overall || 60,
          keywordOptimization: analysisData.keywordOptimization || 60,
          formatting: analysisData.formatting || 70,
          structure: analysisData.structure || 65,
          issues: analysisData.issues || ['Analysis performed with fallback model']
        }
      };
    } catch (fallbackError) {
      console.error('Fallback analysis failed:', fallbackError);
      return {
        success: true,
        originalScore: calculateLocalATSScore(extractedText)
      };
    }
  }
};

/**
 * Quick local ATS score calculation (fallback)
 */
const calculateLocalATSScore = (text) => {
  const issues = [];
  let score = 50; // Base score

  // Check for email
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
    score += 5;
  } else {
    issues.push('No email address found');
  }

  // Check for phone
  if (/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text)) {
    score += 5;
  } else {
    issues.push('No phone number found');
  }

  // Check for LinkedIn
  if (/linkedin\.com/i.test(text)) {
    score += 5;
  } else {
    issues.push('No LinkedIn profile found');
  }

  // Check for quantified achievements
  if (/\d+%|\$\d+|\d+ (users|customers|projects|team|members)/i.test(text)) {
    score += 10;
  } else {
    issues.push('No quantified achievements found');
  }

  // Check for common section headers
  if (/experience|work history|employment/i.test(text)) score += 5;
  else issues.push('Experience section not clearly labeled');

  if (/education|academic/i.test(text)) score += 5;
  else issues.push('Education section not clearly labeled');

  if (/skills|technologies|expertise/i.test(text)) score += 5;
  else issues.push('Skills section not found');

  // Check text length (too short or too long)
  if (text.length < 500) {
    score -= 10;
    issues.push('Resume content is too brief');
  } else if (text.length > 5000) {
    score -= 5;
    issues.push('Resume may be too long for single page');
  }

  return {
    overall: Math.min(100, Math.max(0, score)),
    keywordOptimization: score > 60 ? 65 : 50,
    formatting: 70,
    structure: score > 60 ? 70 : 55,
    issues
  };
};

module.exports = {
  generateATSResume,
  calculateATSScore,
  analyzeOriginalResume
};
