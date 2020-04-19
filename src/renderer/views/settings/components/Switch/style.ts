import styled, { css } from 'styled-components'
import { ITheme } from '~/interfaces/theme';

export const StyledSwitch = styled.div`
    width: 54px;
    height: 28px;
    border-radius: 20px;
    position: relative;
    cursor: pointer;
    transition: 0.2s background-color;
    padding: 5px;

    ${({ theme, toggled }: { theme: ITheme; toggled: boolean }) => css`
        background-color: ${toggled ? '#1286ff' : 'gray'};
    `};

    &:before {
        content: "";
        position: absolute;
        width: 18px;
        height: 18px;
        background-color: #ffffff;
        border-radius: 30px;
        cursor: pointer;
        transition: 0.2s margin-left, 0.2s box-shadow;
        top: 5px;

        ${({ theme, toggled }: { theme: ITheme; toggled: boolean }) => css`
            margin-left: ${toggled ? '26px' : '0px'};
            box-shadow: ${toggled ? 'rgba(0,0,0,0.2) 0px 5px 2px -3px, rgba(0,0,0,0.1) 0px 8px 4px 1px, rgba(0,0,0,0.2) 0px 3px 8px 2px' : ''};
        `};
    }
`;