import React from 'react';
import { ResumeData } from '@/shared/types';
import { TFunction } from 'i18next';

interface ThemeRenderProps {
    data: ResumeData;
    addBlock: (node: React.ReactNode, key: string) => void;
    t: TFunction;
}

// Classic Theme - Centered header, underline sections
export const renderClassicTheme = ({ data, addBlock, t }: ThemeRenderProps) => {
    addBlock(
        <header className="border-b-2 border-slate-800 pb-4 mb-6">
            <div className={`flex ${data.profileImage ? 'items-start gap-5' : 'flex-col items-center text-center'}`}>
                {data.profileImage && (
                    <div className="shrink-0">
                        <img src={data.profileImage} alt={data.fullName} className="w-24 h-24 rounded-full object-cover border-2 border-slate-300 shadow-sm" />
                    </div>
                )}
                <div className={data.profileImage ? 'flex-1' : ''}>
                    <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-wide mb-2">{data.fullName}</h1>
                    {data.title && <p className="text-lg text-slate-700 font-medium mb-2">{data.title}</p>}
                    <div className={`text-sm text-slate-700 flex flex-wrap ${data.profileImage ? 'justify-start' : 'justify-center'} gap-x-3 gap-y-1 font-medium`}>
                        {data.location && <span>{data.location}</span>}
                        {data.phone && <span>• {data.phone}</span>}
                        {data.email && <span>• {data.email}</span>}
                        {data.linkedin && <span>• <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.linkedin.replace(/^https?:\/\//, '')}</a></span>}
                        {data.website && <span>• <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.website.replace(/^https?:\/\//, '')}</a></span>}
                    </div>
                </div>
            </div>
        </header>,
        'main-header'
    );
    renderSections(data, addBlock, 'classic', t);
};

// Executive Theme - Professional with centered gray headers
export const renderExecutiveTheme = ({ data, addBlock, t }: ThemeRenderProps) => {
    addBlock(
        <header className="text-center mb-6">
            {data.profileImage && (
                <div className="flex justify-center mb-3">
                    <img src={data.profileImage} alt={data.fullName} className="w-24 h-24 rounded-full object-cover border-2 border-slate-300 shadow-sm" />
                </div>
            )}
            <h1 className="text-2xl font-bold text-slate-900 uppercase tracking-widest mb-1">{data.fullName}</h1>
            {data.title && <p className="text-sm text-slate-600 mb-2">{data.title}</p>}
            <p className="text-xs text-slate-500 mb-1">{data.location}</p>
            <div className="flex justify-center gap-6 text-xs text-slate-600">
                {data.phone && <span>{data.phone}</span>}
                {data.email && <span>{data.email}</span>}
                {data.linkedin && <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.linkedin.replace(/^https?:\/\//, '')}</a>}
                {data.website && <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.website.replace(/^https?:\/\//, '')}</a>}
            </div>
        </header>,
        'main-header'
    );
    renderSections(data, addBlock, 'executive', t);
};

// Modern Theme - Left dates, clean layout
export const renderModernTheme = ({ data, addBlock, t }: ThemeRenderProps) => {
    addBlock(
        <header className="border-b border-slate-300 pb-4 mb-6">
            <div className={`flex ${data.profileImage ? 'items-start gap-4' : 'flex-col items-center text-center'}`}>
                {data.profileImage && (
                    <div className="shrink-0">
                        <img src={data.profileImage} alt={data.fullName} className="w-20 h-20 rounded-lg object-cover border border-slate-200" />
                    </div>
                )}
                <div className={data.profileImage ? 'flex-1' : ''}>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1">
                        {data.fullName}{data.title && <span className="font-normal text-slate-600">, {data.title}</span>}
                    </h1>
                    <div className="text-sm text-slate-600 flex flex-wrap gap-x-1">
                        {[
                            data.location,
                            data.phone,
                            data.email && <a key="email" href={`mailto:${data.email}`} className="hover:underline">{data.email}</a>,
                            data.linkedin && <a key="in" href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.linkedin.replace(/^https?:\/\//, '')}</a>,
                            data.website && <a key="web" href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{data.website.replace(/^https?:\/\//, '')}</a>
                        ].filter(Boolean).map((item, i, arr) => (
                            <span key={i}>{item}{i < arr.length - 1 ? ', ' : ''}</span>
                        ))}
                    </div>
                </div>
            </div>
        </header>,
        'main-header'
    );
    renderSections(data, addBlock, 'modern', t);
};

// Sidebar Theme - Two column inspired, amber accent
export const renderSidebarTheme = ({ data, addBlock, t }: ThemeRenderProps) => {
    addBlock(
        <header className="flex items-start gap-6 mb-6 pb-4 border-b border-amber-200">
            {data.profileImage && (
                <div className="shrink-0">
                    <img src={data.profileImage} alt={data.fullName} className="w-28 h-28 rounded-full object-cover border-4 border-amber-100" />
                </div>
            )}
            <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 mb-1">{data.fullName}</h1>
                {data.title && <p className="text-lg text-amber-600 font-medium mb-3">{data.title}</p>}
                <div className="text-sm text-slate-600 space-y-1">
                    {data.location && <p>{data.location}</p>}
                    {data.phone && <p>{data.phone}</p>}
                    {data.email && <p>{data.email}</p>}
                    {data.linkedin && <p><a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.linkedin.replace(/^https?:\/\//, '')}</a></p>}
                    {data.website && <p><a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.website.replace(/^https?:\/\//, '')}</a></p>}
                </div>
            </div>
        </header>,
        'main-header'
    );
    renderSections(data, addBlock, 'sidebar', t);
};

// Section Header
const SectionHeader: React.FC<{ title: string; theme: string }> = ({ title, theme }) => {
    switch (theme) {
        case 'executive':
            return (
                <div className="relative mb-3">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-300"></div></div>
                    <div className="relative flex justify-center"><span className="bg-white px-4 text-sm font-bold uppercase tracking-widest text-slate-700">{title}</span></div>
                </div>
            );
        case 'modern':
            return <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-500 border-b border-slate-200 mb-3 pb-1">{title}</h2>;
        case 'sidebar':
            return <h2 className="text-base font-bold text-amber-600 mb-3 pb-1 border-b border-amber-100">{title}</h2>;
        default:
            return <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1 text-slate-800">{title}</h2>;
    }
};

// Shared section rendering
const renderSections = (data: ResumeData, addBlock: (node: React.ReactNode, key: string) => void, theme: string, t: TFunction) => {
    data.sectionOrder.forEach(key => {
        // SUMMARY
        if (key === 'summary' && data.summary) {
            addBlock(<SectionHeader title={theme === 'executive' ? t('cv.profile') : t('cv.summary')} theme={theme} />, 'summary-header');
            const summaryClass = theme === 'executive' ? 'text-sm leading-relaxed text-slate-700 text-center italic mb-4' :
                theme === 'sidebar' ? 'text-sm leading-relaxed text-slate-700 mb-4' :
                    'text-sm leading-relaxed text-slate-800 text-justify mb-4';
            addBlock(<p className={summaryClass}>{data.summary}</p>, 'summary-body');
        }

        // EXPERIENCE
        else if (key === 'experience' && data.experience.length > 0) {
            addBlock(<SectionHeader title={theme === 'executive' ? t('cv.employmentHistory') : t('cv.experience')} theme={theme} />, 'exp-header');

            data.experience.forEach((exp) => {
                if (theme === 'modern') {
                    addBlock(
                        <div className="mb-4 grid grid-cols-[100px_1fr] gap-3">
                            <div className="text-xs text-slate-500 pt-0.5">{exp.startDate} — {exp.current ? t('cv.present') : exp.endDate}</div>
                            <div>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-900 text-sm">{exp.title}, {exp.company}</h3>
                                    <span className="text-xs text-slate-500">{exp.location}</span>
                                </div>
                                <ul className="list-disc ml-4 space-y-0.5">
                                    {(exp.description || []).map((desc, idx) => <li key={idx} className="text-xs text-slate-700 leading-snug">{desc}</li>)}
                                </ul>
                            </div>
                        </div>,
                        `exp-${exp.id}`
                    );
                } else if (theme === 'executive') {
                    addBlock(
                        <div className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-600 text-xs">◆</span>
                                    <h3 className="font-bold text-slate-900 text-sm">{exp.title}, {exp.company}</h3>
                                </div>
                                <span className="text-xs text-slate-600">{exp.startDate} — {exp.current ? t('cv.present') : exp.endDate}</span>
                            </div>
                            <div className="text-xs text-slate-500 mb-1 ml-4">{exp.location}</div>
                            <ul className="list-none ml-4 space-y-0.5">
                                {(exp.description || []).map((desc, idx) => <li key={idx} className="text-xs text-slate-700 leading-snug">• {desc}</li>)}
                            </ul>
                        </div>,
                        `exp-${exp.id}`
                    );
                } else if (theme === 'sidebar') {
                    addBlock(
                        <div className="mb-4">
                            <h3 className="font-bold text-slate-900 text-sm">{exp.title}, {exp.company}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                                <span>{exp.startDate} — {exp.current ? t('cv.present') : exp.endDate}</span>
                                <span>•</span>
                                <span>{exp.location}</span>
                            </div>
                            <ul className="list-disc ml-4 space-y-0.5">
                                {(exp.description || []).map((desc, idx) => <li key={idx} className="text-xs text-slate-700 leading-snug">{desc}</li>)}
                            </ul>
                        </div>,
                        `exp-${exp.id}`
                    );
                } else {
                    addBlock(
                        <div className="mb-4">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="font-bold text-slate-900 text-sm">{exp.title}</h3>
                                <span className="text-xs font-medium text-slate-700">{exp.startDate} – {exp.current ? t('cv.present') : exp.endDate}</span>
                            </div>
                            <div className="flex justify-between items-baseline mb-1">
                                <span className="text-sm text-slate-800">{exp.company}</span>
                                <span className="text-xs text-slate-600">{exp.location}</span>
                            </div>
                            <ul className="list-disc ml-4 space-y-0.5">
                                {(exp.description || []).map((desc, idx) => <li key={idx} className="text-xs text-slate-800 leading-snug">{desc}</li>)}
                            </ul>
                        </div>,
                        `exp-${exp.id}`
                    );
                }
            });
        }

        // EDUCATION
        else if (key === 'education' && data.education.length > 0) {
            addBlock(<SectionHeader title={t('cv.education')} theme={theme} />, 'edu-header');

            data.education.forEach((edu) => {
                if (theme === 'modern') {
                    addBlock(
                        <div className="mb-3 grid grid-cols-[100px_1fr] gap-3">
                            <div className="text-xs text-slate-500 pt-0.5">{edu.startDate} — {edu.endDate}</div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{edu.degree}, {edu.institution}</h3>
                                <span className="text-xs text-slate-500">{edu.location}</span>
                            </div>
                        </div>,
                        `edu-${edu.id}`
                    );
                } else if (theme === 'executive') {
                    addBlock(
                        <div className="mb-3 flex justify-between items-start">
                            <div className="flex items-start gap-2">
                                <span className="text-amber-600 text-xs mt-1">◆</span>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-sm">{edu.institution}</h3>
                                    <span className="text-xs text-slate-600 italic">{edu.degree}</span>
                                </div>
                            </div>
                            <div className="text-right text-xs">
                                <div className="text-slate-600">{edu.startDate} — {edu.endDate}</div>
                                <div className="text-slate-500">{edu.location}</div>
                            </div>
                        </div>,
                        `edu-${edu.id}`
                    );
                } else if (theme === 'sidebar') {
                    addBlock(
                        <div className="mb-3">
                            <h3 className="font-bold text-slate-900 text-sm">{edu.degree}, {edu.institution}</h3>
                            <div className="text-xs text-slate-500">{edu.startDate} — {edu.endDate} • {edu.location}</div>
                        </div>,
                        `edu-${edu.id}`
                    );
                } else {
                    addBlock(
                        <div className="mb-3">
                            <div className="flex justify-between items-baseline">
                                <h3 className="font-bold text-slate-900 text-sm">{edu.institution}</h3>
                                <span className="text-xs text-slate-700">{edu.startDate} – {edu.endDate}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-xs text-slate-800">{edu.degree}</span>
                                <span className="text-xs text-slate-600">{edu.location}</span>
                            </div>
                        </div>,
                        `edu-${edu.id}`
                    );
                }
            });
        }

        // SKILLS
        else if (key === 'skills' && data.skills.length > 0) {
            addBlock(<SectionHeader title={theme === 'executive' ? t('cv.skills') : t('cv.technicalProficiencies')} theme={theme} />, 'skills-header');

            if (theme === 'modern' || theme === 'executive') {
                addBlock(
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 mb-4">
                        {data.skills.flatMap(group =>
                            group.items.map(item => {
                                if (typeof item === 'string') {
                                    return { name: item, level: 3, showLevel: group.showLevel ?? false };
                                }
                                return { ...item, showLevel: group.showLevel ?? false };
                            })
                        ).map((skill, idx) => {
                            const level = skill.level ?? 3;
                            const showLevel = skill.showLevel;

                            let levelText = '';
                            if (showLevel) {
                                if (level === 5) levelText = t('cv.expert', 'Expert');
                                else if (level === 4) levelText = t('cv.advanced', 'Advanced');
                                else if (level === 3) levelText = t('cv.intermediate', 'Intermediate');
                                else if (level === 2) levelText = t('cv.elementary', 'Elementary');
                                else levelText = t('cv.beginner', 'Beginner');
                            }

                            return (
                                <div key={idx} className="flex justify-between text-xs border-b border-dotted border-slate-200 pb-0.5">
                                    <span className="text-slate-800">{skill.name}</span>
                                    {showLevel && <span className="text-slate-500 text-[10px]">{levelText}</span>}
                                </div>
                            );
                        })}
                    </div>,
                    'skills-body'
                );
            } else if (theme === 'sidebar') {
                addBlock(
                    <div className="space-y-4 mb-4">
                        {data.skills.map((skillGroup, idx) => (
                            <div key={idx}>
                                <div className="text-xs font-bold text-amber-600 mb-1.5 uppercase tracking-wide">{skillGroup.name}</div>
                                <div className="space-y-1.5 border-l-2 border-amber-100 pl-3">
                                    {(skillGroup.items || []).map((skill, i) => {
                                        const name = typeof skill === 'string' ? skill : skill.name;
                                        const level = typeof skill === 'string' ? 3 : (skill.level ?? 3);

                                        return (
                                            <div key={i} className="flex flex-col">
                                                <span className="text-xs text-slate-700 font-medium">{name}</span>
                                                {skillGroup.showLevel && (
                                                    <svg width="88" height="4" style={{ display: 'block', marginTop: '2px' }}>
                                                        {[0, 1, 2, 3, 4].map(i => (
                                                            <rect
                                                                key={i}
                                                                x={i * 18}
                                                                y="0"
                                                                width="16"
                                                                height="4"
                                                                rx="2"
                                                                fill={i < level ? '#fbbf24' : '#e2e8f0'}
                                                            />
                                                        ))}
                                                    </svg>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>,
                    'skills-body'
                );
            } else {
                addBlock(
                    <div className="space-y-2 mb-4">
                        {data.skills.map((skillGroup, idx) => (
                            <div key={idx} className="text-xs">
                                <span className="font-bold text-slate-900 block mb-1">{skillGroup.name}:</span>
                                <div className="flex flex-wrap gap-x-4 gap-y-1">
                                    {(skillGroup.items || []).map((skill, i) => {
                                        const name = typeof skill === 'string' ? skill : skill.name;
                                        const level = typeof skill === 'string' ? 3 : (skill.level ?? 3);

                                        return (
                                            <span key={i} className="text-slate-800 inline-flex items-center gap-1.5">
                                                <span>{name}</span>
                                                {skillGroup.showLevel && (
                                                    <span className="flex items-center gap-0.5">
                                                        {[1, 2, 3, 4, 5].map(l => (
                                                            <span
                                                                key={l}
                                                                style={{
                                                                    fontSize: '10px',
                                                                    lineHeight: 1,
                                                                    color: l <= level ? '#94a3b8' : '#e2e8f0',
                                                                    WebkitPrintColorAdjust: 'exact',
                                                                    printColorAdjust: 'exact'
                                                                } as React.CSSProperties}
                                                            >★</span>
                                                        ))}
                                                    </span>
                                                )}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>,
                    'skills-body'
                );
            }
        }

        // PROJECTS
        else if (key === 'projects' && data.projects.length > 0) {
            addBlock(<SectionHeader title={t('cv.projects')} theme={theme} />, 'proj-header');

            data.projects.forEach((proj) => {
                if (theme === 'modern') {
                    addBlock(
                        <div className="mb-3 grid grid-cols-[100px_1fr] gap-3">
                            <div className="text-xs text-slate-500 pt-0.5">{proj.startDate || ''}</div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
                                {proj.url && <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline break-all relative z-10 inline-block mt-0.5">{proj.url}</a>}
                                <ul className="list-disc ml-4 space-y-0.5 mt-1">
                                    {(proj.description || []).map((desc, idx) => <li key={idx} className="text-xs text-slate-700 leading-snug">{desc}</li>)}
                                </ul>
                            </div>
                        </div>,
                        `proj-${proj.id}`
                    );
                } else if (theme === 'executive') {
                    addBlock(
                        <div className="mb-3">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-amber-600 text-xs">◆</span>
                                <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
                            </div>
                            {proj.url && <div className="ml-4 mb-1"><a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-amber-600 hover:underline break-all relative z-10 inline-block">{proj.url}</a></div>}
                            <ul className="list-none ml-4 space-y-0.5">
                                {(proj.description || []).map((desc, idx) => <li key={idx} className="text-xs text-slate-700">• {desc}</li>)}
                            </ul>
                        </div>,
                        `proj-${proj.id}`
                    );
                } else {
                    addBlock(
                        <div className="mb-3">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-slate-900 text-sm">{proj.name}</h3>
                                {proj.url && <a href={proj.url.startsWith('http') ? proj.url : `https://${proj.url}`} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-600 hover:underline break-all relative z-10 inline-block">{proj.url}</a>}
                            </div>
                            <ul className="list-disc ml-4 space-y-0.5">
                                {(proj.description || []).map((desc, idx) => <li key={idx} className="text-xs text-slate-800 leading-snug">{desc}</li>)}
                            </ul>
                        </div>,
                        `proj-${proj.id}`
                    );
                }
            });
        }

        // CERTIFICATIONS
        else if (key === 'certifications' && data.certifications.length > 0) {
            addBlock(<SectionHeader title={t('cv.certifications')} theme={theme} />, 'cert-header');

            if (theme === 'executive') {
                data.certifications.forEach((cert, index) => {
                    const isLast = index === data.certifications.length - 1;
                    addBlock(
                        <div className={`flex items-start gap-2 ${isLast ? 'mb-4' : 'mb-2'}`}>
                            <span className="text-amber-600 text-xs mt-0.5">◆</span>
                            <div className="flex-1 flex justify-between items-baseline text-xs">
                                <div><span className="font-bold text-slate-900">{cert.name}</span> - {cert.issuer}</div>
                                <span className="text-slate-600">{cert.date}</span>
                            </div>
                        </div>,
                        `cert-${cert.id}`
                    );
                });
            } else {
                data.certifications.forEach((cert, index) => {
                    const isLast = index === data.certifications.length - 1;
                    addBlock(
                        <div className={`flex justify-between items-baseline text-xs ${isLast ? 'mb-4' : 'mb-1'}`}>
                            <div><span className="font-bold text-slate-900">{cert.name}</span><span className="text-slate-600"> - {cert.issuer}</span></div>
                            <span className="text-slate-700">{cert.date}</span>
                        </div>,
                        `cert-${cert.id}`
                    );
                });
            }
        }

        // LANGUAGES
        else if (key === 'languages' && data.languages.length > 0) {
            addBlock(<SectionHeader title={t('cv.languages')} theme={theme} />, 'lang-header');

            if (theme === 'sidebar') {
                data.languages.forEach((lang, index) => {
                    const isLast = index === data.languages.length - 1;
                    addBlock(
                        <div className={`flex justify-between text-xs ${isLast ? 'mb-4' : 'mb-1'}`}>
                            <span className="font-bold text-slate-900">{lang.language}</span>
                            <span className="text-amber-600">{lang.proficiency}</span>
                        </div>,
                        `lang-${lang.id}`
                    );
                });
            } else {
                addBlock(
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-4">
                        {data.languages.map((lang) => (
                            <div key={lang.id}><span className="font-bold text-slate-900">{lang.language}</span>: <span className="text-slate-700">{lang.proficiency}</span></div>
                        ))}
                    </div>,
                    'lang-body'
                );
            }
        }

        // VOLUNTEERING
        else if (key === 'volunteering' && data.volunteering.length > 0) {
            addBlock(<SectionHeader title={t('cv.volunteering')} theme={theme} />, 'vol-header');

            data.volunteering.forEach(vol => {
                if (theme === 'executive') {
                    addBlock(
                        <div className="mb-3">
                            <div className="flex justify-between items-baseline mb-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-amber-600 text-xs">◆</span>
                                    <h3 className="font-bold text-slate-900 text-sm">{vol.role}, {vol.organization}</h3>
                                </div>
                                <span className="text-xs text-slate-600">{vol.startDate} — {vol.endDate}</span>
                            </div>
                            <ul className="list-none ml-4 space-y-0.5">
                                {(Array.isArray(vol.description) ? vol.description : vol.description ? [vol.description] : []).map((desc, idx) => <li key={idx} className="text-xs text-slate-700">• {desc}</li>)}
                            </ul>
                        </div>,
                        `vol-${vol.id}`
                    );
                } else {
                    addBlock(
                        <div className="mb-3">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h3 className="font-bold text-slate-900 text-sm">{vol.organization}</h3>
                                <span className="text-xs text-slate-700">{vol.startDate} – {vol.endDate}</span>
                            </div>
                            <div className="text-xs text-slate-800 mb-1">{vol.role}</div>
                            <ul className="list-disc ml-4 space-y-0.5">
                                {(Array.isArray(vol.description) ? vol.description : vol.description ? [vol.description] : []).map((desc, idx) => <li key={idx} className="text-xs text-slate-800 leading-snug">{desc}</li>)}
                            </ul>
                        </div>,
                        `vol-${vol.id}`
                    );
                }
            });
        }

        // AWARDS
        else if (key === 'awards' && data.awards.length > 0) {
            addBlock(<SectionHeader title={theme === 'executive' ? t('cv.awards') : t('cv.awards')} theme={theme} />, 'awards-header');

            if (theme === 'executive') {
                data.awards.forEach((award, index) => {
                    const isLast = index === data.awards.length - 1;
                    addBlock(
                        <div className={`flex items-start gap-2 ${isLast ? 'mb-4' : 'mb-2'}`}>
                            <span className="text-amber-600 text-xs mt-0.5">◆</span>
                            <div className="flex-1 flex justify-between items-baseline text-xs">
                                <div><span className="font-bold text-slate-900">{award.title}</span> - {award.issuer}</div>
                                <span className="text-slate-600">{award.date}</span>
                            </div>
                        </div>,
                        `award-${award.id}`
                    );
                });
            } else {
                data.awards.forEach((award, index) => {
                    const isLast = index === data.awards.length - 1;
                    addBlock(
                        <div className={`flex justify-between items-baseline text-xs ${isLast ? 'mb-4' : 'mb-1'}`}>
                            <div><span className="font-bold text-slate-900">{award.title}</span><span className="text-slate-600"> - {award.issuer}</span></div>
                            <span className="text-slate-700">{award.date}</span>
                        </div>,
                        `award-${award.id}`
                    );
                });
            }
        }

        // INTERESTS
        else if (key === 'interests' && data.interests && data.interests.trim().length > 0) {
            addBlock(<SectionHeader title={t('cv.interests')} theme={theme} />, 'int-header');
            addBlock(
                <ul className="list-disc ml-4 space-y-0.5 mb-4">
                    {data.interests.split(',').map((interest, idx) => <li key={idx} className="text-xs text-slate-800 leading-snug">{interest.trim()}</li>)}
                </ul>,
                'int-body'
            );
        }

        // REFERENCES
        else if (key === 'references' && data.references) {
            addBlock(<SectionHeader title={t('cv.references')} theme={theme} />, 'ref-header');
            addBlock(<p className="text-xs text-slate-800 mb-4">{data.references}</p>, 'ref-body');
        }

        // CUSTOM SECTIONS
        else if (key.startsWith('custom-')) {
            const section = data.customSections.find(s => s.id === key);
            if (section) {
                addBlock(<SectionHeader title={section.title} theme={theme} />, `custom-${key}-header`);
                section.items.forEach(item => {
                    if (theme === 'executive') {
                        addBlock(
                            <div className="mb-3">
                                <div className="flex items-start gap-2 mb-1">
                                    <span className="text-amber-600 text-xs mt-0.5">◆</span>
                                    <div className="flex-1 flex justify-between items-baseline">
                                        <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                                        {item.date && <span className="text-xs text-slate-600">{item.date}</span>}
                                    </div>
                                </div>
                                {item.subtitle && <div className="text-xs text-slate-600 italic ml-4 mb-1">{item.subtitle}</div>}
                                {item.description && item.description.length > 0 && (
                                    <ul className="list-none ml-4 space-y-0.5">
                                        {item.description.map((d, i) => <li key={i} className="text-xs text-slate-700">• {d}</li>)}
                                    </ul>
                                )}
                            </div>,
                            `custom-item-${item.id}`
                        );
                    } else {
                        addBlock(
                            <div className="mb-3">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="font-bold text-slate-900 text-sm">{item.title}</h3>
                                    {item.date && <span className="text-xs text-slate-700">{item.date}</span>}
                                </div>
                                {item.subtitle && <div className="text-xs text-slate-800 mb-1">{item.subtitle}</div>}
                                {item.description && item.description.length > 0 && (
                                    <ul className="list-disc ml-4 space-y-0.5">
                                        {item.description.map((d, i) => <li key={i} className="text-xs text-slate-800 leading-snug">{d}</li>)}
                                    </ul>
                                )}
                            </div>,
                            `custom-item-${item.id}`
                        );
                    }
                });
            }
        }
    });
};
