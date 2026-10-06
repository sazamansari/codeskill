const fs = require('fs');

const path = '/Users/mdshadabazamansari/Desktop/codeskill/frontend-v2/src/app/problems/[id]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Change wrapper class
content = content.replace(
  '<div ref={containerRef} className="flex h-dvh bg-background overflow-hidden font-sans text-foreground relative">',
  '<div ref={containerRef} className="flex flex-col h-dvh bg-background overflow-hidden font-sans text-foreground relative">'
);

// Extract the header (from <header ...> to </header>)
const headerStart = content.indexOf('        {/* ─── TOP NAVBAR ─────────────────────────────────────────────────── */}');
const headerEnd = content.indexOf('        </header>') + '        </header>'.length;
const headerContent = content.substring(headerStart, headerEnd);

// Extract the sidebar
const sidebarStart = content.indexOf('      {/* ═══════════════════════════════════════════════════════════════════════\n          1. SLIM LEFT SIDEBAR');
const sidebarEnd = content.indexOf('      </div>\n\n      {/* ═══════════════════════════════════════════════════════════════════════\n          2 & 3. MAIN CONTENT');
const sidebarContent = content.substring(sidebarStart, sidebarEnd + '      </div>'.length);

// Extract panels wrapper start
const panelsStart = content.indexOf('        {/* ─── PANELS ──────────────────────────────────────────────────────── */}');

// The line <div className="flex-1 flex flex-col min-w-0"> is right after the sidebar
const mainContentWrapperStart = content.indexOf('      <div className="flex-1 flex flex-col min-w-0">');

// We will construct the new top section
const newTopSection = `
${headerContent}

      {/* ─── MAIN ROW ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        
${sidebarContent.replace(/^/gm, '  ')}

`;

// Replace from sidebarStart to panelsStart
content = content.substring(0, sidebarStart) + newTopSection + content.substring(panelsStart);

// At the bottom, we need to close the main row before the footer, and we don't need the old closing div for mainContentWrapper
const footerStart = content.indexOf('        {/* ─── BOTTOM NAVIGATION BAR (STICKY ACTION BAR) ───────────────────── */}');

// Replace footer wrapper
const newFooterSection = `
      </div> {/* End MAIN ROW */}

      {/* ─── BOTTOM NAVIGATION BAR (STICKY ACTION BAR) ───────────────────── */}
      <footer className="coding-action-bar h-[64px] border-t border-[#1F2937] bg-[#0A0A0A] flex items-center justify-between px-6 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">
`;

// Replace footer start and remove sticky/bottom-0 classes which cause the overlapping
content = content.replace(
  '        {/* ─── BOTTOM NAVIGATION BAR (STICKY ACTION BAR) ───────────────────── */}\n        <footer className="coding-action-bar sticky bottom-0 z-40 h-[64px] border-t border-[#1F2937] bg-[#0A0A0A] flex items-center justify-between px-6 shrink-0 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] pb-[env(safe-area-inset-bottom)]">',
  newFooterSection
);

// We need to remove the extra closing </div> for the removed flex-col wrapper. It was right after the footer.
const oldFooterEnd = content.indexOf('        </footer>\n      </div>');
if (oldFooterEnd !== -1) {
  content = content.substring(0, oldFooterEnd) + '      </footer>\n' + content.substring(oldFooterEnd + '        </footer>\n      </div>'.length);
}

// Write the file back
fs.writeFileSync(path, content, 'utf8');
console.log('Successfully refactored layout in page.tsx');
