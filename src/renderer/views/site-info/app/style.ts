import styled, { css } from 'styled-components';
import { centerIcon } from '../../../../shared/mixins';
import { ITheme } from '~/interfaces/theme';

export const StyledApp = styled.div`
    height: -webkit-fill-available;
    display: block;
    transition: 0.1s opacity, 0.2s transform;
    border-radius: 4px;
    padding: 14px;
    box-shadow: 1px 1px 6px 2px #00000017;

    ${({ theme, visible, height, width }: { theme: ITheme; visible: boolean; height: number; width: number }) => css`
        background-color: ${theme['primary']};
        border: 1px solid ${theme['secondary']};

        height: ${height}px;
        min-height: ${height}px;
        max-height: ${height}px;

        width: ${width}px;
        min-width: ${width}px;
        max-width: ${width}px;

        opacity: ${visible ? 1 : 0};
        transform: ${visible ? 'scale(1)' : 'scale(0.98)'};
    `}
`;

export const Title = styled.div`
  font-family: 'Roboto';
  font-style: normal;
  font-weight: normal;
  font-size: 14px;

  display: flex;
  align-items: center;

  color: #DCDCDC;

  padding-top: 1px;
`;

export const Subtitle = styled(Title)`
  padding-top: 10px;
  padding-bottom: 50px;
  font-size: 14px;

  color: #ABABAB;

  max-width: 335px;

  display: block;

  b {
    font-weight: 500;
  }
`;

export const Line = styled.div`
  height: 1px;
  position: absolute;
  width: 100%;
  left: 0;

  ${({ theme }: { theme: ITheme }) => css`
    background-color: ${theme['line-color']};
  `}
`;

export const Container = styled.div`
  position: absolute;
  left: 0;
  width: 100%;
  padding: 10px 0;
`;