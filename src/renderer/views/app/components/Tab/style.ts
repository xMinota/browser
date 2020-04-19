import styled, { css } from 'styled-components';

import { transparency } from '~/renderer/constants';
import { icons } from '~/renderer/views/app/constants';
import { centerIcon, body2 } from '~/shared/mixins';
import { Tab } from '../../models/tab';
import { ITheme } from '~/interfaces/theme';

export const StyledClose = styled.div`
  position: absolute;
  right: 6px;
  height: 24px;
  width: 24px;
  background-image: url('${icons.close}');
  transition: 0.1s opacity;
  z-index: 10;
  ${centerIcon(16)};

  ${({ theme }: { theme: ITheme }) => css`
    filter: ${theme["general-element"]};
  `};

  &:hover {
    &:after {
      opacity: 1;
    }
  }

  &:after {
    content: '';
    border-radius: 50px;
    background-color: rgba(0, 0, 0, 0.08);
    transition: 0.2s opacity;
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    opacity: 0;
  }
`;

interface TabProps {
  selected: boolean;
  visible?: boolean;
  hovered?: boolean;
}

export const StyledTab = styled.div`
  position: absolute;
  height: 100%;
  width: 0;
  left: 0;
  align-items: center;
  will-change: width;
  -webkit-app-region: no-drag;
  padding-top: 4px;

  ${({ selected, visible }: TabProps) => css`
    z-index: ${selected ? 2 : 1};
    display: ${visible ? 'flex' : 'none'};
  `};
`;

interface ContentProps {
  collapsed: boolean;
  background: any;
}

export const StyledOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: 0.3s opacity;
  background-color: #f9f9f9;
  z-index: 2;

  ${({ hovered }: { hovered: boolean }) => css`
    opacity: ${hovered ? 1 : 0};
  `};
`;

export const StyledContent = styled.div`
  position: absolute;
  overflow: hidden;
  z-index: 2;
  align-items: center;
  display: flex;
  margin-left: 12px;

  ${({ collapsed, background }: ContentProps) => css`
    max-width: calc(100% - ${collapsed ? 48 : 24}px);

    &:after {
      content: '';
      width: 205px;
      height: 32px;
      position: absolute;
      transition: 0.3s background-image;
      background-image: linear-gradient(to right, transparent 70%,${background} 100%);
    }
  `};
`;

interface TitleProps {
  isIcon: boolean;
  tab?: Tab;
  theme?: ITheme;
}

export const StyledTitle = styled.div`
  ${body2()};
  font-family: 'Inter';
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: 0.2s margin-left;
  margin-left: 8px;

  ${({ tab, theme, isIcon }: TitleProps) => css`
    margin-left: ${!isIcon ? 0 : 12}px;

    &:* {
      -webkit-mask-image: linear-gradient(to right, ${tab.background} 60%, rgba(255, 255, 255, 0) 80%);
      background-clip: border-box;
      -webkit-background-clip: text;
      width: 121px;
      min-width: 121px;
      max-width: 121px;
    }
  `};
`;

export const StyledIcon = styled.div`
  height: 16px;
  min-width: 16px;
  transition: 0.2s opacity, 0.2s min-width;
  ${centerIcon()};

  ${({ isIconSet }: { isIconSet: boolean }) => css`
    min-width: ${isIconSet ? 0 : 16};
    opacity: ${isIconSet ? 0 : 1};
  `};
`;

export const StyledBorder = styled.div`
  position: absolute;
  width: 1px;
  height: 16px;
  background-color: rgba(0, 0, 0, ${transparency.dividers});
  right: -1px;
  top: 50%;
  transform: translateY(-50%);

  ${({ visible }: { visible: boolean }) => css`
    visibility: ${visible ? 'visible' : 'hidden'};
  `};
`;

export const TabContainer = styled.div`
  position: relative;
  border-radius: 6px 6px 0 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  backface-visibility: hidden;
  transition: 0.2s background-color;
  ${({ selected, hovered }: TabProps) => css`
    background-color: ${hovered ? 'rgba(33, 150, 243, 0.15)' : 'rgba(230, 230, 230, 0.25)'};
    

  `};
`;
