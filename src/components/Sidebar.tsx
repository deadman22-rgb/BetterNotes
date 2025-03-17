import React from 'react';
import styled from 'styled-components';
import { Note } from '../types';

interface SidebarProps {
  notes: Note[];
  activeNoteId: string | null;
  onNoteSelect: (noteId: string) => void;
  onNoteCreate: () => void;
  onNoteDelete: (noteId: string) => void;
}

const SidebarContainer = styled.div`
  width: 250px;
  height: 100%;
  background-color: ${props => props.theme.colors.sidebar};
  border-right: 1px solid ${props => props.theme.colors.border};
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const SidebarTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
`;

const NewNoteButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    opacity: 0.9;
  }
`;

const NotesList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const NoteItem = styled.div<{ $active: boolean }>`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${props => props.$active ? props.theme.colors.hover : 'transparent'};
  border-left: 3px solid ${props => props.$active ? props.theme.colors.primary : 'transparent'};
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const NoteTitle = styled.div`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  opacity: 0.5;
  font-size: 14px;
  
  &:hover {
    opacity: 1;
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ 
  notes, 
  activeNoteId, 
  onNoteSelect, 
  onNoteCreate, 
  onNoteDelete 
}) => {
  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>BetterNotes</SidebarTitle>
        <NewNoteButton onClick={onNoteCreate}>New</NewNoteButton>
      </SidebarHeader>
      <NotesList>
        {notes.map(note => (
          <NoteItem 
            key={note.id} 
            $active={note.id === activeNoteId}
            onClick={() => onNoteSelect(note.id)}
          >
            <NoteTitle>{note.title}</NoteTitle>
            <DeleteButton 
              onClick={(e) => {
                e.stopPropagation();
                onNoteDelete(note.id);
              }}
            >
              ×
            </DeleteButton>
          </NoteItem>
        ))}
      </NotesList>
    </SidebarContainer>
  );
};

export default Sidebar; 