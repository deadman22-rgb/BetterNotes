import React, { useState, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { invoke } from '@tauri-apps/api/tauri';
import NoteEditor from './components/NoteEditor';
import Sidebar from './components/Sidebar';
import TitleBar from './components/TitleBar';
import { Note } from './types';

// Dark theme
const theme = {
  colors: {
    background: '#1E1E1E',
    sidebar: '#252526',
    primary: '#007ACC',
    text: '#CCCCCC',
    border: '#3C3C3C',
    hover: '#2A2D2E'
  },
  fonts: {
    body: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  }
};

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: ${props => props.theme.fonts.body};
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    height: 100vh;
    overflow: hidden;
  }
`;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
`;

const ContentContainer = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

// Create a default empty editor value
const DEFAULT_EDITOR_VALUE = [{ type: 'paragraph', children: [{ text: 'Start writing your notes here...' }] }];

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load notes on startup
  useEffect(() => {
    const loadNotes = async () => {
      try {
        setIsLoading(true);
        const savedNotes = await invoke<string[]>('load_notes');
        
        if (savedNotes && savedNotes.length > 0) {
          const parsedNotes = savedNotes.map(noteStr => {
            const note = JSON.parse(noteStr);
            
            // Make sure the content is properly formatted for Slate
            if (!note.content || typeof note.content !== 'string') {
              note.content = JSON.stringify(DEFAULT_EDITOR_VALUE);
            }
            
            return note;
          });
          
          setNotes(parsedNotes);
          setActiveNoteId(parsedNotes[0].id);
        } else {
          // Create a default note if no notes exist
          const defaultNote: Note = {
            id: '1',
            title: 'Welcome to BetterNotes',
            content: JSON.stringify(DEFAULT_EDITOR_VALUE),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          setNotes([defaultNote]);
          setActiveNoteId('1');
          
          // Save the default note
          await invoke('save_note', {
            id: defaultNote.id,
            content: JSON.stringify(defaultNote)
          });
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
        // Fallback to a default note
        const defaultNote: Note = {
          id: '1',
          title: 'Welcome to BetterNotes',
          content: JSON.stringify(DEFAULT_EDITOR_VALUE),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setNotes([defaultNote]);
        setActiveNoteId('1');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotes();
  }, []);

  const activeNote = notes.find(note => note.id === activeNoteId) || null;

  const handleNoteSelect = (noteId: string) => {
    setActiveNoteId(noteId);
  };

  const handleNoteUpdate = async (updatedNote: Note) => {
    try {
      const updatedNotes = notes.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      );
      
      setNotes(updatedNotes);
      
      // Save the updated note to disk
      await invoke('save_note', {
        id: updatedNote.id,
        content: JSON.stringify(updatedNote)
      });
    } catch (error) {
      console.error('Failed to save note:', error);
    }
  };

  const handleNoteCreate = async () => {
    try {
      const newNote: Note = {
        id: Date.now().toString(),
        title: 'New Note',
        content: JSON.stringify(DEFAULT_EDITOR_VALUE),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      setActiveNoteId(newNote.id);
      
      // Save the new note to disk
      await invoke('save_note', {
        id: newNote.id,
        content: JSON.stringify(newNote)
      });
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleNoteDelete = async (noteId: string) => {
    try {
      const updatedNotes = notes.filter(note => note.id !== noteId);
      setNotes(updatedNotes);
      
      if (activeNoteId === noteId) {
        setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
      }
      
      // Delete the note from disk
      await invoke('delete_note', { id: noteId });
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (isLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AppContainer>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
            Loading...
          </div>
        </AppContainer>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppContainer>
        <TitleBar />
        <ContentContainer>
          <Sidebar 
            notes={notes}
            activeNoteId={activeNoteId}
            onNoteSelect={handleNoteSelect}
            onNoteCreate={handleNoteCreate}
            onNoteDelete={handleNoteDelete}
          />
          {activeNote && (
            <NoteEditor 
              note={activeNote}
              onNoteUpdate={handleNoteUpdate}
            />
          )}
        </ContentContainer>
      </AppContainer>
    </ThemeProvider>
  );
};

export default App; 