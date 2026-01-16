import React, { useState, useRef, useLayoutEffect, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ResumeData, CVThemeId } from '@/shared/types';
import { renderClassicTheme, renderExecutiveTheme, renderModernTheme, renderSidebarTheme } from './themes/CVThemes';
import { renderProfessionalTheme, renderElegantTheme, renderCreativeTheme } from './themes/NewThemes';

interface CVPreviewProps {
  data: ResumeData;
  theme?: CVThemeId;
}

const PAGE_WIDTH = '210mm';
const PAGE_HEIGHT = '297mm';
const PADDING = '15mm';
const FOOTER_HEIGHT = '15mm';

// High utilization: near-maximum content per page
// 850px - aggressive space usage, monitor for footer collisions
const MAX_CONTENT_HEIGHT_PX = 850;

const CVPreview: React.FC<CVPreviewProps> = ({ data, theme = 'classic' }) => {
  const { t } = useTranslation();
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const measureRef = useRef<HTMLDivElement>(null);

  const [updateKey, setUpdateKey] = useState(0);

  useEffect(() => {
    console.log('🔄 Data changed, forcing pagination update');
    setUpdateKey(k => k + 1);
  }, [JSON.stringify(data), theme]);

  const blocks = useMemo(() => {
    const result: React.ReactNode[] = [];
    const addBlock = (node: React.ReactNode, id: string) => {
      result.push(<div key={id} data-id={id}>{node}</div>);
    };

    switch (theme) {
      case 'executive': renderExecutiveTheme({ data, addBlock, t }); break;
      case 'modern': renderModernTheme({ data, addBlock, t }); break;
      case 'sidebar': renderSidebarTheme({ data, addBlock, t }); break;
      case 'professional': renderProfessionalTheme({ data, addBlock, t }); break;
      case 'elegant': renderElegantTheme({ data, addBlock, t }); break;
      case 'creative': renderCreativeTheme({ data, addBlock, t }); break;
      default: renderClassicTheme({ data, addBlock, t });
    }
    return result;
  }, [data, theme, t]);

  useLayoutEffect(() => {
    const runPagination = () => {
      const container = measureRef.current;
      if (!container) {
        console.log('❌ Container not found');
        return;
      }

      const children = Array.from(container.children) as HTMLElement[];
      if (children.length === 0) {
        console.log('❌ No children found');
        return;
      }

      console.log('✅ Starting pagination with', children.length, 'blocks (updateKey:', updateKey, ')');

      const newPages: React.ReactNode[][] = [];
      let currentPage: React.ReactNode[] = [];
      let currentHeight = 0;

      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const h = child.offsetHeight;
        const id = child.getAttribute('data-id') || '';
        const isHeader = id.endsWith('-header');

        console.log(`Block ${i}: "${id}" - ${h}px (total: ${currentHeight}px)`);

        let shouldBreak = false;

        if (currentHeight > 0) {
          if (isHeader && currentHeight + h + 80 > MAX_CONTENT_HEIGHT_PX) {
            shouldBreak = true;
            console.log(`  → BREAK (header would overflow)`);
          } else if (currentHeight + h > MAX_CONTENT_HEIGHT_PX) {
            shouldBreak = true;
            console.log(`  → BREAK (content would overflow)`);
          }
        }

        if (shouldBreak) {
          newPages.push([...currentPage]);
          console.log(`📄 Page ${newPages.length} created with ${currentPage.length} blocks`);
          currentPage = [];
          currentHeight = 0;
        }

        currentPage.push(blocks[i]);
        currentHeight += h;
      }

      if (currentPage.length > 0) {
        newPages.push(currentPage);
        console.log(`📄 Final page ${newPages.length} created with ${currentPage.length} blocks`);
      }

      console.log(`✅ Total pages: ${newPages.length}`);

      // Debug: Show which blocks are in which page
      newPages.forEach((page, pageIdx) => {
        const blockIds = page.map((block: any) => block.key).join(', ');
        console.log(`📄 Page ${pageIdx + 1} contains: [${blockIds}]`);
      });

      setPages(newPages);
    };

    const timer = setTimeout(runPagination, 200);
    return () => clearTimeout(timer);
  }, [blocks, updateKey]);

  const totalPages = pages.length;

  console.log('🔄 Render - Total pages:', totalPages);

  return (
    <div className="flex flex-col items-center gap-8 print:gap-0 print:block">
      {/* Hidden measurement container - EXACT SAME STRUCTURE AS REAL PAGE */}
      <div
        style={{
          position: 'fixed',
          left: '-99999px',
          top: 0,
          width: PAGE_WIDTH,
          height: PAGE_HEIGHT,
          boxSizing: 'border-box',
          visibility: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Content area - matches real page structure */}
        <div
          ref={measureRef}
          style={{
            flex: '1 1 auto',
            padding: PADDING,
            overflow: 'visible', // For measurement we need visible
            minHeight: 0,
          }}
        >
          {blocks}
        </div>

        {/* Footer area - matches real page structure */}
        <div
          style={{
            flexShrink: 0,
            height: FOOTER_HEIGHT,
          }}
        />
      </div>

      {/* Pages */}
      {pages.length === 0 ? (
        <div
          className="bg-white shadow-2xl animate-pulse"
          style={{ width: PAGE_WIDTH, height: PAGE_HEIGHT }}
        />
      ) : (
        pages.map((content, idx) => (
          <div
            key={`page-${idx}-${updateKey}`}
            className="bg-white shadow-2xl print:shadow-none"
            style={{
              width: PAGE_WIDTH,
              height: PAGE_HEIGHT,
              boxSizing: 'border-box',
              pageBreakAfter: idx < totalPages - 1 ? 'always' : 'auto',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Content area */}
            <div
              style={{
                flex: '1 1 auto',
                padding: PADDING,
                overflow: 'hidden', // CRITICAL: prevents content from overlapping footer
                minHeight: 0,
              }}
            >
              {content}
            </div>

            {/* Footer area */}
            <div
              style={{
                flexShrink: 0,
                height: FOOTER_HEIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {totalPages > 1 && (
                <span style={{ fontSize: '10px', color: '#9ca3af' }}>
                  {idx + 1}/{totalPages}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CVPreview;