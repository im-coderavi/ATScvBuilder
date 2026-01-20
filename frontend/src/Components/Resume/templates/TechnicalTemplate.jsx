import React from 'react';

const TechnicalTemplate = ({ resumeData, fontFamily = 'Roboto Mono', accentColor = '#2563eb' }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, spokenLanguages, awards } = resumeData || {};

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
                fontFamily: `'${fontFamily}', 'Consolas', monospace`,
                fontSize: '10pt',
                lineHeight: '1.45',
                color: '#0f172a',
                padding: '12mm 16mm',
                width: '210mm',
                minHeight: '297mm',
            }}
        >
            {/* Tech Header */}
            <div className="pl-4 mb-5" style={{ borderLeft: `4px solid ${accentColor}` }}>
                <h1 className="text-2xl font-bold text-gray-900 mb-0.5">
                    {personalInfo?.fullName || '[Your Name]'}
                </h1>
                {personalInfo?.title && <p className="text-sm text-gray-600 mb-1">{personalInfo.title}</p>}
                <div className="text-xs text-gray-600 font-mono flex flex-wrap gap-2">
                    {personalInfo?.email && <span className="bg-gray-100 px-2 py-0.5 rounded">{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="bg-gray-100 px-2 py-0.5 rounded">{personalInfo.phone}</span>}
                    {personalInfo?.location && <span className="bg-gray-100 px-2 py-0.5 rounded">{personalInfo.location}</span>}
                    {personalInfo?.linkedin && <a href={personalInfo.linkedin} className="px-2 py-0.5 rounded" style={{ backgroundColor: hexToRgba(accentColor, 0.1), color: accentColor }}>LinkedIn</a>}
                    {personalInfo?.github && <a href={personalInfo.github} className="px-2 py-0.5 rounded bg-gray-800 text-white">GitHub</a>}
                    {personalInfo?.portfolio && <a href={personalInfo.portfolio} className="px-2 py-0.5 rounded bg-green-100 text-green-700">Portfolio</a>}
                </div>
            </div>

            {/* Technical Skills - Prominent for tech roles */}
            {skills && (Object.keys(skills).some(k => skills[k]?.length > 0)) && (
                <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: hexToRgba(accentColor, 0.05) }}>
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>// TECHNICAL SKILLS</h2>
                    <div className="space-y-1 text-xs">
                        {skills.languages?.length > 0 && <div><span className="text-gray-500">languages:</span> <span className="text-gray-800">{skills.languages.join(' | ')}</span></div>}
                        {skills.frameworks?.length > 0 && <div><span className="text-gray-500">frameworks:</span> <span className="text-gray-800">{skills.frameworks.join(' | ')}</span></div>}
                        {skills.databases?.length > 0 && <div><span className="text-gray-500">databases:</span> <span className="text-gray-800">{skills.databases.join(' | ')}</span></div>}
                        {skills.cloud?.length > 0 && <div><span className="text-gray-500">cloud:</span> <span className="text-gray-800">{skills.cloud.join(' | ')}</span></div>}
                        {skills.tools?.length > 0 && <div><span className="text-gray-500">tools:</span> <span className="text-gray-800">{skills.tools.join(' | ')}</span></div>}
                        {skills.methodologies?.length > 0 && <div><span className="text-gray-500">methods:</span> <span className="text-gray-800">{skills.methodologies.join(' | ')}</span></div>}
                        {skills.technical?.length > 0 && <div><span className="text-gray-500">technical:</span> <span className="text-gray-800">{skills.technical.join(' | ')}</span></div>}
                    </div>
                </div>
            )}

            {/* Summary */}
            {summary && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>// SUMMARY</h2>
                    <p className="text-xs text-gray-700 leading-relaxed">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>// EXPERIENCE</h2>
                    {experience.map((exp, i) => (
                        <div key={i} className="mb-3 pl-3" style={{ borderLeft: `2px solid ${hexToRgba(accentColor, 0.3)}` }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">{exp.title}</h3>
                                    <p className="text-xs" style={{ color: accentColor }}>{exp.company} <span className="text-gray-400">@ {exp.location}</span>{exp.employmentType && <span className="text-gray-400"> · {exp.employmentType}</span>}{exp.workMode && <span className="text-gray-400"> · {exp.workMode}</span>}</p>
                                </div>
                                <code className="text-[10px] px-1.5 py-0.5 rounded text-gray-600" style={{ backgroundColor: hexToRgba(accentColor, 0.1) }}>{exp.startDate} → {exp.current ? 'Present' : exp.endDate}</code>
                            </div>
                            <ul className="mt-1 text-xs text-gray-600 space-y-0.5">
                                {exp.achievements?.map((ach, j) => (
                                    <li key={j} className="flex items-start">
                                        <span className="mr-1.5" style={{ color: accentColor }}>›</span>
                                        <span>{ach}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects - Important for tech */}
            {projects?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>// PROJECTS</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {projects.map((proj, i) => (
                            <div key={i} className="p-2 rounded text-xs" style={{ backgroundColor: hexToRgba(accentColor, 0.03) }}>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-gray-900">{proj.name}</h3>
                                    {proj.link && <a href={proj.link} className="text-[10px]" style={{ color: accentColor }}>[link]</a>}
                                </div>
                                <p className="text-gray-600 mt-0.5">{proj.description}</p>
                                {proj.technologies?.length > 0 && (
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {proj.technologies.map((tech, j) => (
                                            <code key={j} className="text-[9px] px-1 rounded" style={{ backgroundColor: hexToRgba(accentColor, 0.15), color: accentColor }}>{tech}</code>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>// EDUCATION</h2>
                    {education.map((edu, i) => (
                        <div key={i} className="flex justify-between items-baseline mb-1 text-xs">
                            <div>
                                <span className="font-bold text-gray-900">{edu.degree}</span>
                                <span className="text-gray-600"> in {edu.fieldOfStudy || edu.field} – {edu.institution}</span>
                            </div>
                            <code className="text-gray-500">{edu.graduationDate}</code>
                        </div>
                    ))}
                </div>
            )}

            {/* Certifications */}
            {certifications?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>// CERTIFICATIONS</h2>
                    <div className="flex flex-wrap gap-1">
                        {certifications.map((cert, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-green-100 text-green-800">{cert.name}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Languages */}
            {spokenLanguages?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>// LANGUAGES</h2>
                    <div className="flex flex-wrap gap-1">
                        {spokenLanguages.map((lang, i) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-gray-100">{lang.language} ({lang.proficiency})</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Awards */}
            {awards?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>// AWARDS</h2>
                    {awards.map((award, i) => (
                        <div key={i} className="text-xs mb-1">
                            <span className="font-bold">{award.title}</span>
                            <span className="text-gray-500"> – {award.issuer}, {award.date}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TechnicalTemplate;
