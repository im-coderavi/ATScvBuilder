import React from 'react';

const ExecutiveTemplate = ({ resumeData, fontFamily = 'Garamond', accentColor = '#44403c' }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, spokenLanguages, awards } = resumeData || {};

    return (
        <div
            className="bg-white"
            style={{
                fontFamily: `'${fontFamily}', 'Times New Roman', serif`,
                fontSize: '11pt',
                lineHeight: '1.4',
                color: '#1f2937',
                padding: '18mm 22mm',
                width: '210mm',
                minHeight: '297mm',
            }}
        >
            {/* Executive Header - Elegant with subtle line */}
            <div className="text-center mb-5 pb-3" style={{ borderBottom: `2px solid ${accentColor}` }}>
                <h1 className="text-3xl font-bold tracking-wide uppercase mb-1" style={{ color: accentColor }}>
                    {personalInfo?.fullName || '[Your Name]'}
                </h1>
                {personalInfo?.title && <p className="text-gray-600 mb-1">{personalInfo.title}</p>}
                <div className="text-sm text-gray-600 flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
                    {personalInfo?.email && <span>{personalInfo.email}</span>}
                    {personalInfo?.phone && <span>|</span>}
                    {personalInfo?.phone && <span>{personalInfo.phone}</span>}
                    {personalInfo?.location && <span>|</span>}
                    {personalInfo?.location && <span>{personalInfo.location}</span>}
                </div>
                <div className="text-sm text-gray-500 flex justify-center gap-x-4 mt-1">
                    {personalInfo?.linkedin && <a href={personalInfo.linkedin} className="hover:underline" style={{ color: accentColor }}>LinkedIn</a>}
                    {personalInfo?.portfolio && <a href={personalInfo.portfolio} className="hover:underline" style={{ color: accentColor }}>Portfolio</a>}
                </div>
            </div>

            {/* Executive Summary */}
            {summary && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}33` }}>
                        Executive Summary
                    </h2>
                    <p className="text-sm text-gray-700 leading-relaxed text-justify italic">{summary}</p>
                </div>
            )}

            {/* Core Competencies */}
            {skills && (Object.keys(skills).some(k => skills[k]?.length > 0)) && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}33` }}>
                        Core Competencies
                    </h2>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-sm text-gray-700">
                        {[...(skills.languages || []), ...(skills.frameworks || []), ...(skills.databases || []), ...(skills.cloud || []), ...(skills.tools || []), ...(skills.methodologies || []), ...(skills.technical || []), ...(skills.soft || [])].slice(0, 12).map((skill, i) => (
                            <span key={i} className="flex items-center">
                                <span className="w-1.5 h-1.5 rounded-full mr-2" style={{ backgroundColor: accentColor }}></span>
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Professional Experience */}
            {experience?.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}33` }}>
                        Professional Experience
                    </h2>
                    {experience.map((exp, i) => (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold uppercase text-sm" style={{ color: accentColor }}>{exp.company}</h3>
                                <span className="text-xs text-gray-600">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <p className="text-sm text-gray-700 italic mb-1">{exp.title} | {exp.location}</p>
                            <ul className="ml-4 list-disc text-sm text-gray-700 space-y-0.5">
                                {exp.achievements?.map((ach, j) => <li key={j}>{ach}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Education */}
            {education?.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}33` }}>
                        Education
                    </h2>
                    {education.map((edu, i) => (
                        <div key={i} className="flex justify-between items-baseline mb-1">
                            <div>
                                <span className="font-bold" style={{ color: accentColor }}>{edu.degree} in {edu.fieldOfStudy || edu.field}</span>
                                <span className="text-gray-600"> – {edu.institution}</span>
                            </div>
                            <span className="text-xs text-gray-600">{edu.graduationDate}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Certifications */}
            {certifications?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}33` }}>
                        Certifications & Credentials
                    </h2>
                    <div className="text-sm text-gray-700">
                        {certifications.map((cert, i) => (
                            <span key={i}>{cert.name} ({cert.issuer}){i < certifications.length - 1 ? ' • ' : ''}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Awards */}
            {awards?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}33` }}>
                        Awards & Recognition
                    </h2>
                    {awards.map((award, i) => (
                        <div key={i} className="text-sm text-gray-700">
                            <span className="font-medium">{award.title}</span> – {award.issuer}, {award.date}
                        </div>
                    ))}
                </div>
            )}

            {/* Languages */}
            {spokenLanguages?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-widest pb-1 mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}33` }}>
                        Languages
                    </h2>
                    <p className="text-sm text-gray-700">
                        {spokenLanguages.map((lang, i) => `${lang.language} (${lang.proficiency})`).join(' | ')}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ExecutiveTemplate;
