import styled, { css } from 'styled-components';

import { shadows, button } from '~/shared/mixins';
import { ITheme } from '~/interfaces/theme';

interface StyledButtonProps {
  background: string;
  foreground: string;
  type?: 'contained' | 'outlined';
  visible: boolean;
  icon?: any;
  theme?: ITheme;
}

export const StyledButton = styled.div`
  min-width: 90px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 4px;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 10px;
  padding-right: 10px;
  margin-right: -9px;

  ${({ background, foreground, type, visible, icon, theme }: StyledButtonProps) => css`
    display: ${visible ? 'auto' : 'none'};
    color: ${foreground || '#fff'};
    background-color: ${theme['button-color']};
    background-image: url(${icon});
 
    color: ${theme['button-text-color']} !important;

    &:hover {
      background-color: ${theme['button-hover']};
    }
  `};
`;

export const StyledLabel = styled.div`
  z-index: 1;
  font-weight: 400 !important;
  font-family: Roboto;
  font-size: 13px;
`;
