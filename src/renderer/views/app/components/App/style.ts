import styled, { css } from 'styled-components';
import { transparency } from '~/renderer/constants';
import { ITheme } from '~/interfaces/theme';
import { TOOLBAR_HEIGHT, SEARCHBAR_HEIGHT } from '../../constants';

export const Line = styled.div`
  height: 1px;
  width: 100%;
  z-index: 2;
  position: absolute;
  margin-top: ${TOOLBAR_HEIGHT + SEARCHBAR_HEIGHT}px;
  display: block;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['line-color']};
  `}
`;

export const StyledApp = styled.div`
  display: flex;
  flex-flow: column;
  height: 100vh;
`;
