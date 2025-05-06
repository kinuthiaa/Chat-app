import React, { useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  Bold, 
  Italic, 
  List, 
  Heading1, 
  Heading2, 
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';

const NoteTaker = () => {
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Inter');
  const [textAlign, setTextAlign] = useState('left');
  const [title, setTitle] = useState('Untitled Note');

  const contentRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
    ],
    content: '<p>Start writing...</p>',
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px]',
        style: `font-family: ${fontFamily}; font-size: ${fontSize};`,
      },
    },
  });

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '30px'];
  const fontFamilies = ['Inter', 'Roboto', 'Open Sans', 'Merriweather', 'Montserrat'];
  const alignButtons = [
    { icon: AlignLeft, value: 'left' },
    { icon: AlignCenter, value: 'center' },
    { icon: AlignRight, value: 'right' },
    { icon: AlignJustify, value: 'justify' }
  ];

  // Update editor styles when font settings change
  React.useEffect(() => {
    if (editor) {
      editor.setOptions({
        editorProps: {
          attributes: {
            class: 'prose max-w-none focus:outline-none min-h-[300px]',
            style: `font-family: ${fontFamily}; font-size: ${fontSize};`,
          },
        },
      });
    }
  }, [fontSize, fontFamily, editor]);

  const handleSave = () => {
    // TODO: Implement save functionality
    toast.success('Note saved successfully!');
  };

  const handleExportPDF = async () => {
    try {
      const doc = new jsPDF();
      
      // Set margins and page width
      const margin = 20;
      const pageWidth = doc.internal.pageSize.getWidth() - (margin * 2);
      
      // Add title with proper formatting
      doc.setFontSize(20);
      doc.text(title, margin, margin);
      
      // Get content from editor and clean it
      const content = editor?.getHTML() || '';
      const plainText = content.replace(/<[^>]*>/g, '');
      
      // Add content with text wrapping
      doc.setFontSize(12);
      const splitText = doc.splitTextToSize(plainText, pageWidth);
      doc.text(splitText, margin, margin + 20); // Start content 20 units below title
      
      // Save the PDF
      doc.save(`${title}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      console.error('PDF Export Error:', error);
      toast.error('Failed to download PDF');
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 bg-base-100 rounded-lg shadow-lg">
      {/* Title Input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="text-2xl font-bold mb-4 p-2 bg-transparent border-none focus:outline-none focus:ring-0"
        placeholder="Note Title..."
      />

      {/* Toolbar area */}
      <div className="flex flex-wrap items-center gap-2 mb-4 p-2 bg-base-200 rounded-lg">
        {/* Text Formatting */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor?.chain().focus().toggleBold().run()}
            className={`btn btn-sm btn-ghost ${editor?.isActive('bold') ? 'btn-active' : ''}`}
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            className={`btn btn-sm btn-ghost ${editor?.isActive('italic') ? 'btn-active' : ''}`}
          >
            <Italic className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex gap-1 border-r pr-2">
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`btn btn-sm btn-ghost ${editor?.isActive('heading', { level: 1 }) ? 'btn-active' : ''}`}
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`btn btn-sm btn-ghost ${editor?.isActive('heading', { level: 2 }) ? 'btn-active' : ''}`}
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            className={`btn btn-sm btn-ghost ${editor?.isActive('bulletList') ? 'btn-active' : ''}`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Font Controls - Replace Menu with DaisyUI Dropdown */}
        <div className="flex gap-2">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
              {fontFamily}
            </div>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              {fontFamilies.map((font) => (
                <li key={font}>
                  <button
                    onClick={() => setFontFamily(font)}
                    style={{ fontFamily: font }}
                    className="text-left"
                  >
                    {font}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-sm btn-ghost">
              {fontSize}
            </div>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-24">
              {fontSizes.map((size) => (
                <li key={size}>
                  <button
                    onClick={() => setFontSize(size)}
                    className="text-left"
                  >
                    {size}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Alignment */}
        <div className="flex gap-1 border-l pl-2">
          {alignButtons.map(({ icon: Icon, value }) => (
            <button
              key={value}
              onClick={() => editor?.chain().focus().setTextAlign(value).run()}
              className={`btn btn-sm btn-ghost ${editor?.isActive({ textAlign: value }) ? 'btn-active' : ''}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Actions */}
        <button
          onClick={handleSave}
          className="btn btn-sm btn-primary"
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </button>
        <button
          onClick={handleExportPDF}
          className="btn btn-sm btn-secondary"
        >
          <FileText className="w-4 h-4 mr-1" />
          Export PDF
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={contentRef}
        className="flex-grow border border-base-300 rounded-lg p-4 bg-base-100"
      >
        <EditorContent className='flex flex-col' editor={editor} />
      </div>
    </div>
  );
};

export default NoteTaker;