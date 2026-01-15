import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ResumeData, ExperienceItem, EducationItem, SkillCategory, ProjectItem, CertificationItem, LanguageItem, VolunteeringItem, AwardItem, CustomSection, CustomSectionItem } from '../types';
import {
    Plus, Trash2, MapPin, Calendar, Briefcase, User, Mail, Globe, Linkedin, Phone,
    ChevronDown, ChevronUp, GripVertical, Star, Book, Award, Heart, Layout, Type,
    Camera, X, ImageIcon
} from 'lucide-react';

interface ManualEditorProps {
    data: ResumeData;
    onChange: (data: ResumeData) => void;
}

const ManualEditor: React.FC<ManualEditorProps> = ({ data, onChange }) => {
    const { t } = useTranslation();
    const [expandedSection, setExpandedSection] = useState<string | null>('personal');
    const [activeSectionMenu, setActiveSectionMenu] = useState(false);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [draggableRow, setDraggableRow] = useState<string | null>(null);
    const [showProfileImage, setShowProfileImage] = useState(!!data.profileImage);

    // Helper for single field updates
    const handleChange = (field: keyof ResumeData, value: any) => {
        onChange({ ...data, [field]: value });
    };

    const toggleSection = (section: string) => {
        setExpandedSection(expandedSection === section ? null : section);
    };

    // --- DRAG AND DROP LOGIC ---
    const handleDragStart = (e: React.DragEvent, index: number) => {
        // Critical: Only allow drag if the handle was the target or we are in "draggable mode"
        if (draggableRow !== data.sectionOrder[index]) {
            e.preventDefault();
            return;
        }

        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", index.toString());

        // Visual feedback
        const el = e.target as HTMLElement;
        requestAnimationFrame(() => {
            el.classList.add('opacity-50', 'bg-slate-50', 'ring-2', 'ring-indigo-400');
        });
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedItemIndex(null);
        const el = e.target as HTMLElement;
        el.classList.remove('opacity-50', 'bg-slate-50', 'ring-2', 'ring-indigo-400');
        setDraggableRow(null);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault();
        if (draggedItemIndex === null || draggedItemIndex === targetIndex) return;

        const newOrder = [...data.sectionOrder];
        const itemToMove = newOrder[draggedItemIndex];

        // Move item
        newOrder.splice(draggedItemIndex, 1);
        newOrder.splice(targetIndex, 0, itemToMove);

        handleChange('sectionOrder', newOrder);
        setDraggedItemIndex(null);
    };

    // --- REMOVE LOGIC ---
    const removeSection = (key: string) => {
        let title = key.charAt(0).toUpperCase() + key.slice(1);
        if (key.startsWith('custom-')) {
            const s = data.customSections.find(c => c.id === key);
            title = s ? s.title : t('editor.customSection');
        }

        if (window.confirm(t('editor.removeSectionConfirm', { section: title }))) {
            // 1. Remove from Order
            const newOrder = data.sectionOrder.filter(k => k !== key);

            // 2. Remove from Custom Data (if applicable)
            const newCustomSections = data.customSections.filter(c => c.id !== key);

            // 3. Update State
            onChange({
                ...data,
                sectionOrder: newOrder,
                customSections: newCustomSections
            });

            if (expandedSection === key) setExpandedSection(null);
        }
    };

    const addSection = (key: string) => {
        if (!data.sectionOrder.includes(key)) {
            handleChange('sectionOrder', [...data.sectionOrder, key]);
        }
        setActiveSectionMenu(false);
        setExpandedSection(key);
    };

    const addCustomSection = () => {
        const id = `custom-${Date.now()}`;

        // Initialize with a default item so it's not empty
        const newCustomSection: CustomSection = {
            id,
            title: t('editor.customSection'),
            items: [
                {
                    id: `item-${Date.now()}`,
                    title: 'My Project / Activity',
                    subtitle: 'Role or Detail',
                    date: '2024',
                    description: ['Description of what I achieved...']
                }
            ]
        };

        // Update both customSections AND sectionOrder
        const newData = {
            ...data,
            customSections: [...data.customSections, newCustomSection],
            sectionOrder: [...data.sectionOrder, id]
        };

        onChange(newData);
        setActiveSectionMenu(false);
        setExpandedSection(id);
    };


    // --- GENERIC HELPERS ---
    const handleArrayChange = (arrayField: keyof ResumeData, id: string, field: string, value: any) => {
        const array = (data[arrayField] as any[]);
        const newArray = array.map(item => item.id === id ? { ...item, [field]: value } : item);
        handleChange(arrayField, newArray);
    };

    const addItem = (field: keyof ResumeData, template: any) => {
        handleChange(field, [...(data[field] as any[]), template]);
    };

    const removeItem = (field: keyof ResumeData, id: string) => {
        handleChange(field, (data[field] as any[]).filter(item => item.id !== id));
    };


    // --- RENDERERS ---

    // Profil fotoğrafı yükleme
    const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                handleChange('profileImage', event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeProfileImage = () => {
        handleChange('profileImage', '');
    };

    const renderPersonal = () => (
        <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-top-2">
            {/* Profil Fotoğrafı Toggle */}
            <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <Camera className="w-4 h-4 text-indigo-600" />
                        </div>
                        <div>
                            <span className="text-sm font-semibold text-slate-700">{t('editor.profilePhoto')}</span>
                            <p className="text-xs text-slate-400">{t('editor.profilePhotoDesc')}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setShowProfileImage(!showProfileImage);
                            if (showProfileImage && data.profileImage) {
                                removeProfileImage();
                            }
                        }}
                        className={`
                          relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                          ${showProfileImage ? 'bg-indigo-500' : 'bg-slate-300'}
                        `}
                    >
                        <span
                            className={`
                            absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200
                            ${showProfileImage ? 'translate-x-5' : 'translate-x-0'}
                          `}
                        />
                    </button>
                </div>

                {/* Fotoğraf Yükleme Alanı */}
                {showProfileImage && (
                    <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
                        {data.profileImage ? (
                            <div className="relative w-24 h-24 mx-auto">
                                <img
                                    src={data.profileImage}
                                    alt="Profile"
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                />
                                <button
                                    onClick={removeProfileImage}
                                    className="absolute -top-1 -right-1 p-1.5 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center justify-center w-24 h-24 mx-auto border-2 border-dashed border-indigo-300 rounded-full cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                                <ImageIcon className="w-6 h-6 text-indigo-400" />
                                <span className="text-[10px] text-indigo-400 mt-1 font-medium">{t('editor.upload')}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleProfileImageUpload}
                                    className="hidden"
                                />
                            </label>
                        )}
                        <p className="text-center text-[10px] text-slate-400 mt-2">{t('editor.recommended')}</p>
                    </div>
                )}
            </div>

            <Input label={t('editor.fullName')} value={data.fullName} onChange={(v) => handleChange('fullName', v)} placeholder="e.g. John Doe" />
            <Input label={t('editor.jobTitle')} value={data.title} onChange={(v) => handleChange('title', v)} placeholder="e.g. Software Engineer" />
            <Input label={t('editor.email')} value={data.email} onChange={(v) => handleChange('email', v)} icon={<Mail className="w-3 h-3" />} />
            <Input label={t('editor.phone')} value={data.phone} onChange={(v) => handleChange('phone', v)} icon={<Phone className="w-3 h-3" />} />
            <Input label={t('editor.location')} value={data.location} onChange={(v) => handleChange('location', v)} icon={<MapPin className="w-3 h-3" />} />
            <Input label={t('editor.linkedin')} value={data.linkedin} onChange={(v) => handleChange('linkedin', v)} icon={<Linkedin className="w-3 h-3" />} />
            <Input label={t('editor.website')} value={data.website} onChange={(v) => handleChange('website', v)} icon={<Globe className="w-3 h-3" />} />
        </div>
    );

    const renderSummary = () => (
        <textarea
            value={data.summary}
            onChange={(e) => handleChange('summary', e.target.value)}
            className="w-full p-3 border border-slate-200 rounded-lg focus:border-slate-600 focus:ring-0 outline-none h-32 text-sm transition-all placeholder-slate-400 bg-white"
            placeholder={t('editor.summaryPlaceholder')}
        />
    );

    const renderExperience = () => (
        <div className="space-y-6">
            {data.experience.map((exp) => (
                <div key={exp.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                    <button onClick={() => removeItem('experience', exp.id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid gap-3">
                        <Input label={t('editor.company')} value={exp.company} onChange={(v) => handleArrayChange('experience', exp.id, 'company', v)} />
                        <Input label={t('editor.jobTitle')} value={exp.title} onChange={(v) => handleArrayChange('experience', exp.id, 'title', v)} />
                        <div className="grid grid-cols-2 gap-2">
                            <Input label={t('editor.startDate')} value={exp.startDate} onChange={(v) => handleArrayChange('experience', exp.id, 'startDate', v)} />
                            <Input label={t('editor.endDate')} value={exp.endDate} onChange={(v) => handleArrayChange('experience', exp.id, 'endDate', v)} disabled={exp.current} />
                        </div>
                        <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer w-fit select-none">
                            <input type="checkbox" checked={exp.current} onChange={(e) => handleArrayChange('experience', exp.id, 'current', e.target.checked)} className="rounded text-indigo-600 focus:ring-0 focus:border-slate-600 cursor-pointer" />
                            {t('editor.currentWork')}
                        </label>
                        <Textarea label={t('editor.description')} value={(exp.description || []).join('\n')} onChange={(v) => handleArrayChange('experience', exp.id, 'description', v.split('\n'))} rows={4} />
                    </div>
                </div>
            ))}
            <ButtonAdd onClick={() => addItem('experience', { id: Date.now().toString(), company: 'New Company', title: 'Role', location: '', startDate: '', endDate: '', current: false, description: [] } as ExperienceItem)} label={t('editor.addExperience')} />
        </div>
    );

    const renderEducation = () => (
        <div className="space-y-6">
            {data.education.map((edu) => (
                <div key={edu.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                    <button onClick={() => removeItem('education', edu.id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid gap-3">
                        <Input label={t('editor.institution')} value={edu.institution} onChange={(v) => handleArrayChange('education', edu.id, 'institution', v)} />
                        <Input label={t('editor.degree')} value={edu.degree} onChange={(v) => handleArrayChange('education', edu.id, 'degree', v)} />
                        <div className="grid grid-cols-2 gap-2">
                            <Input label={t('editor.startDate')} value={edu.startDate} onChange={(v) => handleArrayChange('education', edu.id, 'startDate', v)} />
                            <Input label={t('editor.endDate')} value={edu.endDate} onChange={(v) => handleArrayChange('education', edu.id, 'endDate', v)} />
                        </div>
                    </div>
                </div>
            ))}
            <ButtonAdd onClick={() => addItem('education', { id: Date.now().toString(), institution: 'University', degree: 'Degree', location: '', startDate: '', endDate: '', current: false } as EducationItem)} label={t('editor.addEducation')} />
        </div>
    );

    const renderSkills = () => (
        <div className="space-y-4">
            {data.skills.map((cat, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200 relative">
                    <button onClick={() => {
                        const newSkills = data.skills.filter((_, i) => i !== idx);
                        handleChange('skills', newSkills);
                    }} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>

                    <Input label={t('editor.categoryName')} value={cat.name} onChange={(v) => {
                        const newSkills = [...data.skills];
                        newSkills[idx].name = v;
                        handleChange('skills', newSkills);
                    }} />
                    <Textarea label={t('editor.skillsPlaceholder')} value={cat.items.join(', ')} onChange={(v) => {
                        const newSkills = [...data.skills];
                        newSkills[idx].items = v.split(',').map(s => s.trim()).filter(Boolean);
                        handleChange('skills', newSkills);
                    }} rows={2} />
                </div>
            ))}
            <ButtonAdd onClick={() => handleChange('skills', [...data.skills, { name: 'New Category', items: [] }])} label={t('editor.addSkillCategory')} />
        </div>
    );

    const renderProjects = () => (
        <div className="space-y-6">
            {data.projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                    <button onClick={() => removeItem('projects', proj.id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid gap-3">
                        <Input label={t('editor.projectName')} value={proj.name} onChange={(v) => handleArrayChange('projects', proj.id, 'name', v)} />
                        <Input label={t('editor.link')} value={proj.url || ''} onChange={(v) => handleArrayChange('projects', proj.id, 'url', v)} />
                        <Textarea label={t('editor.description')} value={(proj.description || []).join('\n')} onChange={(v) => handleArrayChange('projects', proj.id, 'description', v.split('\n'))} rows={3} />
                    </div>
                </div>
            ))}
            <ButtonAdd onClick={() => addItem('projects', { id: Date.now().toString(), name: 'Project Name', description: [] } as ProjectItem)} label={t('editor.addProject')} />
        </div>
    );

    const renderCertifications = () => (
        <div className="space-y-4">
            {data.certifications.map((cert) => (
                <div key={cert.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                    <button onClick={() => removeItem('certifications', cert.id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    <Input label={t('editor.certificationName')} value={cert.name} onChange={(v) => handleArrayChange('certifications', cert.id, 'name', v)} />
                    <Input label={t('editor.issuer')} value={cert.issuer} onChange={(v) => handleArrayChange('certifications', cert.id, 'issuer', v)} />
                    <Input label={t('editor.date')} value={cert.date} onChange={(v) => handleArrayChange('certifications', cert.id, 'date', v)} />
                </div>
            ))}
            <ButtonAdd onClick={() => addItem('certifications', { id: Date.now().toString(), name: 'Certificate', issuer: 'Issuer', date: '2023' } as CertificationItem)} label={t('editor.addCertification')} />
        </div>
    );

    const renderLanguages = () => (
        <div className="space-y-4">
            {data.languages.map((lang) => (
                <div key={lang.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 relative flex gap-3 items-end">
                    <div className="flex-1">
                        <Input label={t('editor.language')} value={lang.language} onChange={(v) => handleArrayChange('languages', lang.id, 'language', v)} />
                    </div>
                    <div className="flex-1">
                        <Input label={t('editor.proficiency')} value={lang.proficiency} onChange={(v) => handleArrayChange('languages', lang.id, 'proficiency', v)} />
                    </div>
                    <button onClick={() => removeItem('languages', lang.id)} className="p-2.5 text-slate-300 hover:text-red-500 rounded hover:bg-red-50 mb-[1px]"><Trash2 className="w-4 h-4" /></button>
                </div>
            ))}
            <ButtonAdd onClick={() => addItem('languages', { id: Date.now().toString(), language: 'English', proficiency: 'Native' } as LanguageItem)} label={t('editor.addLanguage')} />
        </div>
    );

    const renderAwards = () => (
        <div className="space-y-4">
            {data.awards.map((award) => (
                <div key={award.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                    <button onClick={() => removeItem('awards', award.id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    <Input label={t('editor.awardTitle')} value={award.title} onChange={(v) => handleArrayChange('awards', award.id, 'title', v)} />
                    <Input label={t('editor.issuer')} value={award.issuer} onChange={(v) => handleArrayChange('awards', award.id, 'issuer', v)} />
                    <Input label={t('editor.date')} value={award.date} onChange={(v) => handleArrayChange('awards', award.id, 'date', v)} />
                </div>
            ))}
            <ButtonAdd onClick={() => addItem('awards', { id: Date.now().toString(), title: 'Award', issuer: 'Issuer', date: '2023' } as AwardItem)} label={t('editor.addAward')} />
        </div>
    );

    const renderVolunteering = () => (
        <div className="space-y-6">
            {data.volunteering.map((vol) => (
                <div key={vol.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative group">
                    <button onClick={() => removeItem('volunteering', vol.id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                    <div className="grid gap-3">
                        <Input label={t('editor.organization')} value={vol.organization} onChange={(v) => handleArrayChange('volunteering', vol.id, 'organization', v)} />
                        <Input label={t('editor.role')} value={vol.role} onChange={(v) => handleArrayChange('volunteering', vol.id, 'role', v)} />
                        <div className="grid grid-cols-2 gap-2">
                            <Input label={t('editor.startDate')} value={vol.startDate} onChange={(v) => handleArrayChange('volunteering', vol.id, 'startDate', v)} />
                            <Input label={t('editor.endDate')} value={vol.endDate} onChange={(v) => handleArrayChange('volunteering', vol.id, 'endDate', v)} />
                        </div>
                        <Textarea label={t('editor.description')} value={(vol.description || []).join('\n')} onChange={(v) => handleArrayChange('volunteering', vol.id, 'description', v.split('\n'))} rows={3} />
                    </div>
                </div>
            ))}
            <ButtonAdd onClick={() => addItem('volunteering', { id: Date.now().toString(), organization: 'Org', role: 'Volunteer', description: [] } as VolunteeringItem)} label={t('editor.addVolunteering')} />
        </div>
    );

    const renderInterests = () => (
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <Textarea label={t('editor.interestsPlaceholder')} value={data.interests.join(', ')} onChange={(v) => handleChange('interests', v.split(',').map(s => s.trim()).filter(Boolean))} rows={3} />
        </div>
    );

    const renderCustomSection = (sectionId: string) => {
        const customSection = data.customSections.find(c => c.id === sectionId);
        if (!customSection) return null;

        const updateCustomSection = (field: keyof CustomSection, value: any) => {
            const newCustomSections = data.customSections.map(c => c.id === sectionId ? { ...c, [field]: value } : c);
            handleChange('customSections', newCustomSections);
        };

        const updateCustomItem = (itemId: string, field: keyof CustomSectionItem, value: any) => {
            const newItems = customSection.items.map(item => item.id === itemId ? { ...item, [field]: value } : item);
            updateCustomSection('items', newItems);
        };

        const addCustomItem = () => {
            const newItem: CustomSectionItem = {
                id: `item-${Date.now()}`,
                title: 'New Item',
                subtitle: '',
                date: '',
                description: []
            };
            updateCustomSection('items', [...customSection.items, newItem]);
        };

        const removeCustomItem = (itemId: string) => {
            updateCustomSection('items', customSection.items.filter(i => i.id !== itemId));
        };

        return (
            <div className="space-y-4">
                <div className="flex gap-2">
                    <Input label={t('editor.sectionTitle')} value={customSection.title} onChange={(v) => updateCustomSection('title', v)} />
                </div>

                <div className="space-y-4">
                    {customSection.items.length === 0 && (
                        <div className="text-center p-6 text-sm text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                            {t('editor.sectionEmpty')}
                            <button onClick={addCustomItem} className="text-indigo-600 font-bold hover:underline ml-1 block w-full mt-2">{t('editor.addFirstItem')}</button>
                        </div>
                    )}

                    {customSection.items.map(item => (
                        <div key={item.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 relative">
                            <button onClick={() => removeCustomItem(item.id)} className="absolute top-2 right-2 p-1 text-slate-300 hover:text-red-500 rounded hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                            <Input label={t('editor.sectionTitle')} value={item.title} onChange={(v) => updateCustomItem(item.id, 'title', v)} />
                            <Input label={t('editor.subtitle')} value={item.subtitle || ''} onChange={(v) => updateCustomItem(item.id, 'subtitle', v)} />
                            <Input label={t('editor.dateOptional')} value={item.date || ''} onChange={(v) => updateCustomItem(item.id, 'date', v)} />
                            <Textarea label={t('editor.description')} value={(item.description || []).join('\n')} onChange={(v) => updateCustomItem(item.id, 'description', v.split('\n'))} rows={2} />
                        </div>
                    ))}
                    {customSection.items.length > 0 && <ButtonAdd onClick={addCustomItem} label={t('editor.addItem')} />}
                </div>
            </div>
        );
    };


    // MAPPING KEYS TO RENDERERS
    const renderSectionContent = (key: string) => {
        if (key.startsWith('custom-')) return renderCustomSection(key);
        switch (key) {
            case 'personal': return renderPersonal();
            case 'summary': return renderSummary();
            case 'experience': return renderExperience();
            case 'education': return renderEducation();
            case 'skills': return renderSkills();
            case 'projects': return renderProjects();
            case 'certifications': return renderCertifications();
            case 'languages': return renderLanguages();
            case 'awards': return renderAwards();
            case 'volunteering': return renderVolunteering();
            case 'interests': return renderInterests();
            case 'references': return <Textarea value={data.references} onChange={(v) => handleChange('references', v)} rows={2} />;
            default: return null;
        }
    };

    const getSectionIcon = (key: string) => {
        if (key.startsWith('custom-')) return <Layout className="w-4 h-4 text-purple-500" />;
        switch (key) {
            case 'personal': return <User className="w-4 h-4 text-blue-500" />;
            case 'summary': return <Book className="w-4 h-4 text-amber-500" />;
            case 'experience': return <Briefcase className="w-4 h-4 text-indigo-500" />;
            case 'education': return <Book className="w-4 h-4 text-emerald-500" />;
            case 'skills': return <Star className="w-4 h-4 text-pink-500" />;
            case 'projects': return <Layout className="w-4 h-4 text-cyan-500" />;
            case 'certifications': return <Award className="w-4 h-4 text-orange-500" />;
            case 'languages': return <Globe className="w-4 h-4 text-teal-500" />;
            case 'awards': return <Award className="w-4 h-4 text-yellow-500" />;
            case 'volunteering': return <Heart className="w-4 h-4 text-red-500" />;
            case 'interests': return <Heart className="w-4 h-4 text-rose-400" />;
            case 'references': return <User className="w-4 h-4 text-slate-500" />;
            default: return <Type className="w-4 h-4" />;
        }
    };

    const getSectionTitle = (key: string) => {
        if (key.startsWith('custom-')) {
            const s = data.customSections.find(c => c.id === key);
            return s ? s.title : t('editor.customSection');
        }
        // Use exact keys from translation.json "cv" section
        // Note: Check for existence or fallback
        return t(`cv.${key}`, { defaultValue: key.charAt(0).toUpperCase() + key.slice(1) });
    };


    return (
        <div className="p-4 space-y-4 pb-32">

            {/* PERSONAL DETAILS (Fixed at top usually, but let's make it collapsible too) */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <button
                    onClick={() => toggleSection('personal')}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <span className="font-bold text-slate-800">{t('editor.personalDetails')}</span>
                    </div>
                    {expandedSection === 'personal' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {expandedSection === 'personal' && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                        {renderPersonal()}
                    </div>
                )}
            </div>

            {/* DYNAMIC SECTIONS */}
            {data.sectionOrder.map((key, index) => (
                <div
                    key={key}
                    draggable={draggableRow === key} // Only draggable if the handle was targeted
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    className={`
                border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all 
                ${draggedItemIndex === index ? 'opacity-50 ring-2 ring-indigo-200 border-indigo-300' : 'hover:shadow-md'}
            `}
                >
                    <div className="flex items-center p-1 bg-white">
                        {/* DRAG HANDLE */}
                        <div
                            className="p-3 text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing flex items-center justify-center self-stretch touch-none"
                            title={t('editor.dragToReorder')}
                            onMouseEnter={() => setDraggableRow(key)}
                            onMouseLeave={() => setDraggableRow(null)}
                            onTouchStart={() => setDraggableRow(key)}
                        >
                            <GripVertical className="w-4 h-4" />
                        </div>

                        <button
                            onClick={() => toggleSection(key)}
                            className="flex-1 flex items-center gap-3 text-left py-2 pr-2"
                        >
                            <div className="p-2 bg-slate-100 rounded-lg shrink-0">
                                {getSectionIcon(key)}
                            </div>
                            <span className="font-bold text-slate-800 text-sm truncate">{getSectionTitle(key)}</span>
                        </button>

                        <div className="flex items-center gap-1 pr-2">
                            <button
                                onClick={() => toggleSection(key)}
                                className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg"
                            >
                                {expandedSection === key ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>

                            {/* Remove Button Moved to Header for Safety */}
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeSection(key);
                                }}
                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                title={t('editor.removeSection')}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {expandedSection === key && (
                        <div className="p-4 border-t border-slate-100 bg-white">
                            {renderSectionContent(key)}
                        </div>
                    )}
                </div>
            ))}

            {/* ADD SECTION BUTTON */}
            <div className="relative">
                <button
                    onClick={() => setActiveSectionMenu(!activeSectionMenu)}
                    className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-semibold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-5 h-5" /> {t('editor.addSection')}
                </button>

                {activeSectionMenu && (
                    <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-xl shadow-2xl border border-slate-200 p-2 z-50 grid grid-cols-2 gap-2 animate-in slide-in-from-bottom-2">
                        {[
                            { id: 'summary', label: 'Summary', icon: Book },
                            { id: 'experience', label: 'Experience', icon: Briefcase },
                            { id: 'education', label: 'Education', icon: Book },
                            { id: 'skills', label: 'Skills', icon: Star },
                            { id: 'projects', label: 'Projects', icon: Layout },
                            { id: 'certifications', label: 'Certifications', icon: Award },
                            { id: 'languages', label: 'Languages', icon: Globe },
                            { id: 'volunteering', label: 'Volunteering', icon: Heart },
                            { id: 'awards', label: 'Awards', icon: Award },
                            { id: 'interests', label: 'Interests', icon: Heart },
                            { id: 'references', label: 'References', icon: User },
                        ].filter(i => !data.sectionOrder.includes(i.id)).map(item => (
                            <button key={item.id} onClick={() => addSection(item.id)} className="flex items-center gap-2 p-3 hover:bg-slate-50 rounded-lg text-left text-sm font-medium text-slate-700">
                                <item.icon className="w-4 h-4 text-indigo-500" /> {t(`cv.${item.id}`)}
                            </button>
                        ))}
                        <button onClick={addCustomSection} className="flex items-center gap-2 p-3 hover:bg-slate-50 rounded-lg text-left text-sm font-medium text-purple-600 col-span-2 border-t border-slate-100">
                            <Plus className="w-4 h-4" /> {t('editor.customSection')}
                        </button>
                    </div>
                )}
            </div>

        </div>
    );
};

// --- SUB-COMPONENTS ---

const Input = ({ label, value, onChange, disabled = false, icon, placeholder }: { label: string, value: string, onChange: (val: string) => void, disabled?: boolean, icon?: React.ReactNode, placeholder?: string }) => (
    <div className="relative">
        <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">{label}</label>
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder}
                className={`
            w-full p-2.5 text-sm border border-slate-200 rounded-lg 
            focus:border-slate-500 focus:ring-0 outline-none 
            disabled:bg-slate-50 disabled:text-slate-400 
            transition-all placeholder-slate-300 bg-white
            ${icon ? 'pl-9' : ''}
        `}
            />
            {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    {icon}
                </div>
            )}
        </div>
    </div>
);

const Textarea = ({ label, value, onChange, rows = 3 }: { label?: string, value: string, onChange: (val: string) => void, rows?: number }) => (
    <div>
        {label && <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">{label}</label>}
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            className="w-full p-3 text-sm border border-slate-200 rounded-lg focus:border-slate-500 focus:ring-0 outline-none transition-all placeholder-slate-300 bg-slate-50/50 resize-y"
        />
    </div>
);

const ButtonAdd = ({ onClick, label }: { onClick: () => void, label: string }) => (
    <button onClick={onClick} className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-slate-500 text-xs font-semibold hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-1">
        <Plus className="w-3 h-3" /> {label}
    </button>
);

export default ManualEditor;