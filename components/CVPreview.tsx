import React, { useState, useRef, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ResumeData, CVThemeId } from '../types';
import { renderClassicTheme, renderExecutiveTheme, renderModernTheme, renderSidebarTheme } from './themes/CVThemes';

interface CVPreviewProps {
  data: ResumeData;
  theme?: CVThemeId;
}

// A4 dimensions
const PAGE_HEIGHT_PX = 1122;
const PADDING_MM = 15;
const PADDING_PX = PADDING_MM * 3.78;
const FOOTER_HEIGHT = 80; // Significantly increased reserved space for footer
const CONTENT_HEIGHT = PAGE_HEIGHT_PX - (PADDING_PX * 2) - FOOTER_HEIGHT;
const SAFE_HEIGHT = CONTENT_HEIGHT - 80; // Large safety buffer to ensure early cut

const CVPreview: React.FC<CVPreviewProps> = ({ data, theme = 'classic' }) => {
  const { t } = useTranslation();
  const [pages, setPages] = useState<React.ReactNode[][]>([]);
  const hiddenContainerRef = useRef<HTMLDivElement>(null);

  const getFlattenedBlocks = () => {
    const blocks: React.ReactNode[] = [];

    const addBlock = (node: React.ReactNode, key: string) => {
      blocks.push(<div key={key} data-id={key}>{node}</div>);
    };

    // Render based on theme
    switch (theme) {
      case 'executive':
        renderExecutiveTheme({ data, addBlock, t });
        break;
      case 'modern':
        renderModernTheme({ data, addBlock, t });
        break;
      case 'sidebar':
        renderSidebarTheme({ data, addBlock, t });
        break;
      default:
        renderClassicTheme({ data, addBlock, t });
    }

    return blocks;
  };

  const blocks = getFlattenedBlocks();

  useLayoutEffect(() => {
    if (!hiddenContainerRef.current) return;

    const container = hiddenContainerRef.current;
    const children = Array.from(container.children) as HTMLElement[];

    const newPages: React.ReactNode[][] = [];
    let currentPage: React.ReactNode[] = [];
    let currentHeight = 0;

    const reservedFooterHeight = 100; // Strictly reserved height for footer area
    const effectivePageHeight = CONTENT_HEIGHT - reservedFooterHeight;

    children.forEach((child, index) => {
      const style = window.getComputedStyle(child);
      const marginTop = parseFloat(style.marginTop) || 0;
      const marginBottom = parseFloat(style.marginBottom) || 0;
      const height = child.offsetHeight + marginTop + marginBottom;

      const blockNode = blocks[index];
      const dataId = child.getAttribute('data-id') || '';
      const isHeader = dataId.endsWith('-header');

      // Proactive "Keep With Next" check for headers
      // If this is a header, check if we have room for it PLUS some content
      let forceBreak = false;
      if (isHeader) {
        // Look ahead to see the next item's height (approximate or min safe buffer)
        const minContentBuffer = 60; // Minimum space required for the content AFTER a header
        if (currentHeight + height + minContentBuffer > effectivePageHeight) {
          forceBreak = true;
        }
      }

      // Standard overflow check or forced break
      if (forceBreak || currentHeight + height > effectivePageHeight) {
        // If we are breaking, close the current page
        if (currentPage.length > 0) {
          newPages.push([...currentPage]);
        }

        // Start new page with current block
        currentPage = [blockNode];
        currentHeight = height;
      } else {
        // Fits in current page
        currentPage.push(blockNode);
        currentHeight += height;
      }
    });

    // Push the last page
    if (currentPage.length > 0) {
      newPages.push(currentPage);
    }

    setPages(newPages);
  }, [data, theme]); // Recalculate when data or theme changes

  return (
    <div className="flex flex-col items-center gap-8 print:gap-0 print:p-0 print:bg-white print:min-h-0 print:block">
      {/* Hidden container for measurement */}
      <div
        ref={hiddenContainerRef}
        style={{ width: '210mm', padding: '15mm', visibility: 'hidden', position: 'absolute', top: -9999, left: -9999, boxSizing: 'border-box' }}
        className="bg-white print:hidden"
      >
        {blocks}
      </div>

      {/* Render Pages */}
      {pages.length === 0 ? (
        <div className="w-[210mm] h-[297mm] bg-white shadow-2xl animate-pulse"></div>
      ) : (
        pages.map((pageContent, pageIndex) => (
          <div
            key={pageIndex}
            className="bg-white shadow-2xl relative print:shadow-none print:m-0 print:break-after-page relative group"
            style={{
              width: '210mm',
              height: '297mm',
              padding: '15mm',
              paddingBottom: '25mm', // Extra padding at bottom for visual balance and footer
              boxSizing: 'border-box',
              pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto',
              overflow: 'hidden' // Force strict clipping
            }}
          >
            <div className="h-full block"> {/* Changed to block for correct margin collapsing */}
              {pageContent}
            </div>

            {/* Absolute Footer - Outside of content flow */}
            {pages.length > 1 && (
              <div
                className="absolute bottom-[10mm] left-0 right-0 text-center text-slate-400 text-xs print:bottom-[10mm]"
                style={{ height: '20px' }}
              >
                {pageIndex + 1}/{pages.length}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default CVPreview;