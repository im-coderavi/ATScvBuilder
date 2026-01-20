import React from 'react';

const ModernTemplate = ({ resumeData, fontFamily = 'Inter', accentColor = '#2563eb' }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, spokenLanguages, awards } = resumeData || {};

    // Check if resume is essentially blank
    const isBlankResume = !personalInfo?.fullName &&
        !summary &&
        (!experience || experience.length === 0) &&
        (!education || education.length === 0);

    // Placeholder text style  
    const placeholderStyle = "text-gray-400 italic";

    // Create lighter version of accent color for backgrounds
    const hexToRgba = (hex, alpha) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return (
        <div
            className="bg-white"
            style={{
                fontFamily: `'${fontFamily}', 'Segoe UI', sans-serif`,
                fontSize: '10.5pt',
                lineHeight: '1.5',
                color: '#374151',
                padding: '12mm 18mm',
                width: '210mm',
                minHeight: '297mm',
            }}
        >
            {/* Header - Modern Clean Style */}
            <div className="mb-6">
                <h1 className="text-4xl font-light text-gray-900 mb-1">
                    {personalInfo?.fullName || <span className={placeholderStyle}>[Your Full Name]</span>}
                </h1>
                {(personalInfo?.title || isBlankResume) && (
                    <p className="text-lg text-gray-500 mb-2">
                        {personalInfo?.title || <span className={placeholderStyle}>[Professional Title - e.g., Full Stack Developer]</span>}
                    </p>
                )}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    {personalInfo?.email ? (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            {personalInfo.email}
                        </span>
                    ) : isBlankResume && (
                        <span className={`flex items-center gap-1 ${placeholderStyle}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            [email@example.com]
                        </span>
                    )}
                    {personalInfo?.phone ? (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {personalInfo.phone}
                        </span>
                    ) : isBlankResume && (
                        <span className={`flex items-center gap-1 ${placeholderStyle}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            [Phone Number]
                        </span>
                    )}
                    {personalInfo?.location ? (
                        <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {personalInfo.location}
                        </span>
                    ) : isBlankResume && (
                        <span className={`flex items-center gap-1 ${placeholderStyle}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            [Location]
                        </span>
                    )}
                    {personalInfo?.linkedin && (
                        <a href={personalInfo.linkedin} className="flex items-center gap-1 hover:underline" style={{ color: accentColor }}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            LinkedIn
                        </a>
                    )}
                    {personalInfo?.github && (
                        <a href={personalInfo.github} className="flex items-center gap-1 hover:underline" style={{ color: accentColor }}>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            GitHub
                        </a>
                    )}
                    {personalInfo?.portfolio && (
                        <a href={personalInfo.portfolio} className="flex items-center gap-1 hover:underline" style={{ color: accentColor }}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                            Portfolio
                        </a>
                    )}
                </div>
            </div>

            {/* Summary */}
            {(summary || isBlankResume) && (
                <div className="mb-5">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">About</h2>
                    <p className={`text-sm leading-relaxed ${summary ? 'text-gray-700' : placeholderStyle}`}>
                        {summary || '[Write a brief professional summary highlighting your experience and key skills...]'}
                    </p>
                </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Experience</h2>
                    {experience.map((exp, i) => (
                        <div key={i} className="mb-4 relative pl-4" style={{ borderLeft: `2px solid ${hexToRgba(accentColor, 0.3)}` }}>
                            <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full" style={{ backgroundColor: accentColor }}></div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                                    <p className="text-sm text-gray-600">
                                        {exp.company} • {exp.location}
                                        {exp.employmentType && <span className="text-gray-500"> • {exp.employmentType}</span>}
                                        {exp.workMode && <span className="text-gray-500"> • {exp.workMode}</span>}
                                    </p>
                                </div>
                                <span className="text-xs text-gray-500 px-2 py-1 rounded" style={{ backgroundColor: hexToRgba(accentColor, 0.1) }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            {exp.technologies?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {exp.technologies.map((tech, j) => (
                                        <span key={j} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: hexToRgba(accentColor, 0.1), color: accentColor }}>{tech}</span>
                                    ))}
                                </div>
                            )}
                            <ul className="mt-2 space-y-1 text-sm text-gray-600">
                                {exp.achievements?.map((ach, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                        <span style={{ color: accentColor }} className="mt-1">→</span>
                                        <span>{ach}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Projects</h2>
                    <div className="grid gap-3">
                        {projects.map((proj, i) => (
                            <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: hexToRgba(accentColor, 0.05) }}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {proj.name}
                                            {proj.role && <span className="font-normal text-gray-500 ml-2">({proj.role})</span>}
                                        </h3>
                                        {proj.projectType && proj.teamSize && (
                                            <p className="text-xs text-gray-500">{proj.projectType} • {proj.teamSize}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        {proj.startDate && proj.endDate && (
                                            <span className="text-xs text-gray-500">{proj.startDate} – {proj.endDate}</span>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                                {proj.highlights?.length > 0 && (
                                    <ul className="mt-1 space-y-1 text-sm text-gray-600">
                                        {proj.highlights.map((h, j) => (
                                            <li key={j} className="flex items-start gap-2">
                                                <span style={{ color: accentColor }}>•</span>
                                                <span>{h}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {proj.technologies?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {proj.technologies.map((tech, j) => (
                                            <span key={j} className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: hexToRgba(accentColor, 0.15), color: accentColor }}>{tech}</span>
                                        ))}
                                    </div>
                                )}
                                <div className="flex gap-3 mt-2">
                                    {(proj.demoUrl || proj.link) && <a href={proj.demoUrl || proj.link} className="text-xs hover:underline" style={{ color: accentColor }}>Live Demo →</a>}
                                    {proj.repoUrl && <a href={proj.repoUrl} className="text-xs hover:underline" style={{ color: accentColor }}>Repository →</a>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Education</h2>
                    {education.map((edu, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.fieldOfStudy || edu.field}</h3>
                                    <p className="text-sm text-gray-600">{edu.institution}{edu.location && ` • ${edu.location}`}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                                    {edu.showGpa !== false && edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                                </div>
                            </div>
                            {edu.coursework?.length > 0 && (
                                <p className="text-xs text-gray-500 mt-1"><strong>Coursework:</strong> {edu.coursework.join(', ')}</p>
                            )}
                            {edu.honors && (
                                <p className="text-xs text-gray-500"><strong>Honors:</strong> {edu.honors}</p>
                            )}
                            {edu.activities && (
                                <p className="text-xs text-gray-500"><strong>Activities:</strong> {edu.activities}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills && (Object.keys(skills).some(k => skills[k]?.length > 0)) && (
                <div className="mb-5">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.languages?.map((skill, i) => (
                            <span key={`lang-${i}`} className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: hexToRgba(accentColor, 0.15), color: accentColor }}>{skill}</span>
                        ))}
                        {skills.frameworks?.map((skill, i) => (
                            <span key={`fw-${i}`} className="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full">{skill}</span>
                        ))}
                        {skills.databases?.map((skill, i) => (
                            <span key={`db-${i}`} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{skill}</span>
                        ))}
                        {skills.cloud?.map((skill, i) => (
                            <span key={`cloud-${i}`} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">{skill}</span>
                        ))}
                        {skills.tools?.map((skill, i) => (
                            <span key={`tool-${i}`} className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">{skill}</span>
                        ))}
                        {skills.methodologies?.map((skill, i) => (
                            <span key={`meth-${i}`} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">{skill}</span>
                        ))}
                        {skills.soft?.map((skill, i) => (
                            <span key={`soft-${i}`} className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">{skill}</span>
                        ))}
                        {skills.technical?.map((skill, i) => (
                            <span key={`tech-${i}`} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full">{skill}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certifications?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Certifications</h2>
                    <div className="flex flex-wrap gap-2">
                        {certifications.map((cert, i) => (
                            <div key={i} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                <span className="font-medium">{cert.name}</span> • {cert.issuer}
                                {cert.expiryDate && <span className="text-yellow-600"> • Expires: {cert.expiryDate}</span>}
                                {cert.credentialUrl && <a href={cert.credentialUrl} className="ml-1 underline">Verify</a>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Spoken Languages */}
            {spokenLanguages?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Languages</h2>
                    <div className="flex flex-wrap gap-2">
                        {spokenLanguages.map((lang, i) => (
                            <span key={i} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: hexToRgba(accentColor, 0.1) }}>
                                <strong>{lang.language}</strong> - {lang.proficiency}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Awards */}
            {awards?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Awards & Achievements</h2>
                    {awards.map((award, i) => (
                        <div key={i} className="text-sm text-gray-700 mb-1">
                            <span className="font-medium">{award.title}</span>
                            <span className="text-gray-500"> – {award.issuer}, {award.date}</span>
                            {award.description && <p className="text-xs text-gray-500">{award.description}</p>}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModernTemplate;
