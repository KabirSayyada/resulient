
import { useState, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3,
  Link as LinkIcon,
  Image,
  Code,
  Quote
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = 'Write your content here...', 
  minHeight = '400px' 
}: RichTextEditorProps) {
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Store cursor position
  const handleSelect = () => {
    if (textareaRef.current) {
      setSelectionStart(textareaRef.current.selectionStart);
      setSelectionEnd(textareaRef.current.selectionEnd);
    }
  };

  // Insert formatting around selected text or at cursor position
  const formatText = (startTag: string, endTag: string) => {
    if (textareaRef.current) {
      const start = selectionStart;
      const end = selectionEnd;
      const selectedText = value.substring(start, end);
      const beforeSelection = value.substring(0, start);
      const afterSelection = value.substring(end);
      
      const newText = beforeSelection + startTag + selectedText + endTag + afterSelection;
      onChange(newText);
      
      // Restore focus and selection after state update
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            start + startTag.length,
            end + startTag.length
          );
        }
      });
    }
  };

  // Insert a link
  const insertLink = () => {
    if (!linkUrl) return;
    
    const linkHtml = `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText || linkUrl}</a>`;
    
    if (textareaRef.current) {
      const start = selectionStart;
      const end = selectionEnd;
      const beforeSelection = value.substring(0, start);
      const afterSelection = value.substring(end);
      
      const newText = beforeSelection + linkHtml + afterSelection;
      onChange(newText);
      
      setLinkDialogOpen(false);
      setLinkUrl('');
      setLinkText('');
      
      // Restore focus after state update
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            start + linkHtml.length,
            start + linkHtml.length
          );
        }
      });
    }
  };

  // Insert an image
  const insertImage = () => {
    if (!imageUrl) return;
    
    const imageHtml = `<img src="${imageUrl}" alt="${imageAlt}" class="max-w-full h-auto rounded my-4" />`;
    
    if (textareaRef.current) {
      const start = selectionStart;
      const beforeSelection = value.substring(0, start);
      const afterSelection = value.substring(start);
      
      const newText = beforeSelection + imageHtml + afterSelection;
      onChange(newText);
      
      setImageDialogOpen(false);
      setImageUrl('');
      setImageAlt('');
      
      // Restore focus after state update
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            start + imageHtml.length,
            start + imageHtml.length
          );
        }
      });
    }
  };

  // Load selected text into link text when opening dialog
  useEffect(() => {
    if (linkDialogOpen && textareaRef.current) {
      const selectedText = value.substring(selectionStart, selectionEnd);
      if (selectedText) {
        setLinkText(selectedText);
      }
    }
  }, [linkDialogOpen, value, selectionStart, selectionEnd]);

  return (
    <div className="border rounded-md">
      <div className="bg-muted p-2 flex flex-wrap gap-1 border-b">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<h1>', '</h1>')}
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<h2>', '</h2>')}
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<h3>', '</h3>')}
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<strong>', '</strong>')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<em>', '</em>')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<u>', '</u>')}
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<ul>\n  <li>', '</li>\n</ul>')}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<ol>\n  <li>', '</li>\n</ol>')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<code>', '</code>')}
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm" 
          onClick={() => formatText('<blockquote>', '</blockquote>')}
        >
          <Quote className="h-4 w-4" />
        </Button>
        
        <Dialog open={linkDialogOpen} onOpenChange={setLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="linkUrl">URL</Label>
                <Input 
                  id="linkUrl" 
                  value={linkUrl} 
                  onChange={(e) => setLinkUrl(e.target.value)} 
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="linkText">Text</Label>
                <Input 
                  id="linkText" 
                  value={linkText} 
                  onChange={(e) => setLinkText(e.target.value)} 
                  placeholder="Link text"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setLinkDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={insertLink}>
                Insert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm">
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input 
                  id="imageUrl" 
                  value={imageUrl} 
                  onChange={(e) => setImageUrl(e.target.value)} 
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="imageAlt">Alt Text</Label>
                <Input 
                  id="imageAlt" 
                  value={imageAlt} 
                  onChange={(e) => setImageAlt(e.target.value)} 
                  placeholder="Image description"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setImageDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={insertImage}>
                Insert
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={handleSelect}
        placeholder={placeholder}
        className="border-0 rounded-t-none min-h-[400px] resize-y"
        style={{ minHeight }}
      />
    </div>
  );
}
