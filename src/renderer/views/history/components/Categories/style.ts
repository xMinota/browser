import styled, { css } from 'styled-components';

export const StyledCategories = styled.div`
    margin-bottom: 100px;
`;

export const Container = styled.div`
    max-width: 800px;
    display: flex;
    margin: 0 auto;
    flex-flow: column;
    position: absolute;
    left: 0;
    right: 0;
    transition: 0.3s opacity, 0.2s transform;

    ${({ visible }: { visible: boolean }) => css`
        opacity: ${visible ? 1 : 0};
        pointer-events: ${visible ? 'all' : 'none'};
        transform: ${visible ? 'translateX(0px)' : 'translateX(-10px)'};
        overflow: ${visible ? '' : 'hidden'};
        height: ${visible ? '' : 0};
    `}
`;