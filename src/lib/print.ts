const printableBaseCss = `
  @page {
    margin: 1.2cm 1.4cm 1.2cm 1.4cm;
    size: letter portrait;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    background: #ffffff !important;
    color: #1f2937 !important;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
    font-size: 10pt;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  .print-shell {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    background: #ffffff !important;
  }

  /* Clean print rules to avoid breaking elements awkwardly across pages */
  .print-avoid-break,
  tr,
  blockquote,
  pre,
  .calculator-results-panel {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  h1, h2, h3, h4, h5, h6 {
    page-break-after: avoid !important;
    break-after: avoid !important;
    color: #005556 !important; /* Elegant brand dark teal for headings */
  }

  /* Premium Tables Styling for High-End Financial Records */
  table {
    width: 100% !important;
    border-collapse: collapse !important;
    margin-top: 12pt;
    margin-bottom: 12pt;
    font-size: 9pt !important;
  }

  th {
    background-color: #f8fafc !important; /* Soft slate/teal background for headings */
    color: #005556 !important;
    font-weight: 700 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.05em !important;
    border-bottom: 2px solid #005556 !important;
    font-size: 8.5pt !important;
  }

  th,
  td {
    border: 1px solid #e2e8f0 !important; /* Extra fine elegant light slate border instead of harsh dark grid */
    padding: 8px 10px !important;
    vertical-align: middle !important;
    text-align: inherit;
  }

  /* Accent total row in tables */
  tr.bg-teal-50, 
  tr.bg-emerald-50, 
  tr:last-child {
    font-weight: 700 !important;
  }

  /* Ensure background fills render perfectly on pdf */
  .bg-teal-50, .bg-teal-50\/50 {
    background-color: #f0fdfa !important;
  }
  .bg-gray-50, .bg-gray-50\/50 {
    background-color: #f8fafc !important;
  }
  .text-teal-700, .text-\[\#0F766E\] {
    color: #005556 !important;
  }
  .text-emerald-600 {
    color: #0891b2 !important;
  }

  /* Signature blocks */
  .pt-8.flex.justify-between {
    margin-top: 30pt !important;
  }

  /* Hide print buttons or interactive selection controls inside printed sheet */
  button,
  select,
  input,
  textarea,
  .print-hidden,
  .print\\:hidden {
    display: none !important;
  }

  /* Legal Contracts typography (highly professional serif layout) */
  [data-print-kind="legal-document"] {
    font-family: Garamond, Georgia, "Times New Roman", serif !important;
    font-size: 11pt !important;
    line-height: 1.6 !important;
    color: #111827 !important;
    text-align: justify !important;
  }

  [data-print-kind="legal-document"] .legal-document-header {
    border-bottom: 2.5px solid #005556 !important;
    margin-bottom: 20pt !important;
    padding-bottom: 12pt !important;
    text-align: center !important;
  }

  [data-print-kind="legal-document"] .legal-document-brand {
    color: #005556 !important;
    font-family: -apple-system, sans-serif !important;
    font-size: 9.5pt !important;
    font-weight: 800 !important;
    letter-spacing: 0.15em !important;
    text-transform: uppercase !important;
  }

  [data-print-kind="legal-document"] .legal-document-title {
    margin: 8pt 0 4pt !important;
    color: #111827 !important;
    font-size: 16pt !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
  }

  [data-print-kind="legal-document"] .legal-document-body {
    white-space: pre-wrap !important;
  }

  [data-print-kind="legal-document"] .legal-document-footer {
    border-top: 1px solid #cbd5e1 !important;
    margin-top: 24pt !important;
    padding-top: 10pt !important;
    color: #475569 !important;
    font-family: -apple-system, sans-serif !important;
    font-size: 8.5pt !important;
  }
`;

export function printElementById(elementId: string, title = 'Tu Negocio RD - Documento') {
  if (typeof window === 'undefined') return false;
  const source = document.getElementById(elementId);
  if (!source) return false;

  const printWindow = window.open('', '_blank', 'width=980,height=1200');
  if (!printWindow) {
    window.print();
    return false;
  }

  // Clone node carefully to keep all deep content HTML structures
  const cloned = source.cloneNode(true) as HTMLElement;
  
  // Clean interactive / unneeded assets inside the cloned sheet before printing
  cloned.querySelectorAll('button, select, input, textarea, .print\\:hidden, [data-print-hidden]').forEach((el) => el.remove());

  // Capture all core stylesheets (Vite/Tailwind and indices) in real-time from active document to feed to the printing portal
  const styleElements = document.querySelectorAll('link[rel="stylesheet"], style');
  let stylesHtml = '';
  styleElements.forEach((style) => {
    stylesHtml += style.outerHTML;
  });

  printWindow.document.open();
  printWindow.document.write(`<!doctype html>
<html lang="es-DO">
  <head>
    <meta charset="utf-8" />
    <title>${title.replace(/</g, '&lt;')}</title>
    <!-- Tailwind application stylesheet injection -->
    ${stylesHtml}
    <!-- High-end print tuning core styles -->
    <style>
      ${printableBaseCss}
    </style>
  </head>
  <body class="bg-white p-0 m-0">
    <!-- Re-render within identical frame ID & class chain so Tailwind scoped styles run beautifully -->
    <div class="print-shell p-0 m-0 bg-white">
      <div id="${elementId}" class="${source.className}" style="${source.style.cssText}">
        ${cloned.innerHTML}
      </div>
    </div>
    <script>
      window.addEventListener('load', function () {
        // Give fonts, icons, and dynamic images a solid window frame to render correctly
        setTimeout(function () {
          window.focus();
          window.print();
          setTimeout(function () { window.close(); }, 500);
        }, 350);
      });
    </script>
  </body>
</html>`);
  printWindow.document.close();
  return true;
}
