import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces/theme';

export const Style = css`
    ul {
        margin-top: 0;
    }

    ${({ theme }: { theme: ITheme }) => css`
        body {
            margin: 0;
            color: ${theme['webui-error-text-color']};
            background-color: ${theme['webui-error-background-color']};
            font-family: 'Segoe UI', Tahoma, sans-serif;
            font-size: 75%;
        }
    `}
`;

export const Main = styled.div`
    margin: 0 auto;
    width: calc(100% - 32px);
    max-width: 512px;
    margin: 14vh auto 0;
`;

export const Title = styled.div`
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 16px;
`;

export const Code = styled.div`
    font-size: 12px;
`;

export const Description = styled.div`
    margin-bottom: 16px;
    line-height: 1.5rem;
    font-size: 14px;
`;

export const Icon = styled.div`
    background-repeat: no-repeat;
    width: 72px;
    height: 72px;
    margin-bottom: 40px;

    ${({ theme }: { theme: ITheme }) => css`
        filter: ${theme['general-element']} ${theme['webui-error-text-color'] == '#fff' ? 'brightness(2)' : ''}
    `}
`;

export const Strong = styled.div`
    font-weight: bold;
    display: contents;
`;