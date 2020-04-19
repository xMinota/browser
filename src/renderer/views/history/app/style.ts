import styled, { css } from 'styled-components';
import { body2, centerIcon } from '~/shared/mixins';
import { ITheme } from '~/interfaces/theme';

export const Style = css`
  html, #app, body {
    cursor: default;
    margin: 0;
    padding: 0;
    user-drag: none;
    ${body2()}

    ${({ theme }: { theme: ITheme }) => css`
        background-color: ${theme['webui-newtab-background-color']};
    `}
  }

  * {
    box-sizing: border-box;
  }

  ::selection {
    background-color: #1a73e845;
  }

  ::-webkit-scrollbar {
      width: 10px;
  }

  ::-webkit-scrollbar-track {
      ${({ theme }: { theme: ITheme }) => css`
        background-color: ${theme['webui-newtab-background-color']};
      `}
  }

  ::-webkit-scrollbar-thumb {
      ${({ theme }: { theme: ITheme }) => css`
        border: 3px solid ${theme['webui-newtab-background-color']};
        background: ${theme["general-title"]};
      `}
      border-radius: 30px;
  }
`;

export const StyledApp = styled.div`
  height: 100vh;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['webui-newtab-background-color']};
  `}
`;

export const Icon = styled.div`
  ${({ theme, icon, size, centered, flexy, header }: { theme: ITheme; icon: any; size: number; centered: boolean; flexy?: boolean; header?: boolean }) => css`
    background-image: url(${icon});
    filter: ${theme["general-element"]};
    
    width: ${size}px;
    height: ${size}px;

    background-size: ${size}px;

    ${flexy ? `flex: 1;max-width: ${size}px;` : ''}
    ${header ? `
      border-radius: 30px;
      background-size: 28px !important;
      transition: 0.2s background-color;

      &:hover {
        background-color: ${theme["button-hover"]};
      }
    ` : ''};

    ${centered ? centerIcon() : ''}
  `}
`;