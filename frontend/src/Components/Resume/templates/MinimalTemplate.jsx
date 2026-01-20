import React from 'react';

const MinimalTemplate = ({ resumeData, fontFamily = 'Helvetica', accentColor = '#111111' }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, spokenLanguages, awards } = resumeData || {};

    return (
        <div
            className="bg-white"
            style={{
                fontFamily: `'${fontFamily}', 'Arial', sans-serif`,
                fontSize: '10pt',
                lineHeight: '1.6',
                color: '#111',
                padding: '20mm 25mm',
                width: '210mm',
                minHeight: '297mm',
            }}
        >
            {/* Header - Ultra Minimal */}
            <div className="mb-8">
                <h1 className="text-3xl font-light tracking-tight mb-1" style={{ color: accentColor }}>
                    {personalInfo?.fullName || '[Your Name]'}
                </h1>
                {personalInfo?.title && (
                    <p className="text-sm text-gray-500 mb-2">{personalInfo.title}</p>
                )}
                <div className="text-xs text-gray-500 space-x-3">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                    {personalInfo?.linkedin && <a href={personalInfo.linkedin} className="underline" style={{ color: accentColor }}>LinkedIn</a>}
                    {personalInfo?.github && <a href={personalInfo.github} className="underline" style={{ color: accentColor }}>GitHub</a>}
                    {personalInfo?.portfolio && <a href={personalInfo.portfolio} className="underline" style={{ color: accentColor }}>Portfolio</a>}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-8">
                    <p className="text-sm text-gray-700 leading-relaxed max-w-2xl">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xs font-medium uppercase tracking-[0.2em] mb-4" style={{ color: accentColor, opacity: 0.6 }}>Experience</h2>
                    <div className="space-y-6">
                        {experience.map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <span className="font-medium" style={{ color: accentColor }}>{exp.title}</span>
                                    <span className="text-xs text-gray-400">{exp.startDate} — {exp.current ? 'Present' : exp.endDate}</span>
                                </div>
                                <p className="text-sm text-gray-500 mb-1">
                                    {exp.company}, {exp.location}
                                    {exp.employmentType && ` · ${exp.employmentType}`}
                                    {exp.workMode && ` · ${exp.workMode}`}
                                </p>
                                {exp.technologies?.length > 0 && (
                                    <p className="text-xs text-gray-400 mb-2">{exp.technologies.join(' · ')}</p>
                                )}
                                <ul className="text-sm text-gray-600 space-y-1">
                                    {exp.achievements?.map((ach, j) => (
                                        <li key={j} className="pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300">{ach}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xs font-medium uppercase tracking-[0.2em] mb-4" style={{ color: accentColor, opacity: 0.6 }}>Projects</h2>
                    <div className="space-y-4">
                        {projects.map((proj, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <span className="font-medium" style={{ color: accentColor }}>
                                        {proj.name}
                                        {proj.role && <span className="font-normal text-gray-500 ml-2">({proj.role})</span>}
                                    </span>
                                    {proj.startDate && proj.endDate && (
                                        <span className="text-xs text-gray-400">{proj.startDate} — {proj.endDate}</span>
                                    )}
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{proj.description}</p>
                                {proj.highlights?.length > 0 && (
                                    <ul className="text-sm text-gray-600 mt-1 space-y-1">
                                        {proj.highlights.map((h, j) => (
                                            <li key={j} className="pl-4 relative before:content-['–'] before:absolute before:left-0 before:text-gray-300">{h}</li>
                                        ))}
                                    </ul>
                                )}
                                {proj.technologies?.length > 0 && (
                                    <p className="text-xs text-gray-400 mt-1">{proj.technologies.join(' · ')}</p>
                                )}
                                <div className="flex gap-3 mt-1">
                                    {(proj.demoUrl || proj.link) && <a href={proj.demoUrl || proj.link} className="text-xs text-gray-400 underline">Demo</a>}
                                    {proj.repoUrl && <a href={proj.repoUrl} className="text-xs text-gray-400 underline">Repo</a>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xs font-medium uppercase tracking-[0.2em] mb-4" style={{ color: accentColor, opacity: 0.6 }}>Education</h2>
                    <div className="space-y-3">
                        {education.map((edu, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-medium" style={{ color: accentColor }}>{edu.degree}</span>
                                        <span className="text-gray-500"> in {edu.fieldOfStudy || edu.field}</span>
                                        <p className="text-sm text-gray-500">{edu.institution}{edu.location && `, ${edu.location}`}</p>
                                    </div>
                                    <span className="text-xs text-gray-400">{edu.graduationDate}</span>
                                </div>
                                {edu.showGpa !== false && edu.gpa && <p className="text-xs text-gray-500">GPA: {edu.gpa}</p>}
                                {edu.coursework?.length > 0 && <p className="text-xs text-gray-400">{edu.coursework.join(' · ')}</p>}
                                {edu.honors && <p className="text-xs text-gray-500">{edu.honors}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {skills && (Object.keys(skills).some(k => skills[k]?.length > 0)) && (
                <div className="mb-8">
                    <h2 className="text-xs font-medium uppercase tracking-[0.2em] mb-4" style={{ color: accentColor, opacity: 0.6 }}>Skills</h2>
                    <div className="text-sm text-gray-600 space-y-1">
                        {skills.languages?.length > 0 && <p>{skills.languages.join(' · ')}</p>}
                        {skills.frameworks?.length > 0 && <p>{skills.frameworks.join(' · ')}</p>}
                        {skills.databases?.length > 0 && <p>{skills.databases.join(' · ')}</p>}
                        {skills.cloud?.length > 0 && <p>{skills.cloud.join(' · ')}</p>}
                        {skills.tools?.length > 0 && <p>{skills.tools.join(' · ')}</p>}
                        {skills.methodologies?.length > 0 && <p>{skills.methodologies.join(' · ')}</p>}
                        {skills.soft?.length > 0 && <p>{skills.soft.join(' · ')}</p>}
                        {skills.technical?.length > 0 && <p>{skills.technical.join(' · ')}</p>}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certifications?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xs font-medium uppercase tracking-[0.2em] mb-4" style={{ color: accentColor, opacity: 0.6 }}>Certifications</h2>
                    <div className="space-y-1">
                        {certifications.map((cert, i) => (
                            <p key={i} className="text-sm text-gray-600">
                                {cert.name} — {cert.issuer}
                                {cert.expiryDate && ` (Exp: ${cert.expiryDate})`}
                                {cert.credentialUrl && <a href={cert.credentialUrl} className="ml-2 underline text-xs" style={{ color: accentColor }}>Verify</a>}
                            </p>
                        ))}
                    </div>
                </div>
            )}

            {/* Languages */}
            {spokenLanguages?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xs font-medium uppercase tracking-[0.2em] mb-4" style={{ color: accentColor, opacity: 0.6 }}>Languages</h2>
                    <p className="text-sm text-gray-600">
                        {spokenLanguages.map((lang, i) => (
                            <span key={i}>{lang.language} ({lang.proficiency}){i < spokenLanguages.length - 1 ? ' · ' : ''}</span>
                        ))}
                    </p>
                </div>
            )}

            {/* Awards */}
            {awards?.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-xs font-medium uppercase tracking-[0.2em] mb-4" style={{ color: accentColor, opacity: 0.6 }}>Awards</h2>
                    <div className="space-y-1">
                        {awards.map((award, i) => (
                            <div key={i} className="text-sm text-gray-600">
                                <span className="font-medium">{award.title}</span> — {award.issuer}, {award.date}
                                {award.description && <p className="text-xs text-gray-500">{award.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MinimalTemplate;
