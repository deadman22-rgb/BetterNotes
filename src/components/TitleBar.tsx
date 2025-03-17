import React from 'react';
import styled from 'styled-components';
// Import the Tauri APIs properly for Tauri 1.x
import { appWindow } from '@tauri-apps/api/window';

const TitleBarContainer = styled.div`
  height: 32px;
  background-color: ${props => props.theme.colors.sidebar};
  display: flex;
  justify-content: space-between;
  align-items: center;
  -webkit-app-region: drag;
  user-select: none;
`;

const Title = styled.div`
  margin-left: 12px;
  font-size: 14px;
  font-weight: 500;
`;

const WindowControls = styled.div`
  display: flex;
  -webkit-app-region: no-drag;
`;

const WindowButton = styled.div`
  width: 46px;
  height: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.colors.hover};
  }
`;

const CloseButton = styled(WindowButton)`
  &:hover {
    background-color: #E81123;
  }
`;

const TitleBar: React.FC = () => {
  const handleMinimize = () => {
    try {
      appWindow.minimize();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  };

  const handleMaximize = async () => {
    try {
      const isMaximized = await appWindow.isMaximized();
      if (isMaximized) {
        await appWindow.unmaximize();
      } else {
        await appWindow.maximize();
      }
    } catch (error) {
      console.error('Failed to toggle maximize window:', error);
    }
  };

  const handleClose = () => {
    try {
      appWindow.close();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  return (
    <TitleBarContainer>
      <Title>BetterNotes</Title>
      <WindowControls>
        <WindowButton onClick={handleMinimize}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect fill="currentColor" width="10" height="1" x="1" y="6"></rect>
          </svg>
        </WindowButton>
        <WindowButton onClick={handleMaximize}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <rect fill="none" stroke="currentColor" width="9" height="9" x="1.5" y="1.5"></rect>
          </svg>
        </WindowButton>
        <CloseButton onClick={handleClose}>
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              fill="currentColor"
              d="M7.05 6l2.47-2.47a.75.75 0 0 0-1.06-1.06L6 4.94 3.53 2.47a.75.75 0 0 0-1.06 1.06L4.94 6 2.47 8.47a.75.75 0 1 0 1.06 1.06L6 7.06l2.47 2.47a.75.75 0 1 0 1.06-1.06L7.06 6z"
            ></path>
          </svg>
        </CloseButton>
      </WindowControls>
    </TitleBarContainer>
  );
};

export default TitleBar; 