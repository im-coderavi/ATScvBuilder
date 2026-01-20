import React from 'react';

const CompactTemplate = ({ resumeData, fontFamily = 'Arial', accentColor = '#52525b' }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, spokenLanguages, awards } = resumeData || {};

    return (
        <div
            className="bg-white"
            style={{
                fontFamily: `'${fontFamily}', 'Helvetica', sans-serif`,
                fontSize: '9pt',
                lineHeight: '1.35',
                color: '#18181b',
                padding: '8mm 12mm',
                width: '210mm',
                minHeight: '297mm',
            }}
        >
            {/* Compact Header - Single Line */}
            <div className="flex justify-between items-center pb-2 mb-3" style={{ borderBottom: `1px solid ${accentColor}` }}>
                <h1 className="text-xl font-bold" style={{ color: accentColor }}>
                    {personalInfo?.fullName || '[Your Name]'}
                </h1>
                <div className="text-[9px] text-gray-600 text-right">
                    <div>{personalInfo?.email} | {personalInfo?.phone}</div>
                    <div>{personalInfo?.location}{personalInfo?.linkedin && ` | LinkedIn`}</div>
                </div>
            </div>

            {/* Two Column Layout for Compactness */}
            <div className="grid grid-cols-3 gap-4">
                {/* Left Column - 2/3 */}
                <div className="col-span-2 space-y-3">
                    {/* Summary */}
                    {summary && (
                        <div>
                            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Summary</h2>
                            <p className="text-[9px] text-gray-600 leading-snug">{summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {experience?.length > 0 && (
                        <div>
                            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Experience</h2>
                            {experience.map((exp, i) => (
                                <div key={i} className="mb-2">
                                    <div className="flex justify-between items-baseline">
                                        <span className="font-bold text-[9px]" style={{ color: accentColor }}>{exp.title}</span>
                                        <span className="text-[8px] text-gray-500">{exp.startDate}–{exp.current ? 'Now' : exp.endDate}</span>
                                    </div>
                                    <p className="text-[8px] text-gray-600">{exp.company} | {exp.location}</p>
                                    <ul className="text-[8px] text-gray-600 ml-2 space-y-0">
                                        {exp.achievements?.slice(0, 3).map((ach, j) => (
                                            <li key={j} className="flex items-start">
                                                <span className="mr-1">•</span>
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
                        <div>
                            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Projects</h2>
                            {projects.slice(0, 3).map((proj, i) => (
                                <div key={i} className="mb-1">
                                    <span className="font-bold text-[9px]" style={{ color: accentColor }}>{proj.name}</span>
                                    <span className="text-[8px] text-gray-500 ml-1">({proj.technologies?.slice(0, 3).join(', ')})</span>
                                    <p className="text-[8px] text-gray-600">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Column - 1/3 */}
                <div className="space-y-3">
                    {/* Education */}
                    {education?.length > 0 && (
                        <div>
                            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Education</h2>
                            {education.map((edu, i) => (
                                <div key={i} className="mb-1">
                                    <p className="font-bold text-[9px]" style={{ color: accentColor }}>{edu.degree}</p>
                                    <p className="text-[8px] text-gray-600">{edu.fieldOfStudy || edu.field}</p>
                                    <p className="text-[8px] text-gray-500">{edu.institution}</p>
                                    <p className="text-[8px] text-gray-400">{edu.graduationDate}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Skills */}
                    {skills && (Object.keys(skills).some(k => skills[k]?.length > 0)) && (
                        <div>
                            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Skills</h2>
                            {skills.languages?.length > 0 && (
                                <div>
                                    <p className="text-[8px] text-gray-500 font-medium">Languages</p>
                                    <p className="text-[8px] text-gray-700">{skills.languages.join(', ')}</p>
                                </div>
                            )}
                            {skills.frameworks?.length > 0 && (
                                <div>
                                    <p className="text-[8px] text-gray-500 font-medium">Frameworks</p>
                                    <p className="text-[8px] text-gray-700">{skills.frameworks.join(', ')}</p>
                                </div>
                            )}
                            {skills.databases?.length > 0 && (
                                <div>
                                    <p className="text-[8px] text-gray-500 font-medium">Databases</p>
                                    <p className="text-[8px] text-gray-700">{skills.databases.join(', ')}</p>
                                </div>
                            )}
                            {skills.tools?.length > 0 && (
                                <div>
                                    <p className="text-[8px] text-gray-500 font-medium">Tools</p>
                                    <p className="text-[8px] text-gray-700">{skills.tools.join(', ')}</p>
                                </div>
                            )}
                            {skills.technical?.length > 0 && (
                                <div>
                                    <p className="text-[8px] text-gray-500 font-medium">Technical</p>
                                    <p className="text-[8px] text-gray-700">{skills.technical.join(', ')}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Certifications */}
                    {certifications?.length > 0 && (
                        <div>
                            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Certifications</h2>
                            {certifications.slice(0, 4).map((cert, i) => (
                                <p key={i} className="text-[8px] text-gray-600">{cert.name}</p>
                            ))}
                        </div>
                    )}

                    {/* Spoken Languages */}
                    {spokenLanguages?.length > 0 && (
                        <div>
                            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Languages</h2>
                            {spokenLanguages.map((lang, i) => (
                                <p key={i} className="text-[8px] text-gray-600">{lang.language} ({lang.proficiency})</p>
                            ))}
                        </div>
                    )}

                    {/* Awards */}
                    {awards?.length > 0 && (
                        <div>
                            <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Awards</h2>
                            {awards.slice(0, 3).map((award, i) => (
                                <p key={i} className="text-[8px] text-gray-600">{award.title}</p>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default CompactTemplate;
