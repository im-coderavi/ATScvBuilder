import React from 'react';

const CreativeTemplate = ({ resumeData, fontFamily = 'Poppins', accentColor = '#7c3aed' }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, spokenLanguages, awards } = resumeData || {};

    // Helper to create gradient and lighter colors
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
                fontSize: '10pt',
                lineHeight: '1.5',
                color: '#1f2937',
                padding: '15mm 20mm',
                width: '210mm',
                minHeight: '297mm',
            }}
        >
            {/* Header - Creative with Gradient */}
            <div className="mb-6 relative">
                <div className="absolute top-0 left-0 w-24 h-24 rounded-full opacity-20 -translate-x-8 -translate-y-8"
                    style={{ background: `linear-gradient(to bottom right, ${accentColor}, ${hexToRgba(accentColor, 0.5)})` }}></div>
                <h1 className="text-4xl font-bold mb-1" style={{ color: accentColor }}>
                    {personalInfo?.fullName || '[Your Name]'}
                </h1>
                {personalInfo?.title && <p className="text-gray-600 mb-2">{personalInfo.title}</p>}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    {personalInfo?.email && (
                        <span className="flex items-center gap-1">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: hexToRgba(accentColor, 0.1) }}>
                                <svg className="w-3 h-3" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </span>
                            {personalInfo.email}
                        </span>
                    )}
                    {personalInfo?.phone && (
                        <span className="flex items-center gap-1">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: hexToRgba(accentColor, 0.15) }}>
                                <svg className="w-3 h-3" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            </span>
                            {personalInfo.phone}
                        </span>
                    )}
                    {personalInfo?.location && (
                        <span className="flex items-center gap-1">
                            <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: hexToRgba(accentColor, 0.1) }}>
                                <svg className="w-3 h-3" style={{ color: accentColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                            </span>
                            {personalInfo.location}
                        </span>
                    )}
                    {personalInfo?.linkedin && (
                        <a href={personalInfo.linkedin} className="flex items-center gap-1 hover:underline" style={{ color: accentColor }}>
                            <span className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: hexToRgba(accentColor, 0.1) }}>
                                <svg className="w-3 h-3" style={{ color: accentColor }} fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                            </span>
                            LinkedIn
                        </a>
                    )}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <div className="mb-5 p-4 rounded-xl" style={{ background: `linear-gradient(to right, ${hexToRgba(accentColor, 0.1)}, ${hexToRgba(accentColor, 0.05)})` }}>
                    <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="w-8 h-1 rounded" style={{ background: accentColor }}></span>
                        Experience
                    </h2>
                    {experience.map((exp, i) => (
                        <div key={i} className="mb-4 pl-4" style={{ borderLeft: `2px solid ${hexToRgba(accentColor, 0.3)}` }}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                                    <p className="text-sm" style={{ color: accentColor }}>{exp.company}</p>
                                </div>
                                <span className="text-xs text-gray-500 px-2 py-1 rounded-full" style={{ backgroundColor: hexToRgba(accentColor, 0.1) }}>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <p className="text-xs text-gray-500 mb-2">{exp.location}</p>
                            <ul className="space-y-1 text-sm text-gray-600">
                                {exp.achievements?.map((ach, j) => (
                                    <li key={j} className="flex items-start gap-2">
                                        <span style={{ color: accentColor }} className="mt-1">✦</span>
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
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="w-8 h-1 rounded" style={{ background: accentColor }}></span>
                        Projects
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {projects.map((proj, i) => (
                            <div key={i} className="p-3 rounded-xl" style={{ background: `linear-gradient(to bottom right, ${hexToRgba(accentColor, 0.08)}, ${hexToRgba(accentColor, 0.03)})` }}>
                                <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                                <p className="text-xs text-gray-600 mt-1">{proj.description}</p>
                                {proj.technologies?.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                        {proj.technologies.slice(0, 3).map((tech, j) => (
                                            <span key={j} className="text-[10px] bg-white px-2 py-0.5 rounded-full border" style={{ color: accentColor, borderColor: hexToRgba(accentColor, 0.3) }}>{tech}</span>
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
                <div className="mb-5">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="w-8 h-1 rounded" style={{ background: accentColor }}></span>
                        Education
                    </h2>
                    {education.map((edu, i) => (
                        <div key={i} className="flex justify-between items-start mb-2">
                            <div>
                                <h3 className="font-semibold text-gray-900">{edu.degree} in {edu.fieldOfStudy || edu.field}</h3>
                                <p className="text-sm" style={{ color: accentColor }}>{edu.institution}</p>
                            </div>
                            <span className="text-xs text-gray-500">{edu.graduationDate}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Skills */}
            {skills && (Object.keys(skills).some(k => skills[k]?.length > 0)) && (
                <div className="mb-5">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="w-8 h-1 rounded" style={{ background: accentColor }}></span>
                        Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.languages?.map((skill, i) => <span key={`l-${i}`} className="text-xs text-white px-3 py-1 rounded-full" style={{ background: accentColor }}>{skill}</span>)}
                        {skills.frameworks?.map((skill, i) => <span key={`f-${i}`} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: hexToRgba(accentColor, 0.2), color: accentColor }}>{skill}</span>)}
                        {skills.databases?.map((skill, i) => <span key={`d-${i}`} className="text-xs px-3 py-1 rounded-full bg-green-100 text-green-800">{skill}</span>)}
                        {skills.cloud?.map((skill, i) => <span key={`c-${i}`} className="text-xs px-3 py-1 rounded-full bg-orange-100 text-orange-800">{skill}</span>)}
                        {skills.tools?.map((skill, i) => <span key={`t-${i}`} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: hexToRgba(accentColor, 0.15), color: accentColor }}>{skill}</span>)}
                        {skills.methodologies?.map((skill, i) => <span key={`m-${i}`} className="text-xs px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">{skill}</span>)}
                        {skills.soft?.map((skill, i) => <span key={`s-${i}`} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: hexToRgba(accentColor, 0.1), color: accentColor }}>{skill}</span>)}
                        {skills.technical?.map((skill, i) => <span key={`tech-${i}`} className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-800">{skill}</span>)}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {certifications?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="w-8 h-1 rounded" style={{ background: accentColor }}></span>
                        Certifications
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {certifications.map((cert, i) => (
                            <span key={i} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: `linear-gradient(to right, ${hexToRgba(accentColor, 0.1)}, ${hexToRgba(accentColor, 0.05)})`, color: accentColor }}>
                                🏆 {cert.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Languages */}
            {spokenLanguages?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="w-8 h-1 rounded" style={{ background: accentColor }}></span>
                        Languages
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {spokenLanguages.map((lang, i) => (
                            <span key={i} className="text-xs px-3 py-1.5 rounded-lg" style={{ background: `linear-gradient(to right, ${hexToRgba(accentColor, 0.1)}, ${hexToRgba(accentColor, 0.05)})` }}>
                                <strong>{lang.language}</strong> - {lang.proficiency}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Awards */}
            {awards?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-lg font-bold mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                        <span className="w-8 h-1 rounded" style={{ background: accentColor }}></span>
                        Awards
                    </h2>
                    {awards.map((award, i) => (
                        <div key={i} className="text-sm text-gray-700 mb-1">
                            <span className="font-medium" style={{ color: accentColor }}>{award.title}</span>
                            <span className="text-gray-500"> – {award.issuer}, {award.date}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CreativeTemplate;
