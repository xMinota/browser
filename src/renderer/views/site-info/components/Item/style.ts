import styled, { css } from 'styled-components';
import { centerIcon } from '~/shared/mixins';
import { ITheme } from '~/interfaces/theme';

export const StyledItem = styled.div`
    display: flex;
    height: 48px;
    align-content: center;
    align-items: center;
    padding: 0px 18px;
    font-family: Roboto;
    transition: 0.1s background-color;

    ${({ theme }: { theme: ITheme }) => css`
        color: ${theme['general-title']};

        &:hover {
            background-color: ${theme['windows-controls-hover']};
        }
    `}
`;

export const Icon = styled.div`
  opacity: 0.8;

  ${({ theme, icon, size }: { theme: ITheme; icon: any; size: number }) => css`
    background-image: url(${icon});
    ${centerIcon(size)};
    height: ${size}px;
    width: ${size}px;

    filter: ${theme['general-element']};
  `}
`;

export const Text = styled.div`
    padding-left: 12px;
    font-size: 14px;
    display: flex;
    align-items: center;
    opacity: 0.8;

    ${({ theme }: { theme: ITheme }) => css`
        color: ${theme['general-title']};
    `}
`;