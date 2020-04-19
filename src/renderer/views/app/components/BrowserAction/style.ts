import styled, { css } from 'styled-components';

export const StyledBrowserAction = styled.div`
  position: relative;
  margin-left: 8px;
  transition: 0.2s opacity, 0.2s max-width;
`;

interface BadgeProps {
  background?: string;
  color?: string;
  visible?: boolean;
}

export const Badge = styled.div`
  position: absolute;
  padding: 1.5px 2px;
  border-radius: 9px;
  bottom: 20px;
  pointer-events: none;
  right: 3px;
  z-index: 5;
  font-size: 8px;
  transition: 0.2s opacity;

  ${({ background, color, visible }: BadgeProps) => css`
    background-color: ${background};
    color: ${color};
    opacity: ${!visible ? 1 : 0};
  `};
`;
