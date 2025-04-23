
import html2canvas from "html2canvas";

/**
 * Export a DOM element as a PNG image (base64 string or auto-download).
 * Ensures backgrounds and images render properly.
 *
 * @param element Element to capture and export.
 * @param filename Name for downloaded PNG file.
 */
export async function exportElementAsImage(element: HTMLElement, filename: string) {
  if (!element) return false;

  try {
    // Make the element visible in case it's hidden
    const originalDisplay = element.style.display;
    if (originalDisplay === 'none') {
      element.style.display = 'block';
    }

    // Add temporary export class to help with CSS targeting
    element.classList.add('image-export-in-progress');

    // Ensure images using crossOrigin for avatars
    const images = Array.from(element.querySelectorAll('img'));
    for (const img of images) {
      img.setAttribute('crossorigin', 'anonymous');
      if (!img.complete) {
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      }
    }

    // Add a margin for better aesthetics
    await new Promise((r) => setTimeout(r, 80)); // Let styles apply

    const canvas = await html2canvas(element, {
      backgroundColor: '#ffffff',
      useCORS: true,
      scale: 2,
      allowTaint: true,
      logging: false,
      imageTimeout: 15000,
      onclone: (clonedDoc: Document) => {
        // Help gradient backgrounds render
        const gradEls = clonedDoc.querySelectorAll(
          '.bg-gradient-to-r, .bg-gradient-to-br, .from-indigo-400, .via-fuchsia-300, .to-blue-300, .profile-header, .pdf-header'
        );
        gradEls.forEach((el) => {
          (el as HTMLElement).style.backgroundColor = '#9b87f5';
        });
        // Fix avatar/images
        const avatarImgs = clonedDoc.querySelectorAll('.avatar img, .pdf-avatar img');
        avatarImgs.forEach((img) => {
          img.setAttribute('crossorigin', 'anonymous');
        });
      }
    });

    // Remove export helper class
    element.classList.remove('image-export-in-progress');

    // Restore element visibility if it was changed
    if (originalDisplay === 'none') {
      element.style.display = originalDisplay;
    }

    // Trigger download
    const imgData = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = imgData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    setTimeout(() => document.body.removeChild(link), 300);
    return true;
  } catch (err) {
    console.error("Image export failed:", err);
    return false;
  }
}
