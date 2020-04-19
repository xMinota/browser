import { observer } from 'mobx-react';
import * as React from 'react';

import store from '~/renderer/views/app/store';
import { StyledToolbar, Buttons, Separator, ToolbarWrap } from './style';
import { Tabbar } from '../Tabbar';
import { Find } from '../Find';

export const Toolbar = observer(() => {
  return (
    <StyledToolbar isHTMLFullscreen={store.isHTMLFullscreen} isDisabled={false}>
      <ToolbarWrap>
        <Tabbar />
        <Find />
      </ToolbarWrap>
    </StyledToolbar>
  );
});
