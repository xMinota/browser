import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces/theme';
import { centerIcon } from '~/shared/mixins';
import { icons } from '~/renderer/views/app/constants';

export const StyledSelect = styled.div`
    padding: 8px 12px;
    border-radius: 4px;
    width: 180px;
    border: none;
    outline: none;
    font-family: Roboto;
    font-weight: 400;
    transition: background-color 0.3s, 0.2s box-shadow;
    position: relative;
    font-weight: 500;
    user-select: none;

    ${({ theme, toggled }: { theme: ITheme; toggled: boolean }) => css`
        background-color: ${theme['button-color']};
        color: ${theme['button-text-color']};

        box-shadow: 0 0 0 2px ${toggled ? '#a3c7f6' : 'transparent'};

        &:hover {
            background-color: ${theme['button-hover']};
        }
    `};
`;

export const Arrow = styled.div`
    position: absolute;
    right: 0;
    width: 32px;
    height: 32px;
    top: 0;

    background-color: #646464;
    clip-path: polygon(50% 80%, 0 34%, 100% 34%);

    transition: 0.2s transform;

    ${({ theme, toggled }: { theme: ITheme; toggled: boolean }) => css`
        background-color: ${theme['button-text-color']};
        opacity: 0.5;
        
        transform: scale(0.3) ${toggled ? 'rotate(180deg)' : 'rotate(0deg)'};
    `};
`;

export const List = styled.div`
    display: flex;
    position: absolute;
    left: 0;
    width: 100%;
    flex-direction: column;
    top: calc(32px + 2px);
    padding: 5px 0;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.2) 0px 5px 5px -3px, rgba(0, 0, 0, 0.1) 0px 8px 8px 1px, rgba(0, 0, 0, 0.2) 0px 3px 15px 2px;
    z-index: 1;

    transition: 0.2s opacity, 0.2s margin-top;

    ${({ theme, visible }: { theme: ITheme; visible: boolean }) => css`
        background-color: ${theme['webui-newtab-background-color']};
        opacity: ${visible ? 1 : 0};
        pointer-events: ${visible ? 'all' : 'none'};
        margin-top: ${visible ? '1px' : '-10px'};
    `};
`;

export const ListItem = styled.div`
    padding: 8px 0 8px 12px;
    transition: background-color 0.3s;
    font-weight: 500;
    opacity: 0.9;

    ${({ theme }: { theme: ITheme; }) => css`
        &:hover {
            background-color: ${theme['button-hover']};
        }
    `};

`;