import React from 'react';
import { observer } from 'mobx-react';

import { StyledItem, Icon, Text } from './style';
import Ripple from '~/renderer/components/Ripple';
import store from '../../store';

export const Item = observer(({ icon, text, secondLine, multiline, onClick }: { icon: any; text: any; secondLine?: any; multiline?: boolean; onClick?: nany }) => (
    <StyledItem onClick={onClick}>
        <Icon icon={icon} size={22} />
        <Text>{text}</Text>
        <Ripple
          rippleTime={0.4}
          opacity={0.15}
          color={store.theme['a-hover']}
          style={{ zIndex: 9, minHeight: '48px', maxHeight: '48px', marginTop: '12px' }}
        />
    </StyledItem>
))