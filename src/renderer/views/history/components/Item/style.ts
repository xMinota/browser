import styled, { css } from "styled-components";
import { centerIcon } from '~/shared/mixins';
import { ITheme } from '~/interfaces/theme';
import { SettingsSection } from '../../store';

export const Container = styled.div`
    min-height: 74px;
    margin: 0 20px;
    display: flex;
    transition: .3s border-bottom;

    ${({ theme }: { theme: ITheme }) => css`
        border-bottom: 1px solid ${theme["webui-settings-item-border-color"]};
    `}
`;

export const StyledItem = styled.div`
    max-width: 800px;
    min-height: 74px;
    border-radius: 4px;
    transition: 0.1s background-color;

    ${({ theme, noHover, disabled }: { theme: ITheme; noHover: boolean; disabled: boolean }) => css`
        pointer-events: ${disabled ? 'none' : ''};
        opacity: ${disabled ? '0.4' : ''};

        ${!noHover ? `
            &:hover {
                background-color: ${theme["webui-settings-item-hover-color"]};

                & > ${Container} {
                    border-bottom: 1px solid transparent;
                }
            }
        ` : ''}
    `}
`;

export const Icon = styled.div`
  ${({ theme, icon, size, centered, vertical, noInvert, color }: { theme: ITheme; icon: any; size: number; centered: boolean; vertical?: boolean; noInvert?: boolean; color?: any }) => css`
    ${color == -1 ? `background` : `mask`}-image: url(${icon});
    ${color == -1 ? `${!!noInvert ? "" : `filter: ${theme["general-element"]};`}` : ''}
    
    width: ${size}px;
    height: ${size}px;

    ${color == -1 ? 'opacity: 0.8;' : ''}

    ${color == -1 ? `background` : `mask`}-size: ${size}px;

    margin: 18px 8px;

    ${centered ? centerIcon() : ''}
    ${vertical ? 'align-self: center;' : ''}
    ${color == -1 ? '' : `background-color: ${color};`}
  `}
`;

export const TextContainer = styled.div`
    display: flex;
    flex: 1;
    flex-flow: column;
    align-self: center;
    margin-left: 16px;
`;

export const Label = styled.div`
    font-family: Roboto;
    font-style: normal;
    font-weight: 500;

    display: flex;
    align-items: center;

    ${({ theme, second, size }: { theme: ITheme; second?: boolean; size?: number }) => css`
        color: ${theme["general-title"]};
        font-size: ${size}px;

        ${second ? `opacity: 0.5;` : ""}
    `}
`;