
/**
 * Sanitizes a DOM element for PDF generation by removing potentially harmful elements
 */
export const sanitizePdfContent = (element: HTMLElement) => {
  // Remove potentially harmful elements
  const scripts = element.getElementsByTagName('script');
  Array.from(scripts).forEach(script => script.remove());
  
  // Remove event handlers
  const elements = element.getElementsByTagName('*');
  Array.from(elements).forEach(el => {
    const attrs = el.attributes;
    for (let i = attrs.length - 1; i >= 0; i--) {
      const attr = attrs[i];
      if (attr.name.startsWith('on')) {
        el.removeAttribute(attr.name);
      }
    }
  });
  
  return element;
};

