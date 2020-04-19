import styled, { css } from 'styled-components';
import { platform } from 'os';

import { TOOLBAR_HEIGHT, SEARCHBAR_HEIGHT } from '~/renderer/views/app/constants/design';
import { ITheme } from '~/interfaces/theme';
import { centerIcon } from '~/shared/mixins';

export const StyledToolbar = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-flow: row;
  align-items: center;
  color: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: ${SEARCHBAR_HEIGHT}px;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['primary']};
  `};
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  padding-right: 5px;
`;

export const ToolbarWrap = styled.div`
  display: contents;
`;

export const Separator = styled.div`
  height: 16px;
  width: 1px;
  margin: 0 3px;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['toolbar-separator-color']}
  `};
`;

export const SearchIcon = styled.div`
  ${centerIcon(18)};
  width: 34px;
  height: 26px;
  position: absolute;
  margin-left: 4px;
  margin: 3px;
  border-radius: 4px;
  margin-right: 4px;
  transition: 0.2s background-color;

  ${({ icon, selected, theme }: { icon: any; selected: boolean; theme: ITheme }) => css`
    filter: ${theme['general-element']};
    background-image: url(${icon});
    opacity: ${theme['search-icon-opacity']};
    background-color: ${selected ? theme['tertiary'] + " !important" : ''};

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }
  `};
`;

export const Input = styled.input`
  width: 100%;
  height: 32px;
  border-radius: 4px;
  border: none;
  outline: none;
  font-family: 'Inter';
  font-size: 14px;
  padding-left: 42px;
  line-height: 32px;
  padding-right: 38px;
  transition: 0.1s box-shadow;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  ${({ theme, visible, focused }: { theme: ITheme; visible: boolean; focused: boolean }) => css`
    background-color: ${theme['search-background-color']};
    color: ${theme['search-text-color']};

    color: ${visible ? "transparent" : ""};

    box-shadow: ${focused ? "0 0 0 2px #81c5ff !important" : ""};
  `};

  &::placeholder {
    color: darkgray;
  }
`;

export const Search = styled.div`
  display: flex;
  margin: 0px 5px;
  border-radius: 4px;
  transition: 0.2s box-shadow;
  width: 100%;
  box-shadow: 0 0 0 1px transparent;
  position: relative;

  ${({ theme }: { theme?: ITheme }) => css`
    &:hover {
      ${Input} {
        box-shadow: inset 0 0 0 1px ${theme['search-border-color']};
      }
    }

  `};
`;

export const URLPartContainer = styled.div`
  font-family: Inter;
  font-size: 14px;
  letter-spacing: normal;
  display: flex;
  position: absolute;
  left: 42px;
  pointer-events: none;
  padding-top: 7px;
  white-space: nowrap;
  max-width: 1028px;
  text-overflow: ellipsis;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? "" : "none"};
  `};
`;

export const Part = styled.div`
  text-overflow: ellipsis;
`;

export const Protocol = styled(Part)`
  opacity: 0.5;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? "" : "none"};
  `};
`;

export const Path = styled(Part)`
  opacity: 0.5;
`;