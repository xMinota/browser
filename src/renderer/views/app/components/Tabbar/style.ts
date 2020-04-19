import styled, { css } from 'styled-components';

import { TOOLBAR_BUTTON_WIDTH } from '~/renderer/views/app/constants';
import ToolbarButton from '../ToolbarButton';
import { ITheme } from '~/interfaces/theme';

export const StyledTabbar = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  transition: 0.3s opacity, 0.3s transform;
  margin-left: 5px;
  margin-right: 32px;
  display: flex;
`;

export const TabsContainer = styled.div`
  height: 100%;
  width: calc(100% - ${TOOLBAR_BUTTON_WIDTH}px);
  position: relative;
  overflow: hidden;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

export const AddTab = styled(ToolbarButton)`
  position: absolute;
  left: 0;
  top: 5px;
  max-height: 32px;

  ${({ theme }: { theme?: ITheme }) => css`
    filter: ${theme['toolbar-addtab-filter']}
  `};
`;
