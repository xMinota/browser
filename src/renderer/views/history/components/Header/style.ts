import styled, { css } from 'styled-components';
import { ITheme } from '~/interfaces/theme';

export const StyledHeader = styled.div`
    height: 200px;
`;

export const Container = styled.div`
    padding: 50px 65px 0 65px;
    display: flex;
    flex-flow: column;
`;

export const TopLayer = styled.div`
    display: flex;
    justify-content: center;
`;

export const BottomLayer = styled(TopLayer)`
    margin-top: 40px;
`;

export const Title = styled.div`
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;

    display: flex;
    align-items: center;

    margin-left: -28px;

    flex: 1;
    line-height: 0px;
    justify-content: center;

    ${({ theme }: { theme: ITheme }) => css`
        color: ${theme["general-title"]};
    `}
`;

export const Search = styled.div`
    width: 300px;
    height: 38px;
    border-radius: 4px;
    flex: 1;
    max-width: 300px;
    padding: 8px 10px;
    display: flex;

    ${({ theme }: { theme: ITheme }) => css`
        background-color: ${theme["webui-settings-search-background"]};
    `}
`;

export const SearchIcon = styled.div`
  ${({ theme, icon }: { theme: ITheme; icon: any; }) => css`
  -webkit-mask-image: url(${icon});
    
    width: 22px;
    min-width: 22px;
    height: 22px;

    -webkit-mask-size: contain;
    -webkit-mask-position: center;
    -webkit-mask-repeat: no-repeat;

    ${({ theme }: { theme: ITheme }) => css`
        background-color: ${theme["webui-settings-search-text"]};
    `}

    margin-right: 10px;
  `}
`;

export const Input = styled.input`
    border: none;
    background-color: transparent;
    outline: none;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 18px;
    display: flex;
    align-items: center;
    width: -webkit-fill-available;

    height: 38px;
    margin-top: -7px;

    ${({ theme }: { theme: ITheme }) => css`
        &::placeholder {
            color: ${theme["webui-settings-search-text"]};
        }

        color: ${theme["webui-settings-search-text"]};
    `}

`;