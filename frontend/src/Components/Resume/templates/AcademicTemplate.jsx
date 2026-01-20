import React from 'react';

const AcademicTemplate = ({ resumeData, fontFamily = 'Libre Baskerville', accentColor = '#78716c' }) => {
    const { personalInfo, summary, experience, education, skills, projects, certifications, spokenLanguages, awards } = resumeData || {};

    return (
        <div
            className="bg-white"
            style={{
                fontFamily: `'${fontFamily}', 'Georgia', serif`,
                fontSize: '10.5pt',
                lineHeight: '1.5',
                color: '#1c1917',
                padding: '15mm 20mm',
                width: '210mm',
                minHeight: '297mm',
            }}
        >
            {/* Academic Header */}
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2" style={{ color: accentColor }}>
                    {personalInfo?.fullName || '[Your Name]'}
                </h1>
                <div className="text-sm text-stone-600 flex flex-wrap justify-center divide-x divide-stone-300">
                    {personalInfo?.email && <span className="px-2">{personalInfo.email}</span>}
                    {personalInfo?.phone && <span className="px-2">{personalInfo.phone}</span>}
                    {personalInfo?.location && <span className="px-2">{personalInfo.location}</span>}
                </div>
                <div className="text-sm text-stone-500 mt-1">
                    {personalInfo?.linkedin && <a href={personalInfo.linkedin} className="hover:underline mr-3" style={{ color: accentColor }}>LinkedIn</a>}
                    {personalInfo?.portfolio && <a href={personalInfo.portfolio} className="hover:underline" style={{ color: accentColor }}>Academic Website</a>}
                </div>
            </div>

            {/* Education First - Academic Priority */}
            {education?.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-3" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
                        Education
                    </h2>
                    {education.map((edu, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold" style={{ color: accentColor }}>{edu.degree} in {edu.fieldOfStudy || edu.field}</h3>
                                <span className="text-sm text-stone-600">{edu.graduationDate}</span>
                            </div>
                            <p className="text-sm text-stone-600 italic">{edu.institution}</p>
                            {edu.gpa && <p className="text-xs text-stone-500">GPA: {edu.gpa}</p>}
                        </div>
                    ))}
                </div>
            )}

            {/* Research/Summary */}
            {summary && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-3" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
                        Research Interests
                    </h2>
                    <p className="text-sm text-stone-700 leading-relaxed text-justify">{summary}</p>
                </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-3" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
                        Professional Experience
                    </h2>
                    {experience.map((exp, i) => (
                        <div key={i} className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold" style={{ color: accentColor }}>{exp.title}</h3>
                                <span className="text-xs text-stone-600">{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                            </div>
                            <p className="text-sm text-stone-600 italic">{exp.company}, {exp.location}</p>
                            <ul className="mt-1 ml-4 list-disc text-sm text-stone-700 space-y-0.5">
                                {exp.achievements?.map((ach, j) => <li key={j}>{ach}</li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects as Publications/Research */}
            {projects?.length > 0 && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-3" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
                        Research Projects
                    </h2>
                    {projects.map((proj, i) => (
                        <div key={i} className="mb-2">
                            <p className="text-sm text-stone-700">
                                <span className="font-semibold" style={{ color: accentColor }}>{proj.name}</span>
                                {proj.technologies?.length > 0 && <span className="text-stone-500"> ({proj.technologies.join(', ')})</span>}
                                {proj.description && <span> – {proj.description}</span>}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Technical Proficiency */}
            {skills && (Object.keys(skills).some(k => skills[k]?.length > 0)) && (
                <div className="mb-5">
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-3" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
                        Technical Proficiency
                    </h2>
                    <div className="text-sm text-stone-700 space-y-1">
                        {skills.languages?.length > 0 && <p><strong>Programming:</strong> {skills.languages.join(', ')}</p>}
                        {skills.frameworks?.length > 0 && <p><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</p>}
                        {skills.databases?.length > 0 && <p><strong>Databases:</strong> {skills.databases.join(', ')}</p>}
                        {skills.cloud?.length > 0 && <p><strong>Cloud/DevOps:</strong> {skills.cloud.join(', ')}</p>}
                        {skills.tools?.length > 0 && <p><strong>Tools:</strong> {skills.tools.join(', ')}</p>}
                        {skills.technical?.length > 0 && <p><strong>Technical:</strong> {skills.technical.join(', ')}</p>}
                    </div>
                </div>
            )}

            {/* Certifications/Honors */}
            {certifications?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-3" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
                        Honors & Certifications
                    </h2>
                    <ul className="text-sm text-stone-700 space-y-1">
                        {certifications.map((cert, i) => (
                            <li key={i}>{cert.name} – {cert.issuer}, {cert.date}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Spoken Languages */}
            {spokenLanguages?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-3" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
                        Languages
                    </h2>
                    <p className="text-sm text-stone-700">
                        {spokenLanguages.map((lang, i) => `${lang.language} (${lang.proficiency})`).join(' | ')}
                    </p>
                </div>
            )}

            {/* Awards */}
            {awards?.length > 0 && (
                <div className="mb-4">
                    <h2 className="text-sm font-bold uppercase tracking-wider pb-1 mb-3" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>
                        Awards & Honors
                    </h2>
                    <ul className="text-sm text-stone-700 space-y-1">
                        {awards.map((award, i) => (
                            <li key={i}>{award.title} – {award.issuer}, {award.date}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AcademicTemplate;
