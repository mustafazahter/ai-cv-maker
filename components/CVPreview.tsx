import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { ResumeData } from '../types';

interface CVPreviewProps {
  data: ResumeData;
}

const PAGE_HEIGHT_PX = 1122; // 297mm @ 96dpi approx
const PADDING_MM = 15;
const PADDING_PX = PADDING_MM * 3.78; // ~56px
const CONTENT_HEIGHT = PAGE_HEIGHT_PX - (PADDING_PX * 2); // ~1000px usable
// Use significantly less to break earlier and avoid orphaned headers
const SAFE_HEIGHT = CONTENT_HEIGHT - 80; // More aggressive break point

const CVPreview: React.FC<CVPreviewProps> = ({ data }) => {
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  // -- 1. Flatten Data into Blocks --
  const getFlattenedBlocks = () => {
    const blocks: React.ReactNode[] = [];

    // Helper to push block
    const addBlock = (node: React.ReactNode, key: string) => {
      blocks.push(<div key={key} data-id={key}>{node}</div>);
    };

    // Header Block
    addBlock(
      <header className="border-b-2 border-slate-800 pb-4 mb-6 text-center">
        <h1 className="text-3xl font-serif font-bold text-slate-900 uppercase tracking-wide mb-2">
          {data.fullName}
        </h1>
        <div className="text-sm text-slate-700 flex flex-wrap justify-center gap-4 font-medium">
          {data.location && <span>{data.location}</span>}
          {data.phone && <span>{data.phone}</span>}
          {data.email && <span>{data.email}</span>}
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.website && <span>{data.website}</span>}
        </div>
      </header>,
      'main-header'
    );

    // Dynamic Sections
    data.sectionOrder.forEach(key => {
      // 1. Summary
      if (key === 'summary' && data.summary) {
        addBlock(
          <SectionHeader title="Professional Summary" />,
          'summary-header'
        );
        addBlock(
          <p className="text-sm leading-relaxed text-slate-800 text-justify mb-6">
            {data.summary}
          </p>,
          'summary-body'
        );
      }

      // 2. Experience
      else if (key === 'experience' && data.experience.length > 0) {
        addBlock(<SectionHeader title="Employment History" />, 'exp-header');
        addBlock(<div className="h-2"></div>, 'exp-gap'); // small gap
        data.experience.forEach((exp) => {
          addBlock(
            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-slate-900 text-base">{exp.title}</h3>
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-serif italic text-slate-800">{exp.company}</span>
                <span className="text-xs text-slate-600">{exp.location}</span>
              </div>
              <ul className="list-disc ml-5 space-y-1">
                {(exp.description || []).map((desc, idx) => (
                  <li key={idx} className="text-sm text-slate-800 leading-snug pl-1 break-words">
                    {desc}
                  </li>
                ))}
              </ul>
            </div>,
            `exp-${exp.id}`
          );
        });
        addBlock(<div className="mb-2"></div>, 'exp-end-gap');
      }

      // 3. Education
      else if (key === 'education' && data.education.length > 0) {
        addBlock(<SectionHeader title="Education" />, 'edu-header');
        addBlock(<div className="h-2"></div>, 'edu-gap');
        data.education.forEach((edu) => {
          addBlock(
            <div className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-slate-900">{edu.institution}</h3>
                <span className="text-sm text-slate-700">
                  {edu.startDate} – {edu.endDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="italic text-slate-800 text-sm">{edu.degree}</span>
                <span className="text-xs text-slate-600">{edu.location}</span>
              </div>
            </div>,
            `edu-${edu.id}`
          );
        });
        addBlock(<div className="mb-4"></div>, 'edu-end-gap');
      }

      // 4. Skills
      else if (key === 'skills' && data.skills.length > 0) {
        addBlock(<SectionHeader title="Skills" />, 'skills-header');
        addBlock(
          <div className="grid grid-cols-1 gap-2 mb-6">
            {data.skills.map((skillGroup, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-bold text-slate-900 mr-2">{skillGroup.name}:</span>
                <span className="text-slate-800 break-words">{(skillGroup.items || []).join(', ')}</span>
              </div>
            ))}
          </div>,
          'skills-body'
        );
      }

      // 5. Projects
      else if (key === 'projects' && data.projects.length > 0) {
        addBlock(<SectionHeader title="Projects" />, 'proj-header');
        addBlock(<div className="h-2"></div>, 'proj-gap');
        data.projects.forEach((proj) => {
          addBlock(
            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-slate-900">{proj.name}</h3>
                {proj.url && <a href={proj.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline truncate max-w-[150px]">{proj.url}</a>}
              </div>
              <ul className="list-disc ml-5 space-y-1">
                {(proj.description || []).map((desc, idx) => (
                  <li key={idx} className="text-sm text-slate-800 leading-snug pl-1 break-words">{desc}</li>
                ))}
              </ul>
            </div>,
            `proj-${proj.id}`
          );
        });
      }

      // 6. Certifications
      else if (key === 'certifications' && data.certifications.length > 0) {
        addBlock(<SectionHeader title="Certifications" />, 'cert-header');
        addBlock(
          <div className="space-y-2 mb-6">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="flex justify-between items-baseline text-sm">
                <div>
                  <span className="font-bold text-slate-900">{cert.name}</span>
                  <span className="text-slate-600"> - {cert.issuer}</span>
                </div>
                <span className="text-slate-700 font-medium">{cert.date}</span>
              </div>
            ))}
          </div>,
          'cert-body'
        );
      }

      // 7. Languages
      else if (key === 'languages' && data.languages.length > 0) {
        addBlock(<SectionHeader title="Languages" />, 'lang-header');
        addBlock(
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm mb-6">
            {data.languages.map((lang) => (
              <div key={lang.id}>
                <span className="font-bold text-slate-900">{lang.language}</span>: <span className="text-slate-700">{lang.proficiency}</span>
              </div>
            ))}
          </div>,
          'lang-body'
        );
      }

      // 8. Volunteering
      else if (key === 'volunteering' && data.volunteering.length > 0) {
        addBlock(<SectionHeader title="Volunteering" />, 'vol-header');
        addBlock(<div className="h-2"></div>, 'vol-gap');
        data.volunteering.forEach(vol => {
          addBlock(
            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-bold text-slate-900 text-base">{vol.organization}</h3>
                <span className="text-sm font-medium text-slate-700 whitespace-nowrap">
                  {vol.startDate} – {vol.endDate}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-serif italic text-slate-800">{vol.role}</span>
                <span className="text-xs text-slate-600">{vol.location}</span>
              </div>
              <ul className="list-disc ml-5 space-y-1">
                {(vol.description || []).map((desc, idx) => (
                  <li key={idx} className="text-sm text-slate-800 leading-snug pl-1 break-words">
                    {desc}
                  </li>
                ))}
              </ul>
            </div>,
            `vol-${vol.id}`
          );
        });
      }

      // 9. Awards
      else if (key === 'awards' && data.awards.length > 0) {
        addBlock(<SectionHeader title="Awards & Achievements" />, 'awards-header');
        addBlock(
          <div className="space-y-2 mb-6">
            {data.awards.map((award) => (
              <div key={award.id} className="flex justify-between items-baseline text-sm">
                <div>
                  <span className="font-bold text-slate-900">{award.title}</span>
                  <span className="text-slate-600"> - {award.issuer}</span>
                </div>
                <span className="text-slate-700 font-medium">{award.date}</span>
              </div>
            ))}
          </div>,
          'awards-body'
        );
      }

      // 10. Interests
      else if (key === 'interests' && data.interests.length > 0) {
        addBlock(<SectionHeader title="Interests" />, 'int-header');
        addBlock(
          <p className="text-sm text-slate-800 mb-6">
            {data.interests.join(', ')}
          </p>,
          'int-body'
        );
      }

      // 11. References
      else if (key === 'references' && data.references) {
        addBlock(<SectionHeader title="References" />, 'ref-header');
        addBlock(
          <p className="text-sm text-slate-800 mb-6">
            {data.references}
          </p>,
          'ref-body'
        );
      }

      // Custom Sections
      else if (key.startsWith('custom-')) {
        const section = data.customSections.find(s => s.id === key);
        if (section) {
          addBlock(<SectionHeader title={section.title} />, `custom-${key}-header`);
          addBlock(<div className="h-2"></div>, `custom-${key}-gap`);
          section.items.forEach(item => {
            addBlock(
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-slate-900">{item.title}</h3>
                  {item.date && <span className="text-sm font-medium text-slate-700">{item.date}</span>}
                </div>
                {item.subtitle && <div className="italic text-slate-800 text-sm mb-1">{item.subtitle}</div>}
                {item.description && item.description.length > 0 && (
                  <ul className="list-disc ml-5 space-y-1">
                    {item.description.map((d, i) => (
                      <li key={i} className="text-sm text-slate-800 leading-snug pl-1 break-words">{d}</li>
                    ))}
                  </ul>
                )}
              </div>,
              `custom-item-${item.id}`
            );
          });
        }
      }

    });

    return blocks;
  };

  // -- 2. Measurement & Pagination Effect --
  // We use useLayoutEffect because we need to measure DOM nodes before painting
  // but since we are rendering into a hidden container, useEffect is also fine.
  // We need to render the blocks into the hidden container *first*, wait for that, calculate, then set pages.
  // To do this cleanly in React:
  // 1. Render `blocks` into hidden div.
  // 2. Checking `useEffect` on `blocks` doesn't work easily because blocks is derived.
  // We will simpler: Always render blocks into hidden container, and then in useEffect, measure its children.

  const blocks = getFlattenedBlocks();

  useLayoutEffect(() => {
    if (!hiddenContainerRef.current) return;

    const container = hiddenContainerRef.current;
    const children = Array.from(container.children) as HTMLElement[];

    const newPages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let currentHeight = 0;

    children.forEach((child, index) => {
      // 1. Get height of the block
      const height = child.offsetHeight;
      const blockNode = blocks[index];
      const dataId = child.getAttribute('data-id') || '';
      const isHeader = dataId.endsWith('-header');

      // 2. Check if fits
      if (currentHeight + height > SAFE_HEIGHT && currentPage.length > 0) {
        // Before pushing current page, check if the LAST item added was a header
        // If so, it's orphaned - remove it and add it to the new page
        const lastAddedDataId = children[index - 1]?.getAttribute('data-id') || '';
        const lastWasHeader = lastAddedDataId.endsWith('-header');

        let orphanedHeader: React.ReactNode | null = null;
        if (lastWasHeader && currentPage.length > 0) {
          // Pop the orphaned header
          orphanedHeader = currentPage.pop()!;
          // Recalculate height without the header
          currentHeight -= children[index - 1]?.offsetHeight || 0;
        }

        // Push current page (without orphaned header if any)
        if (currentPage.length > 0) {
          newPages.push(currentPage);
        }
        currentPage = [];
        currentHeight = 0;

        // Add orphaned header to new page first
        if (orphanedHeader) {
          currentPage.push(orphanedHeader);
          currentHeight += children[index - 1]?.offsetHeight || 0;
        }
      }

      // 3. Add current block to page
      currentPage.push(blockNode);
      currentHeight += height;
    });

    // Push last page
    if (currentPage.length > 0) {
      newPages.push(currentPage);
    }

    setPages(newPages);

  }, [data]); // Re-run when data changes. Ideally depend on blocks content, but data covers it.

  return (
    <div className="flex flex-col items-center gap-8 print:gap-0 print:p-0 print:bg-white print:min-h-0 print:block">

      {/* Hidden container for measurement - identical width/styling as page */}
      <div
        ref={hiddenContainerRef}
        style={{ width: '210mm', padding: '15mm', visibility: 'hidden', position: 'absolute', top: -9999, left: -9999, boxSizing: 'border-box' }}
        className="bg-white print:hidden"
      >
        {blocks}
      </div>

      {/* Render Pages */}
      {pages.length === 0 ? (
        // Initial Loading / Fallback state
        <div className="w-[210mm] h-[297mm] bg-white shadow-2xl animate-pulse"></div>
      ) : (
        pages.map((pageContent, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white shadow-2xl relative print:shadow-none print:m-0 print:break-after-page"
            style={{
              width: '210mm',
              height: '297mm',
              padding: '15mm',
              boxSizing: 'border-box',
              pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto'
            }}
          >
            {/* Render Headers, Footers for print if needed? For now just content */}
            <div className="h-full flex flex-col">
              {pageContent}

              {/* Page Number - only show if more than 1 page */}
              {pages.length > 1 && (
                <div className="mt-auto pt-4 border-t border-slate-100 text-center text-slate-400 text-xs">
                  {pageIndex + 1}/{pages.length}
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Helper for Section Headers to ensure consistency
const SectionHeader: React.FC<{ title: string }> = ({ title }) => (
  <h2 className="text-sm font-bold uppercase tracking-widest border-b border-slate-300 mb-3 pb-1 text-slate-800">
    {title}
  </h2>
);

export default CVPreview;