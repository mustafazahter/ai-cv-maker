import React from 'react';
import { ResumeData } from '@/shared/types';
import { TFunction } from 'i18next';
import { MapPin, Phone, Mail } from 'lucide-react';

interface ThemeRenderProps {
    data: ResumeData;
    addBlock: (node: React.ReactNode, key: string) => void;
    t: TFunction;
}

// =================================================================================================
// 1. PROFESSIONAL THEME (Herman Walton)
// Blue accents, line separators, clean 2-column header
// =================================================================================================
export const renderProfessionalTheme = ({ data, addBlock, t }: ThemeRenderProps) => {
    // Header
    addBlock(
        <header className="mb-6 flex justify-between items-start border-b-2 border-blue-700 pb-6">
            <div className="flex-1">
                <h1 className="text-4xl font-bold text-blue-700 uppercase tracking-tight mb-2">{data.fullName}</h1>
                <p className="text-xl font-bold text-slate-800 mb-3 uppercase tracking-wide">{data.title}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-medium text-slate-600">
                    {[
                        data.location,
                        data.phone,
                        data.email && <a key="email" href={`mailto:${data.email}`} className="hover:underline relative z-10">{data.email}</a>,
                        data.linkedin && <a key="in" href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.linkedin.replace(/^https?:\/\//, '')}</a>,
                        data.github && <a key="gh" href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.github.replace(/^https?:\/\//, '')}</a>,
                        data.website && <a key="web" href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.website.replace(/^https?:\/\//, '')}</a>
                    ].filter(Boolean).map((item, i, arr) => (
                        <span key={i} className="flex items-center gap-1">
                            {item}
                            {i < arr.length - 1 && <span className="text-slate-300">|</span>}
                        </span>
                    ))}
                </div>
            </div>
            {data.profileImage && (
                <div className="shrink-0 ml-6">
                    <img src={data.profileImage} alt={data.fullName} className="w-28 h-28 object-cover shadow-sm grayscale-[20%]" />
                </div>
            )}
        </header>,
        'pro-header'
    );

    renderNewSections(data, addBlock, 'professional', t);
};

// =================================================================================================
// 2. ELEGANT THEME (Howard Jones)
// Serif fonts, centered, gray background headers, dotted leaders, diamond bullets
// =================================================================================================
export const renderElegantTheme = ({ data, addBlock, t }: ThemeRenderProps) => {
    // Header
    addBlock(
        <header className="mb-8">
            {data.profileImage && (
                <div className="flex justify-center mb-4">
                    <img src={data.profileImage} alt={data.fullName} className="w-24 h-24 object-cover border-2 border-slate-200 shadow-sm" />
                </div>
            )}
            <div className="text-center">
                <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-widest mb-2">{data.fullName}</h1>
                {data.title && <p className="font-serif text-slate-800 font-bold text-sm mb-1">{data.title}</p>}
                {data.location && <p className="font-serif text-slate-600 text-sm mb-4">{data.location}</p>}
            </div>

            {/* Phone and Email Line with solid border above and below or just below?
                 Image shows: Address line. Then (Phone ... Email) line. Then a DOUBLE LINE.
             */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 pt-2 pb-1 border-b-[3px] border-slate-400 border-double">
                {data.phone && <div className="font-serif text-slate-900 font-bold text-sm">{data.phone}</div>}
                {data.email && <div className="font-serif text-slate-900 font-bold text-sm">{data.email}</div>}
                {data.linkedin && <div className="font-serif text-slate-900 font-bold text-sm"><a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.linkedin.replace(/^https?:\/\//, '')}</a></div>}
                {data.github && <div className="font-serif text-slate-900 font-bold text-sm"><a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.github.replace(/^https?:\/\//, '')}</a></div>}
                {data.website && <div className="font-serif text-slate-900 font-bold text-sm"><a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.website.replace(/^https?:\/\//, '')}</a></div>}
            </div>
        </header>,
        'elegant-header'
    );

    renderNewSections(data, addBlock, 'elegant', t);
};


// =================================================================================================
// 3. CREATIVE THEME (Tony Sanders)
// Modern, clean, distinct left-aligned labels for sections if possible, or just very airy.
// We will use a clean sans-serif look with Indigo accents and a distinctive layout.
// =================================================================================================
export const renderCreativeTheme = ({ data, addBlock, t }: ThemeRenderProps) => {
    // Header
    addBlock(
        <header className="mb-10 flex items-center gap-8">
            {data.profileImage && (
                <div className="shrink-0">
                    <img src={data.profileImage} alt={data.fullName} className="w-32 h-32 rounded-full object-cover border-[6px] border-indigo-50 shadow-inner" />
                </div>
            )}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-1 tracking-tight">{data.fullName}</h1>
                <p className="text-xl font-medium text-indigo-600 mb-4">{data.title}</p>
                <div className="flex flex-col gap-1 text-sm text-slate-500">
                    {data.location && <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {data.location}</div>}
                    {data.email && <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> <a href={`mailto:${data.email}`} className="hover:underline relative z-10">{data.email}</a></div>}
                    {data.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {data.phone}</div>}
                    {data.linkedin && <div className="flex items-center gap-2"><span>in</span> <a href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.linkedin.replace(/^https?:\/\//, '')}</a></div>}
                    {data.github && <div className="flex items-center gap-2"><span>gh</span> <a href={data.github.startsWith('http') ? data.github : `https://${data.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.github.replace(/^https?:\/\//, '')}</a></div>}
                    {data.website && <div className="flex items-center gap-2"><span>🌐</span> <a href={data.website.startsWith('http') ? data.website : `https://${data.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline relative z-10">{data.website.replace(/^https?:\/\//, '')}</a></div>}
                </div>
            </div>
        </header>,
        'creative-header'
    );

    renderNewSections(data, addBlock, 'creative', t);
};


// =================================================================================================
// SHARED SECTION RENDERER FOR NEW THEMES
// =================================================================================================

const SectionHeader: React.FC<{ title: string; theme: string }> = ({ title, theme }) => {
    if (theme === 'professional') {
        return (
            <div className="mb-4">
                <h2 className="text-sm font-bold uppercase tracking-widest text-blue-700 mb-1">{title}</h2>
                <div className="w-full h-0.5 bg-blue-700"></div>
            </div>
        );
    }

    // ELEGANT: Full width gray bar, centered text, serif
    if (theme === 'elegant') {
        return (
            <div className="mb-6 mt-6 bg-slate-100 py-1.5 w-full border-y border-slate-200">
                <h2 className="text-center text-sm font-serif font-bold uppercase tracking-[0.1em] text-slate-900">
                    {title}
                </h2>
            </div>
        );
    }

    // Creative
    return (
        <div className="mb-6 flex items-center gap-4">
            <div className={`w-2 h-2 rounded-full ring-4 ring-indigo-50 bg-indigo-500`}></div>
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        </div>
    );
};

const renderNewSections = (data: ResumeData, addBlock: (node: React.ReactNode, key: string) => void, theme: string, t: TFunction) => {
    data.sectionOrder.forEach(key => {
        // SUMMARY
        if (key === 'summary' && data.summary) {
            addBlock(<SectionHeader title={theme === 'elegant' ? 'PROFILE' : t('cv.summary')} theme={theme} />, 'summary-header');

            let className = "text-sm text-slate-700 leading-relaxed mb-6 ";
            if (theme === 'elegant') className = "text-sm text-slate-800 font-serif leading-relaxed text-center px-6 mb-6";
            if (theme === 'professional') className = "text-sm font-medium text-slate-700 leading-relaxed mb-6 text-justify";

            addBlock(<p className={className}>{data.summary}</p>, 'summary-body');
        }

        // EXPERIENCE
        else if (key === 'experience' && data.experience.length > 0) {
            addBlock(<SectionHeader title={theme === 'elegant' ? 'EMPLOYMENT HISTORY' : t('cv.experience')} theme={theme} />, 'exp-header');

            data.experience.forEach(exp => {
                if (theme === 'professional') {
                    addBlock(
                        <div className="mb-4">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-bold text-slate-900 text-sm">{exp.title}, <span className="text-slate-700 font-semibold">{exp.company}</span></h3>
                                <div className="text-right">
                                    <span className="font-bold text-slate-900 text-xs block">{exp.startDate} — {exp.current ? t('cv.present') : exp.endDate}</span>
                                    {exp.location && <span className="text-xs text-slate-500">{exp.location}</span>}
                                </div>
                            </div>
                            <ul className="list-disc ml-5 space-y-1">
                                {(exp.description || []).map((desc, i) => (
                                    <li key={i} className="text-xs text-slate-600 leading-snug">{desc}</li>
                                ))}
                            </ul>
                        </div>,
                        `exp-${exp.id}`
                    );
                } else if (theme === 'elegant') {
                    // Howard Jones Style: "Lawyer, Madison..." .................... "Dec 2010 - Aug 2018"
                    addBlock(
                        <div className="mb-6">
                            <div className="flex items-end mb-0.5">
                                <div className="shrink-0 mr-2 text-slate-900 text-[10px] pb-1 transform rotate-45">❖</div>
                                <h3 className="font-serif font-bold text-slate-900 text-sm whitespace-nowrap mr-1">{exp.title}, {exp.company}</h3>

                                {/* Dotted Leader */}
                                <div className="flex-1 border-b border-dotted border-slate-400 mx-2 relative top-[-5px]"></div>

                                <span className="font-serif text-slate-900 text-xs whitespace-nowrap">{exp.startDate} — {exp.current ? t('cv.present') : exp.endDate}</span>
                            </div>

                            {/* Location Right aligned */}
                            <div className="flex justify-end mb-2">
                                <span className="font-serif text-slate-600 text-[10px]">{exp.location}</span>
                            </div>

                            <ul className="list-none ml-4 space-y-1">
                                {(exp.description || []).map((desc, i) => (
                                    <li key={i} className="text-xs font-serif text-slate-700 leading-relaxed flex items-start gap-2">
                                        <span className="mt-1.5 w-1 h-1 bg-slate-800 rounded-full shrink-0"></span>
                                        <span>{desc}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>,
                        `exp-${exp.id}`
                    );
                } else { // Creative
                    addBlock(
                        <div className="mb-6 pl-6 border-l-2 border-indigo-100 relative">
                            <div className="absolute -left-[5px] top-0 w-2 h-2 bg-indigo-200 rounded-full"></div>
                            <div className="text-xs font-bold text-indigo-500 mb-1 uppercase tracking-wide">{exp.startDate} — {exp.current ? t('cv.present') : exp.endDate}</div>
                            <h3 className="font-bold text-slate-900 text-sm mb-0.5">{exp.title}</h3>
                            <div className="text-xs font-medium text-slate-500 mb-2">{exp.company} • {exp.location}</div>

                            <ul className="space-y-1.5">
                                {(exp.description || []).map((desc, i) => (
                                    <li key={i} className="text-xs text-slate-600 leading-relaxed flex items-start gap-2">
                                        <div className="w-1 h-1 bg-indigo-400 rounded-full mt-1.5 shrink-0"></div>
                                        {desc}
                                    </li>
                                ))}
                            </ul>
                        </div>,
                        `exp-${exp.id}`
                    );
                }
            });
        }

        // EDUCATION
        else if (key === 'education' && data.education.length > 0) {
            addBlock(<SectionHeader title={theme === 'elegant' ? 'EDUCATION' : t('cv.education')} theme={theme} />, 'edu-header');

            data.education.forEach(edu => {
                if (theme === 'professional') {
                    addBlock(
                        <div className="mb-3 flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                                <div className="text-xs text-slate-600 font-medium">{edu.institution}</div>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-slate-900 text-xs block">{edu.startDate} — {edu.endDate}</span>
                                {edu.location && <span className="text-xs text-slate-500">{edu.location}</span>}
                            </div>
                        </div>,
                        `edu-${edu.id}`
                    );
                } else if (theme === 'elegant') {
                    addBlock(
                        <div className="mb-4">
                            <div className="flex items-end mb-1">
                                <div className="shrink-0 mr-2 text-slate-900 text-[10px] pb-1 transform rotate-45">❖</div>
                                <h3 className="font-serif font-bold text-slate-900 text-sm whitespace-nowrap mr-1">{edu.institution}</h3>

                                {/* Dotted Leader */}
                                <div className="flex-1 border-b border-dotted border-slate-400 mx-2 relative top-[-5px]"></div>

                                <span className="font-serif text-slate-900 text-xs whitespace-nowrap">{edu.startDate} — {edu.endDate}</span>
                            </div>

                            <div className="flex justify-between items-center ml-5">
                                <span className="font-serif text-slate-700 text-xs italic">{edu.degree}</span>
                                <span className="font-serif text-slate-600 text-[10px]">{edu.location}</span>
                            </div>
                        </div>,
                        `edu-${edu.id}`
                    );
                } else { // Creative
                    addBlock(
                        <div className="mb-4 pl-6 border-l-2 border-indigo-100 relative">
                            <div className="absolute -left-[5px] top-1.5 w-2 h-2 bg-white border-2 border-indigo-200 rounded-full"></div>
                            <h3 className="font-bold text-slate-900 text-sm">{edu.degree}</h3>
                            <div className="text-xs text-slate-500">{edu.institution}</div>
                            {edu.location && <div className="text-xs text-slate-400">{edu.location}</div>}
                            <div className="text-[10px] text-indigo-500 font-medium mt-1 uppercase">{edu.startDate} — {edu.endDate}</div>
                        </div>,
                        `edu-${edu.id}`
                    );
                }
            });
        }

        // SKILLS
        else if (key === 'skills' && data.skills.length > 0) {
            addBlock(<SectionHeader title={theme === 'elegant' ? 'SKILLS' : t('cv.skills')} theme={theme} />, 'skills-header');

            if (theme === 'professional') {
                addBlock(
                    <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-6">
                        {data.skills.flatMap(group =>
                            group.items.map(item => {
                                if (typeof item === 'string') {
                                    return { name: item, level: 3, showLevel: group.showLevel ?? false };
                                }
                                return { ...item, showLevel: group.showLevel ?? false };
                            })
                        ).map((skill, i) => {
                            const showLevel = skill.showLevel;
                            const level = skill.level ?? 3;

                            return (
                                <div key={i} className="text-xs">
                                    <div className="flex justify-between mb-1">
                                        <span className="font-bold text-slate-900">{skill.name}</span>
                                        {showLevel && <span className="text-slate-500 text-[10px]">{level}/5</span>}
                                    </div>
                                    {showLevel ? (
                                        <svg width="100%" height="6" style={{ display: 'block' }}>
                                            <rect x="0" y="0" width="100%" height="6" rx="3" fill="#f1f5f9" />
                                            <rect x="0" y="0" width={`${(level / 5) * 100}%`} height="6" rx="3" fill="#1d4ed8" />
                                        </svg>
                                    ) : (
                                        <div className="border-b border-slate-200 mt-1"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>,
                    'skills-body'
                );
            } else if (theme === 'elegant') {
                // Dotted leader skill layout
                addBlock(
                    <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-6 px-4">
                        {data.skills.flatMap(g =>
                            g.items.map(s => {
                                if (typeof s === 'string') {
                                    return {
                                        name: s,
                                        level: 3,
                                        cat: g.name,
                                        showLevel: g.showLevel ?? false
                                    };
                                }
                                return {
                                    ...s,
                                    cat: g.name,
                                    showLevel: g.showLevel ?? false
                                };
                            })
                        ).map((skill, i) => {
                            let levelText = '';
                            if (skill.showLevel) {
                                if (skill.level === 5) levelText = t('cv.expert', 'Expert');
                                else if (skill.level === 4) levelText = t('cv.advanced', 'Advanced');
                                else if (skill.level === 3) levelText = t('cv.intermediate', 'Intermediate');
                                else if (skill.level === 2) levelText = t('cv.elementary', 'Elementary');
                                else levelText = t('cv.beginner', 'Beginner');
                            }

                            return (
                                <div key={i} className="flex items-end">
                                    <span className="font-serif text-slate-800 text-xs shrink-0">{skill.name}</span>
                                    <div className={`flex-1 mx-2 relative top-[-5px] ${skill.showLevel ? 'border-b border-dotted border-slate-400' : ''}`}></div>
                                    {levelText && <span className="font-serif text-slate-900 text-xs italic font-bold shrink-0">{levelText}</span>}
                                </div>
                            );
                        })}
                    </div>,
                    'skills-body'
                );
            } else { // Creative
                addBlock(
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        {data.skills.map((group, i) => (
                            <div key={i} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="font-bold text-indigo-600 text-xs mb-2 uppercase tracking-wider">{group.name}</div>
                                <div className="flex flex-wrap gap-2">
                                    {group.items.map((skill, si) => {
                                        const name = typeof skill === 'string' ? skill : skill.name;
                                        const level = typeof skill === 'string' ? 3 : (skill.level ?? 3);

                                        return (
                                            <span key={si} className="text-[10px] font-medium bg-white text-slate-600 px-2 py-1 rounded shadow-sm border border-slate-100 flex items-center gap-1">
                                                {name}
                                                {group.showLevel && (
                                                    <span className="flex">
                                                        {[...Array(level)].map((_, stars) => (
                                                            <span key={stars} className="text-indigo-400 text-[8px]">★</span>
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

        // GENERIC / OTHER SECTIONS
        else if ((key === 'languages' && data.languages.length > 0) ||
            (key === 'awards' && data.awards.length > 0) ||
            (key === 'projects' && data.projects.length > 0) ||
            (key === 'certifications' && data.certifications.length > 0) ||
            (key === 'volunteering' && data.volunteering.length > 0) ||
            (key === 'interests' && data.interests && data.interests.trim().length > 0) ||
            (key === 'references' && data.references) ||
            key.startsWith('custom-')) {

            // Common Header
            let title = key;
            if (key === 'languages') title = t('cv.languages');
            if (key === 'awards') title = t('cv.awards');
            if (key === 'projects') title = t('cv.projects');
            if (key === 'certifications') title = t('cv.certifications');
            if (key === 'volunteering') title = t('cv.volunteering');
            if (key === 'interests') title = t('cv.interests');
            if (key === 'references') title = t('cv.references');

            if (key.startsWith('custom-')) {
                const customSec = data.customSections.find(s => s.id === key);
                if (customSec) title = customSec.title;
            }

            // Elegant Override for Titles
            if (theme === 'elegant') {
                if (key === 'internships' || key === 'volunteering') title = 'INTERNSHIPS'; // From image if implied
                else title = title.toUpperCase();
            }

            addBlock(<SectionHeader title={title} theme={theme} />, `${key}-header`);

            // Render simple content for these miscellaneous sections
            if (key === 'languages') {
                if (theme === 'elegant') {
                    addBlock(
                        <div className="grid grid-cols-2 gap-x-12 gap-y-2 mb-6 px-4">
                            {data.languages.map((l, i) => (
                                <div key={i} className="flex items-end">
                                    <span className="font-serif text-slate-800 text-xs shrink-0">{l.language}</span>
                                    <div className="flex-1 border-b border-dotted border-slate-400 mx-2 relative top-[-5px]"></div>
                                    <span className="font-serif text-slate-900 text-xs italic font-bold shrink-0">{l.proficiency}</span>
                                </div>
                            ))}
                        </div>,
                        'lang-body'
                    );
                } else {
                    addBlock(
                        <div className={`text-xs ${theme === 'creative' ? 'flex flex-wrap gap-2' : ''}`}>
                            {data.languages.map((l, i) => (
                                <span key={i} className={`${theme === 'creative' ? 'bg-indigo-50 text-indigo-700 px-2 py-1 rounded' : 'block mb-1'}`}>
                                    <span className="font-bold">{l.language}</span>: {l.proficiency}
                                </span>
                            ))}
                        </div>,
                        'lang-body'
                    );
                }
            } else if (key === 'interests') {
                if (theme === 'elegant') {
                    addBlock(
                        <div className="flex flex-wrap gap-x-2 gap-y-1 justify-center mb-4">
                            {data.interests.split(',').map((interest, i) => {
                                const trimmed = interest.trim();
                                return (
                                    <span key={i} className="font-serif text-xs text-slate-700">
                                        {trimmed}{i < data.interests.split(',').length - 1 && ' •'}
                                    </span>
                                );
                            })}
                        </div>,
                        'int-body'
                    );
                } else if (theme === 'creative') {
                    addBlock(
                        <div className="flex flex-wrap gap-2 mb-4">
                            {data.interests.split(',').map((interest, i) => (
                                <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                                    {interest.trim()}
                                </span>
                            ))}
                        </div>,
                        'int-body'
                    );
                } else {
                    addBlock(
                        <ul className="list-disc ml-4 space-y-0.5 mb-4">
                            {data.interests.split(',').map((interest, i) => (
                                <li key={i} className="text-xs text-slate-700">{interest.trim()}</li>
                            ))}
                        </ul>,
                        'int-body'
                    );
                }
            } else if (key === 'references') {
                addBlock(
                    <div className={`text-xs ${theme === 'elegant' ? 'font-serif text-center italic' : ''}`}>
                        {data.references}
                    </div>,
                    'ref-body'
                );
            } else if (key === 'projects') {
                data.projects.forEach(p => {
                    addBlock(
                        <div className={`mb-3 ${theme === 'elegant' ? 'font-serif' : ''} ${theme === 'creative' ? 'pl-6 border-l-2 border-slate-100' : ''}`}>
                            <div className="font-bold text-sm">{p.name}</div>
                            {p.url && <a href={p.url.startsWith('http') ? p.url : `https://${p.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mb-1 block relative z-10 break-all">{p.url}</a>}
                            <div className="text-xs">{p.description.join('. ')}</div>
                        </div>,
                        `proj-${p.id}`
                    );
                });
            } else if (key === 'volunteering' && theme === 'elegant') {
                data.volunteering.forEach(vol => {
                    addBlock(
                        <div className="mb-4">
                            <div className="flex items-end mb-1">
                                <div className="shrink-0 mr-2 text-slate-900 text-[10px] pb-1 transform rotate-45">❖</div>
                                <h3 className="font-serif font-bold text-slate-900 text-sm whitespace-nowrap mr-1">{vol.role}, {vol.organization}</h3>
                                <div className="flex-1 border-b border-dotted border-slate-400 mx-2 relative top-[-5px]"></div>
                                <span className="font-serif text-slate-900 text-xs whitespace-nowrap">{vol.startDate} - {vol.endDate}</span>
                            </div>
                            <div className="font-serif text-xs text-slate-700 ml-5">
                                {Array.isArray(vol.description) ? vol.description.join('. ') : vol.description}
                            </div>
                        </div>,
                        `vol-${vol.id}`
                    );
                });
            } else if (key === 'awards') {
                data.awards.forEach(award => {
                    const content = theme === 'elegant' ? (
                        <div className="mb-2">
                            <div className="flex items-end text-xs">
                                <span className="font-serif font-bold text-slate-900 shrink-0">{award.title}</span>
                                {award.issuer && <span className="font-serif text-slate-600 mx-1">- {award.issuer}</span>}
                                <div className="flex-1 border-b border-dotted border-slate-400 mx-2 relative top-[-5px]"></div>
                                <span className="font-serif text-slate-700 shrink-0">{award.date}</span>
                            </div>
                        </div>
                    ) : (
                        <div className={`mb-2 text-xs ${theme === 'creative' ? 'pl-6 border-l-2 border-orange-100 relative' : ''}`}>
                            {theme === 'creative' && <div className="absolute -left-[5px] top-1 w-2 h-2 bg-orange-200 rounded-full"></div>}
                            <div className="flex justify-between items-baseline">
                                <span className="font-bold text-slate-900">{award.title} {award.issuer && <span className="font-normal text-slate-600">- {award.issuer}</span>}</span>
                                <span className="text-slate-500">{award.date}</span>
                            </div>
                        </div>
                    );
                    addBlock(content, `award-${award.id}`);
                });
            } else if (key === 'certifications') {
                data.certifications.forEach(cert => {
                    const content = theme === 'elegant' ? (
                        <div className="mb-2">
                            <div className="flex items-end text-xs">
                                <span className="font-serif font-bold text-slate-900 shrink-0">{cert.name}</span>
                                {cert.issuer && <span className="font-serif text-slate-600 mx-1">- {cert.issuer}</span>}
                                <div className="flex-1 border-b border-dotted border-slate-400 mx-2 relative top-[-5px]"></div>
                                <span className="font-serif text-slate-700 shrink-0">{cert.date}</span>
                            </div>
                        </div>
                    ) : (
                        <div className={`mb-2 text-xs ${theme === 'creative' ? 'pl-6 border-l-2 border-indigo-100 relative' : ''}`}>
                            {theme === 'creative' && <div className="absolute -left-[5px] top-1 w-2 h-2 bg-indigo-200 rounded-full"></div>}
                            <div className="flex justify-between items-baseline">
                                <span className="font-bold text-slate-900">{cert.name} {cert.issuer && <span className="font-normal text-slate-600">- {cert.issuer}</span>}</span>
                                <span className="text-slate-500">{cert.date}</span>
                            </div>
                        </div>
                    );
                    addBlock(content, `cert-${cert.id}`);
                });
            } else {
                // Fallback for others
                addBlock(<div className="text-xs text-slate-500 italic mb-4">(Section content renderer pending for {key})</div>, `${key}-placeholder`);
            }
        }
    });
};
