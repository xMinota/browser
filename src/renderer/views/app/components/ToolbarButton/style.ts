import styled, { css } from 'styled-components';

import { TOOLBAR_BUTTON_WIDTH, TOOLBAR_HEIGHT } from '~/renderer/views/app/constants';
import { centerIcon } from '~/shared/mixins';
import { ITheme } from '~/interfaces/theme';

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  will-change: background-image;
  transition: 0.15s background-image;
  ${({
    size,
    disabled,
    opacity,
    isRefresh
  }: {
    size: number;
    disabled: boolean;
    opacity: number;
    isRefresh: boolean
  }) => css`
    ${centerIcon(size)};
    opacity: ${disabled ? 0.4 : opacity};
    ${isRefresh ? `
      animation: 0.4s spin;
      -webkit-animation-iteration-count: 1;
      -webkit-animation-play-state: running;
    ` : ''}
  `};

  @keyframes spin {
    0% {
      transform: rotate(0deg)
    }
    100% {
      transform: rotate(1turn)
    }
  }
`;

export const Button = styled.div`
  height: ${TOOLBAR_HEIGHT}px;
  -webkit-app-region: no-drag;
  position: relative;
  transition: 0.2s background-color, 0.2s max-width, 0.2s opacity;
  width: ${TOOLBAR_BUTTON_WIDTH}px;

  ${({ disabled, invert, theme, visible }: { disabled: boolean; invert: boolean; theme?: ITheme; visible: boolean }) => css`
    pointer-events: ${disabled ? 'none' : 'auto'};
    filter: ${theme['toolbar-navigation-filter']};
    max-width: ${visible ? '0px' : '36px'};
    pointer-events: ${visible ? 'none' : ''};
  `};
`;

export const AbButton = styled.a`
  filter: var(--toolbar-browser-action-filter)
`;

export const Circle = styled.div`
  border-radius: 4px;
  width: 32px;
  height: 32px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
  transition: 0.2s background-color;
  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
  &:active {
    background-color: rgba(0, 0, 0, 0.1) !important;   
  }
`;
