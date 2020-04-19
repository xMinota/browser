import * as React from 'react';
import { observer } from 'mobx-react';
import { BrowserAction } from '../../models';
import { StyledBrowserAction, Badge } from './style';
import ToolbarButton from "../ToolbarButton";

interface Props {
  data: BrowserAction;
  size?: number;
  style?: any;
  opacity?: number;
  title?: string;
  onClick?: any;
  visible?: boolean;
  id?: string;
}

const Component = observer(({ data, size, style, opacity, title, onClick, visible, id }: Props) => {
  const { icon, badgeText, badgeBackgroundColor, badgeTextColor } = data;

  return (
    <StyledBrowserAction style={style}>
      <ToolbarButton opacity={opacity} size={size} icon={icon} id={id} visible={!visible} />
      {badgeText.trim() !== '' && (
        <Badge background={badgeBackgroundColor} color={badgeTextColor} visible={!visible}>
          {badgeText}
        </Badge>
      )}
    </StyledBrowserAction>
  );
});

(Component as any).defaultProps = {
  size: 16,
  opacity: 1,
};

export default Component;
