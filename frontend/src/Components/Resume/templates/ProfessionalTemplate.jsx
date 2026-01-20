import React from 'react';

const ProfessionalTemplate = ({ resumeData, fontFamily = 'Georgia', accentColor = '#1a365d' }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, spokenLanguages, awards } = resumeData || {};

    // Check if resume is essentially blank (no meaningful content filled yet)
    const isBlankResume = !personalInfo?.fullName &&
        !summary &&
        (!experience || experience.length === 0) &&
        (!education || education.length === 0);

    // Placeholder text style
    const placeholderStyle = "text-gray-400 italic";

    return (
        <div
            className="bg-white"
            style={{
                fontFamily: `'${fontFamily}', 'Times New Roman', serif`,
                fontSize: '10pt',
                lineHeight: '1.3',
                color: '#1a1a1a',
                padding: '8mm 15mm',
                width: '210mm',
                minHeight: '297mm',
                maxHeight: '297mm',
                overflow: 'hidden',
                boxSizing: 'border-box',
            }}
        >
            {/* Header */}
            <div className="text-center pb-2 mb-3" style={{ borderBottom: `2px solid ${accentColor}` }}>
                <h1 className="text-2xl font-bold uppercase tracking-wider mb-0" style={{ color: accentColor }}>
                    {personalInfo?.fullName || <span className={placeholderStyle}>[Your Full Name]</span>}
                </h1>
                {(personalInfo?.title || isBlankResume) && (
                    <p className="text-sm text-gray-600 mb-1">
                        {personalInfo?.title || <span className={placeholderStyle}>[Professional Title - e.g., Software Engineer]</span>}
                    </p>
                )}
                <div className="text-xs text-gray-700 flex flex-wrap justify-center gap-2">
                    {personalInfo?.email ? <span>{personalInfo.email}</span> : isBlankResume && <span className={placeholderStyle}>[email@example.com]</span>}
                    {personalInfo?.phone ? <><span style={{ color: accentColor }}>•</span><span>{personalInfo.phone}</span></> : isBlankResume && <><span style={{ color: accentColor }}>•</span><span className={placeholderStyle}>[Phone]</span></>}
                    {personalInfo?.location ? <><span style={{ color: accentColor }}>•</span><span>{personalInfo.location}</span></> : isBlankResume && <><span style={{ color: accentColor }}>•</span><span className={placeholderStyle}>[Location]</span></>}
                    {personalInfo?.linkedin && <><span style={{ color: accentColor }}>•</span><a href={personalInfo.linkedin} style={{ color: accentColor }} className="hover:underline">LinkedIn</a></>}
                    {personalInfo?.github && <><span style={{ color: accentColor }}>•</span><a href={personalInfo.github} style={{ color: accentColor }} className="hover:underline">GitHub</a></>}
                    {personalInfo?.portfolio && <><span style={{ color: accentColor }}>•</span><a href={personalInfo.portfolio} style={{ color: accentColor }} className="hover:underline">Portfolio</a></>}
                </div>
            </div>

            {/* Summary */}
            {(summary || isBlankResume) && (
                <div className="mb-3">
                    <div style={{ borderBottom: `1px solid ${accentColor}`, marginBottom: '4px', paddingBottom: '2px' }}>
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor, lineHeight: '1.2', marginBottom: '0' }}>
                            Professional Summary
                        </h2>
                    </div>
                    <p className={`text-xs leading-snug text-justify ${summary ? 'text-gray-800' : placeholderStyle}`}>
                        {summary || '[Write a compelling 2-3 sentence summary highlighting your experience, key skills, and career goals...]'}
                    </p>
                </div>
            )}

            {/* Experience */}
            {(experience?.length > 0 || isBlankResume) && (
                <div className="mb-3">
                    <div style={{ borderBottom: `1px solid ${accentColor}`, marginBottom: '4px', paddingBottom: '2px' }}>
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor, lineHeight: '1.2', marginBottom: '0' }}>
                            Professional Experience
                        </h2>
                    </div>
                    {experience?.length > 0 ? experience.map((exp, i) => (
                        <div key={i} className="mb-2">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-900">{exp.title}</h3>
                                <span className="text-xs text-gray-600 italic">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700 italic">
                                    {exp.company}
                                    {exp.employmentType && <span className="text-gray-500"> • {exp.employmentType}</span>}
                                    {exp.workMode && <span className="text-gray-500"> • {exp.workMode}</span>}
                                </span>
                                <span className="text-gray-600 text-xs">{exp.location}</span>
                            </div>
                            {exp.technologies?.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                    <strong>Technologies:</strong> {exp.technologies.join(', ')}
                                </p>
                            )}
                            <ul className="mt-1 ml-4 list-disc text-sm text-gray-700 space-y-0.5">
                                {exp.achievements?.map((ach, j) => <li key={j}>{ach}</li>)}
                            </ul>
                        </div>
                    )) : (
                        <div className={placeholderStyle}>
                            <div className="mb-2">
                                <div className="flex justify-between items-baseline">
                                    <span className="font-medium">[Job Title]</span>
                                    <span className="text-xs">[Start Date] – [End Date]</span>
                                </div>
                                <div className="text-sm">[Company Name] • [Location]</div>
                                <ul className="mt-1 ml-4 list-disc text-sm space-y-0.5">
                                    <li>[Achievement or responsibility #1]</li>
                                    <li>[Achievement or responsibility #2]</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Education */}
            {(education?.length > 0 || isBlankResume) && (
                <div className="mb-3">
                    <div style={{ borderBottom: `1px solid ${accentColor}`, marginBottom: '4px', paddingBottom: '2px' }}>
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor, lineHeight: '1.2', marginBottom: '0' }}>
                            Education
                        </h2>
                    </div>
                    {education?.length > 0 ? education.map((edu, i) => (
                        <div key={i} className="mb-1.5">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-900">{edu.degree} in {edu.fieldOfStudy || edu.field}</h3>
                                <span className="text-xs text-gray-600 italic">{edu.graduationDate}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700 italic">{edu.institution}{edu.location && ` • ${edu.location}`}</span>
                                {edu.showGpa !== false && edu.gpa && <span className="text-xs text-gray-600">GPA: {edu.gpa}</span>}
                            </div>
                            {edu.coursework?.length > 0 && (
                                <p className="text-xs text-gray-600 mt-1"><strong>Relevant Coursework:</strong> {edu.coursework.join(', ')}</p>
                            )}
                            {edu.honors && (
                                <p className="text-xs text-gray-600"><strong>Honors:</strong> {edu.honors}</p>
                            )}
                            {edu.activities && (
                                <p className="text-xs text-gray-600"><strong>Activities:</strong> {edu.activities}</p>
                            )}
                        </div>
                    )) : (
                        <div className={placeholderStyle}>
                            <div className="flex justify-between items-baseline">
                                <span className="font-medium">[Degree] in [Field of Study]</span>
                                <span className="text-xs">[Graduation Date]</span>
                            </div>
                            <div className="text-sm">[University/College Name] • [Location]</div>
                        </div>
                    )}
                </div>
            )}

            {/* Skills */}
            {(skills && Object.keys(skills).some(k => skills[k]?.length > 0)) ? (
                <div className="mb-3">
                    <div style={{ borderBottom: `1px solid ${accentColor}`, marginBottom: '4px', paddingBottom: '2px' }}>
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor, lineHeight: '1.2', marginBottom: '0' }}>
                            Skills
                        </h2>
                    </div>
                    <div className="text-xs text-gray-700 space-y-0.5">
                        {skills.languages?.length > 0 && <p><strong>Languages:</strong> {skills.languages.join(', ')}</p>}
                        {skills.frameworks?.length > 0 && <p><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</p>}
                        {skills.databases?.length > 0 && <p><strong>Databases:</strong> {skills.databases.join(', ')}</p>}
                        {skills.cloud?.length > 0 && <p><strong>Cloud & DevOps:</strong> {skills.cloud.join(', ')}</p>}
                        {skills.tools?.length > 0 && <p><strong>Tools:</strong> {skills.tools.join(', ')}</p>}
                        {skills.methodologies?.length > 0 && <p><strong>Methodologies:</strong> {skills.methodologies.join(', ')}</p>}
                        {skills.coreCS?.length > 0 && <p><strong>Core CS:</strong> {skills.coreCS.join(', ')}</p>}
                        {skills.soft?.length > 0 && <p><strong>Soft Skills:</strong> {skills.soft.join(', ')}</p>}
                        {skills.technical?.length > 0 && <p><strong>Technical:</strong> {skills.technical.join(', ')}</p>}
                    </div>
                </div>
            ) : isBlankResume && (
                <div className="mb-3">
                    <div style={{ borderBottom: `1px solid ${accentColor}`, marginBottom: '4px', paddingBottom: '2px' }}>
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor, lineHeight: '1.2', marginBottom: '0' }}>
                            Skills
                        </h2>
                    </div>
                    <div className={`text-xs space-y-0.5 ${placeholderStyle}`}>
                        <p><strong>Programming Languages:</strong> [JavaScript, Python, Java...]</p>
                        <p><strong>Frameworks:</strong> [React, Node.js, Express...]</p>
                        <p><strong>Tools:</strong> [Git, Docker, VS Code...]</p>
                    </div>
                </div>
            )}

            {/* Projects */}
            {(projects?.length > 0 || isBlankResume) && (
                <div className="mb-3">
                    <div style={{ borderBottom: `1px solid ${accentColor}`, marginBottom: '4px', paddingBottom: '2px' }}>
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor, lineHeight: '1.2', marginBottom: '0' }}>
                            Projects
                        </h2>
                    </div>
                    {projects?.length > 0 ? projects.map((proj, i) => (
                        <div key={i} className="mb-1.5">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-gray-900">
                                    {proj.name}
                                    {proj.role && <span className="font-normal text-gray-600 ml-2 text-xs">({proj.role})</span>}
                                    {proj.technologies?.length > 0 && (
                                        <span className="font-normal text-gray-600 ml-2 text-xs">
                                            | {proj.technologies.join(', ')}
                                        </span>
                                    )}
                                </h3>
                                <span className="text-xs text-gray-500">
                                    {proj.startDate && proj.endDate && `${proj.startDate} – ${proj.endDate}`}
                                </span>
                            </div>
                            {proj.projectType && proj.teamSize && (
                                <p className="text-xs text-gray-500">{proj.projectType} Project • {proj.teamSize}</p>
                            )}
                            <p className="text-sm text-gray-700">{proj.description}</p>
                            {proj.highlights?.length > 0 && (
                                <ul className="mt-1 ml-4 list-disc text-sm text-gray-700 space-y-0.5">
                                    {proj.highlights.map((h, j) => <li key={j}>{h}</li>)}
                                </ul>
                            )}
                            <div className="flex gap-3 mt-1">
                                {(proj.demoUrl || proj.link) && <a href={proj.demoUrl || proj.link} style={{ color: accentColor }} className="text-xs hover:underline">Live Demo</a>}
                                {proj.repoUrl && <a href={proj.repoUrl} style={{ color: accentColor }} className="text-xs hover:underline">Repository</a>}
                            </div>
                        </div>
                    )) : (
                        <div className={placeholderStyle}>
                            <div className="font-medium">[Project Name] | [Technologies Used]</div>
                            <p className="text-sm">[Brief description of project and key features...]</p>
                        </div>
                    )}
                </div>
            )}

            {/* Certifications */}
            {certifications?.length > 0 && (
                <div className="mb-3">
                    <div style={{ borderBottom: `1px solid ${accentColor}`, marginBottom: '4px', paddingBottom: '2px' }}>
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor, lineHeight: '1.2', marginBottom: '0' }}>
                            Certifications
                        </h2>
                    </div>
                    {certifications.map((cert, i) => (
                        <div key={i} className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">{cert.name}</span>
                            <span className="text-gray-500"> – {cert.issuer}, {cert.date}</span>
                            {cert.expiryDate && <span className="text-gray-500"> (Expires: {cert.expiryDate})</span>}
                            {cert.credentialId && <span className="text-xs text-gray-400 ml-2">ID: {cert.credentialId}</span>}
                            {cert.credentialUrl && <a href={cert.credentialUrl} style={{ color: accentColor }} className="text-xs ml-2 hover:underline">Verify</a>}
                        </div>
                    ))}
                </div>
            )}

            {/* Spoken Languages */}
            {spokenLanguages?.length > 0 && (
                <div className="mb-3">
                    <div style={{ borderBottom: `1px solid ${accentColor}`, marginBottom: '4px', paddingBottom: '2px' }}>
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor, lineHeight: '1.2', marginBottom: '0' }}>
                            Languages
                        </h2>
                    </div>
                    <div className="text-sm text-gray-700 flex flex-wrap gap-3">
                        {spokenLanguages.map((lang, i) => (
                            <span key={i}>
                                <strong>{lang.language}</strong>
                                <span className="text-gray-500"> ({lang.proficiency})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Awards */}
            {awards?.length > 0 && (
                <div className="mb-3">
                    <div style={{ borderBottom: `1px solid ${accentColor}`, marginBottom: '4px', paddingBottom: '2px' }}>
                        <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: accentColor, lineHeight: '1.2', marginBottom: '0' }}>
                            Awards & Achievements
                        </h2>
                    </div>
                    {awards.map((award, i) => (
                        <div key={i} className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">{award.title}</span>
                            <span className="text-gray-500"> – {award.issuer}, {award.date}</span>
                            {award.description && <p className="text-xs text-gray-600 mt-0.5">{award.description}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProfessionalTemplate;

