import * as React from 'react';

import { observer } from 'mobx-react';
import { StyledItem, Container, Icon, Label, TextContainer } from './style';
import { icons } from '~/renderer/views/app/constants';

export const Item = observer(({ icon, text, multiline, secondText, onClick, iconSize, titleSize, secondTextSize, children, noInvert, noArrow, titleColor, secondTextColor, iconColor, noHover, disabled, style, iconStyle }: { icon: any; text: any; multiline?: boolean; secondText?: any; onClick?: any; iconSize?: number; titleSize?: number; secondTextSize?: number; children?: any; noInvert?: boolean; noArrow?: boolean; titleColor?: any; secondTextColor?: any; iconColor?: any; noHover?: boolean; disabled?: boolean; style?: any; iconStyle?: any }) => {
    if(!iconSize) {
        iconSize = 36;
    }

    if(!titleSize) {
        titleSize = 20;
    }

    if(!secondTextSize) {
        secondTextSize = 16;
    }

    if(!iconColor) {
        iconColor = -1
    }

    const selector = Math.random().toString(36).substr(2, 5);

    return (
        <StyledItem onClick={onClick} noHover={noHover} disabled={disabled} style={style} data-selector={selector} data-query={JSON.stringify({ title: text, secondary: secondText, selector })}>
            <Container>
                {icon !== "" && <Icon icon={icon} size={iconSize} centered noInvert={noInvert} color={iconColor} style={iconStyle} />}
                <TextContainer>
                    <Label size={titleSize} style={{ color: titleColor }}>{text}</Label>
                    {multiline && <Label second size={secondTextSize} style={{ color: secondTextColor }}>{secondText}</Label>}
                </TextContainer>
                {!children && !noArrow ? ( <Icon icon={icons.forward} size={34} centered vertical color={iconColor} /> ) : ''}
                {children ? ( <div style={{ alignSelf: "center", display: "flex", alignItems: "center" }}>{children}</div> ) : ''}
            </Container>
        </StyledItem>
    )
})