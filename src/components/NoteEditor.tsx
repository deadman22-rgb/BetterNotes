import React, { useState, useEffect } from 'react';
import { createEditor, Descendant, BaseEditor } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory, HistoryEditor } from 'slate-history';
import styled from 'styled-components';
import { Note } from '../types';

// Define custom Slate types
type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

// Define custom element types
type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
};

type CustomElement = ParagraphElement;

type CustomText = {
  text: string;
};

// Augment Slate's type definitions
declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface NoteEditorProps {
  note: Note;
  onNoteUpdate: (note: Note) => void;
}

const EditorContainer = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 10px 0;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  background: transparent;
  border: none;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  outline: none;
  
  &:focus {
    border-bottom: 2px solid ${props => props.theme.colors.primary};
  }
`;

const StyledEditable = styled(Editable)`
  min-height: calc(100% - 80px);
  padding: 10px 0;
  font-size: 16px;
  line-height: 1.6;
  color: ${props => props.theme.colors.text};
`;

// Create a default empty editor value
const DEFAULT_EDITOR_VALUE: CustomElement[] = [
  {
    type: 'paragraph',
    children: [{ text: 'Start writing your notes here...' }],
  },
];

const deserializeContent = (content: string): CustomElement[] => {
  try {
    if (!content) return DEFAULT_EDITOR_VALUE;
    
    const parsed = JSON.parse(content);
    
    // Make sure the value is valid for Slate
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return DEFAULT_EDITOR_VALUE;
    }
    
    return parsed as CustomElement[];
  } catch (e) {
    console.error('Error parsing note content:', e);
    return DEFAULT_EDITOR_VALUE;
  }
};

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onNoteUpdate }) => {
  const [editor] = useState<CustomEditor>(() => withHistory(withReact(createEditor())));
  const [title, setTitle] = useState(note.title);
  const [editorValue, setEditorValue] = useState<CustomElement[]>(() => 
    deserializeContent(note.content)
  );
  
  // Update local state when note changes
  useEffect(() => {
    setTitle(note.title);
    setEditorValue(deserializeContent(note.content));
  }, [note.id, note.content]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    // Auto-save after a short delay
    const updatedNote = {
      ...note,
      title: newTitle,
      updatedAt: new Date().toISOString()
    };
    
    onNoteUpdate(updatedNote);
  };
  
  const handleEditorChange = (value: CustomElement[]) => {
    setEditorValue(value);
    
    // Auto-save changes to the note
    const updatedNote = {
      ...note,
      content: JSON.stringify(value),
      updatedAt: new Date().toISOString()
    };
    
    onNoteUpdate(updatedNote);
  };
  
  return (
    <EditorContainer>
      <TitleInput 
        value={title}
        onChange={handleTitleChange}
        placeholder="Note Title"
      />
      <Slate 
        editor={editor} 
        initialValue={editorValue}
        onChange={handleEditorChange}
      >
        <StyledEditable 
          placeholder="Start writing your note here..."
          spellCheck
        />
      </Slate>
    </EditorContainer>
  );
};

export default NoteEditor; 