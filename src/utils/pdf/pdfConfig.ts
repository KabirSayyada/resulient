import html2canvas from 'html2canvas';

/**
 * Consistent settings for all canvas capture operations
 */
export const CANVAS_SETTINGS = {
  scale: 2 as const,
  backgroundColor: '#ffffff',
  logging: false,
  useCORS: true,
  allowTaint: true,
  windowWidth: 1200,
  imageTimeout: 15000,
  foreignObjectRendering: false,
  onclone: (clonedDoc: Document) => {
    // Apply explicit CSS rules needed for PDF rendering
    const newStyleEl = clonedDoc.createElement('style');
    newStyleEl.textContent = `
      /* Force background colors for PDF export */
      .pdf-header, .from-indigo-400, .via-fuchsia-300, .to-blue-300, 
      .bg-gradient-to-r, .bg-gradient-to-br, .profile-header {
        background-color: #9b87f5 !important;
        color: #000000 !important;
      }
      
      /* Fix avatar images */
      .pdf-avatar, .avatar {
        overflow: visible !important;
        position: relative !important;
      }
      
      .pdf-avatar img, .avatar img, .pdf-image {
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      }
      
      /* Make sure text is visible */
      .pdf-skills-text, .text-fuchsia-700 {
        white-space: normal !important;
        word-break: break-word !important;
        overflow-wrap: break-word !important;
        max-width: 100% !important;
        overflow: visible !important;
      }
    `;
    clonedDoc.head.appendChild(newStyleEl);
    
    // Apply styles to avatar images for PDF rendering
    const avatarImgs = clonedDoc.querySelectorAll('.avatar img, .pdf-avatar img');
    avatarImgs.forEach(img => {
      img.setAttribute('crossorigin', 'anonymous');
      (img as HTMLElement).style.cssText = `
        display: block !important;
        visibility: visible !important;
        opacity: 1 !important;
        width: 100% !important;
        height: 100% !important;
        object-fit: cover !important;
      `;
    });
    
    // Apply background colors explicitly to gradient elements
    const gradientElements = clonedDoc.querySelectorAll('.bg-gradient-to-r, .bg-gradient-to-br, .from-indigo-400, .via-fuchsia-300, .to-blue-300, .profile-header, .pdf-header');
    gradientElements.forEach(el => {
      (el as HTMLElement).style.backgroundColor = '#9b87f5';
      (el as HTMLElement).style.color = '#000000';
    });
    
    // Fix all other images
    const allImages = clonedDoc.querySelectorAll('img');
    allImages.forEach(img => {
      img.setAttribute('crossorigin', 'anonymous');
      (img as HTMLElement).style.display = 'block';
      (img as HTMLElement).style.visibility = 'visible';
      (img as HTMLElement).style.opacity = '1';
    });
    
    // Fix text overflow in suggested skills section
    const skillsText = clonedDoc.querySelectorAll('.text-fuchsia-700, .pdf-skills-text');
    skillsText.forEach(el => {
      (el as HTMLElement).style.whiteSpace = 'normal';
      (el as HTMLElement).style.wordBreak = 'break-word';
      (el as HTMLElement).style.overflowWrap = 'break-word';
      (el as HTMLElement).style.maxWidth = '100%';
      (el as HTMLElement).style.overflow = 'visible';
    });
  }
};

/**
 * Security settings for PDF generation
 */
export const SECURE_PDF_SETTINGS = {
  encryption: {
    userPassword: undefined,
    ownerPassword: undefined,
    userPermissions: ['print', 'copy']
  },
  maxPdfLength: 100 * 1024 * 1024 // 100MB limit
};
